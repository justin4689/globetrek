# Paiement d'un acompte Stripe à la réservation

## Pourquoi
Aujourd'hui une réservation se crée sans payer. On veut forcer le paiement d'un acompte par carte
avant qu'une réservation existe, en **mode test Stripe** (cartes de test), pour valider le parcours.

## Règles métier (décidées par l'utilisateur)
- **Pas de réservation sans acompte payé.** Paiement échoué ou abandonné → aucune réservation.
- **Acompte = 30 % du total**, payé dans l'app. **70 % payés sur place** (aucun second paiement dans l'app).
- **Annulation ≥ 48 h avant le check-in → acompte remboursé intégralement.** Moins de 48 h → aucun remboursement
  (l'annulation reste possible).
  - *Choix de conception :* les dates n'ont pas d'heure ; le check-in compte comme le **jour d'arrivée à 00:00 UTC**.
    Exemple : arrivée le 10 → remboursable jusqu'au 8 à 00:00 UTC.

## Objectifs
- Payer l'acompte avec la feuille de paiement native Stripe, dans Expo Go.
- Le serveur est la seule source de vérité pour les montants et la création de la réservation.
- Remboursement automatique de l'acompte quand la règle des 48 h le permet.

## Non-objectifs
- Apple Pay / Google Pay (demandent un build de développement), cartes enregistrées.
- Paiement du solde dans l'app, multi-devises (tout est en USD, comme les prix affichés).
- Webhook Stripe (prévu plus tard, l'architecture doit le permettre sans refonte).

## Approches considérées
- **A. Feuille de paiement + confirmation vérifiée par le serveur — choisie.** Le serveur crée un PaymentIntent,
  l'app affiche la PaymentSheet, puis appelle le serveur qui vérifie le paiement auprès de Stripe et crée la réservation.
  Fonctionne en local tout de suite. Limite : si l'app se ferme entre le paiement et l'appel de confirmation,
  l'acompte est payé sans réservation (rattrapable par le webhook plus tard).
- B. Réservation créée par webhook Stripe : la plus fiable, mais demande un tunnel (Stripe CLI) en local. Plus tard.
- C. Stripe Checkout dans le navigateur : sort de l'app, moins bonne expérience. Écartée.

## Conception

### Montants (serveur uniquement)
- `total = prix/nuit/voyageur × nuits × voyageurs` (formule existante).
- `deposit = arrondi au centime de total × 0,30` ; `balance = total − deposit` (la somme tombe toujours juste).
- Stripe reçoit des **centimes** (`Math.round(deposit × 100)`), devise `usd`.
- L'app n'envoie jamais de montant : seulement destination, dates, voyageurs.

### Données (Prisma, migration)
Sur `Reservation` :
- `depositAmount Float`, `balanceDue Float`
- `paymentIntentId String? @unique` (garantit une seule réservation par paiement)
- `paymentStatus` : enum `deposit_paid | refunded | non_refundable`
  (`non_refundable` = annulée à moins de 48 h, acompte conservé)
- Les réservations existantes (seed) : `depositAmount`/`balanceDue` calculés depuis `price`, `paymentStatus = deposit_paid`.

### API
- `POST /reservations/payment-intent` `{ destinationId, checkIn, checkOut, guests }`
  → mêmes validations que la création actuelle (dates, check-in pas dans le passé, voyageurs) ;
  crée un PaymentIntent (montant de l'acompte, `automatic_payment_methods`, metadata : userId, destinationId,
  checkIn, checkOut, guests, total) ; renvoie `{ clientSecret, paymentIntentId, total, deposit, balance }`.
- `POST /reservations/confirm` `{ paymentIntentId }`
  → récupère le PaymentIntent chez Stripe ; refuse si `status !== 'succeeded'` ou si `metadata.userId` n'est pas
  l'utilisateur connecté ; **idempotent** : si une réservation existe déjà pour ce `paymentIntentId`, la renvoie ;
  sinon crée la réservation depuis la metadata + notifications `reservation_confirmed` et `payment_successful`
  (montant de l'acompte, liées à la réservation).
- `POST /reservations` (création sans paiement) : **supprimée**, sinon on contourne l'acompte.
- `PATCH /reservations/:id/cancel` : si `checkIn − maintenant ≥ 48 h` → `stripe.refunds.create({ payment_intent })`
  puis `paymentStatus = refunded` ; sinon `non_refundable`. Statut `cancelled` dans les deux cas. Si le
  remboursement Stripe échoue, l'annulation échoue (rien n'est modifié) et une erreur claire est renvoyée.
  La notification d'annulation indique « Your deposit of $X has been refunded » ou « non-refundable ».
- Les réservations du seed (sans `paymentIntentId`) s'annulent sans appel Stripe.
- La logique Stripe vit dans `backend/src/services/payment.service.js`, réutilisable par un futur webhook.

### Mobile
- Paquet `@stripe/stripe-react-native` (via `npx expo install`), `StripeProvider` dans `app/_layout.tsx`,
  clé publique dans `mobile/.env` : `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…`.
- **Écran de réservation** : récapitulatif « Total », « Deposit due now (30%) », « Pay at the property (70%) » ;
  bouton « Pay deposit · $X ». Au tap : payment-intent → `initPaymentSheet` (merchantDisplayName « GlobeTrek »,
  `returnURL` sur le scheme de l'app pour la 3D Secure) → `presentPaymentSheet`.
  Annulé par l'utilisateur → on reste sur l'écran, sans message d'erreur. Échec → alerte avec le message Stripe.
  Succès → `confirm` → ouverture du détail de la réservation créée.
- **Détail d'une réservation** : répartition « Deposit paid », « Pay at the property », et selon le cas
  « Deposit refunded » / « Deposit non-refundable ».
- **Annulation** : le message de confirmation dit avant l'annulation si l'acompte sera remboursé
  (calcul côté app à partir du check-in, le serveur reste l'arbitre).

### Tests
- Cartes de test : `4242 4242 4242 4242` (succès), `4000 0027 6000 3184` (3D Secure), `4000 0000 0000 9995` (refusée).
- Tests API (curl) : montants, refus d'un paiement non abouti, idempotence de `confirm`, remboursement ≥ 48 h,
  pas de remboursement < 48 h.
- Le scénario Maestro `booking` doit être adapté (saisie de la carte de test dans la feuille Stripe).

## Ce qui reste à l'utilisateur
- Fournir la **clé publique de test** `pk_test_…` (tableau de bord Stripe → Developers → API keys).

## Laissé au builder
- Libellés exacts, mise en page du récapitulatif, structure interne des fichiers.
