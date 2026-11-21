# Migration MongoDB/Mongoose → MySQL/Prisma (backend)

## Pourquoi
Le réseau de la machine de dev coupe les connexions TLS (Atlas, Docker Hub inaccessibles de façon fiable).
MySQL est déjà installé localement (Homebrew, port 3306) : on passe le backend sur MySQL + Prisma.

## Objectifs
- Remplacer Mongoose par Prisma sur les 5 modèles, 6 controllers, middleware auth, 3 seeds.
- **Aucun changement côté mobile** : mêmes routes, mêmes formes de réponses JSON (y compris `_id`).

## Non-objectifs
- Pas de migration des données Atlas (la base Atlas est vide ou quasi vide ; on re-seed).
- Pas de refonte des routes, de l'auth ou de la logique métier.

## Approches considérées
- **Sequelize** : plus proche de Mongoose, pur JS. Non retenu.
- **Prisma** (choisi par l'utilisateur) : schéma déclaratif, migrations, client typé.
  Risque : Prisma télécharge des binaires au `generate` — à surveiller vu le réseau.

## Décisions
- **Base** : MySQL local, base `globetrek`, `DATABASE_URL=mysql://USER:PASS@localhost:3306/globetrek`.
- **IDs** : `String @id @default(cuid())` (les IDs restent des chaînes comme avant).
- **Compat `_id`** : les réponses JSON exposent `_id` (alias de `id`) pour que le mobile marche tel quel.
- **Destination.images** : colonne `Json` (tableau d'URLs). `image` (virtual) calculé dans la réponse.
- **Reviews** : table `Review` liée à `Destination` (au lieu du sous-document).
- **Enums** : `Category`, `ReservationStatus`, `NotificationType` en enums Prisma.
- **Champs cachés** (`password`, `otp`, `otpExpiry`, `refreshToken`) : `omit` global du client Prisma,
  réactivés explicitement là où nécessaire (login, OTP, refresh).
- **Hooks Mongoose** → helpers : hash bcrypt du mot de passe et génération du `bookingRef` faits dans le code.
- **Contraintes** : `User.email` unique, `Reservation.bookingRef` unique, `Favorite(userId, destinationId)` unique.
  L'erreur Mongo `11000` devient Prisma `P2002`.
- **Recherche** `$regex` insensible à la casse → `contains` (la collation MySQL par défaut est insensible à la casse).
- **Suppression en cascade** des favoris/réservations/notifications/reviews avec leur parent.
- `mongoose` retiré de `package.json`.

## Laissé au builder
- Structure exacte du helper de sérialisation `_id`.
- Scripts npm (`db:migrate`, `db:seed`).
