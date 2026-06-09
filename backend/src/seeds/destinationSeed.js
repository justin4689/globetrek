const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Destination = require('../models/Destination');

// Placeholder images — remplace par tes URLs Cloudinary quand tu uploades les vraies images
const img = (name) => `https://placehold.co/800x600?text=${encodeURIComponent(name)}`;

const destinations = [
  {
    name: 'Copacabana',
    country: 'Brazil',
    category: 'Beach',
    price: 250,
    rating: 4.8,
    isFeatured: false,
    images: Array(7).fill(img('Copacabana')),
    description:
      "Introduction :\nCopacabana est l'une des plages les plus célèbres au monde, située au cœur de Rio de Janeiro. Son sable doré s'étend sur plus de 4 km face à l'océan Atlantique, offrant une vue spectaculaire sur la baie et les montagnes environnantes.\n\nExpérience & activités :\nVous pourrez pratiquer le beach-volley, le surf ou simplement vous détendre sous le soleil brésilien. De nombreux restaurants et bars de plage proposent des caipirinhas fraîches et une cuisine locale savoureuse. Le soir, la promenade s'anime avec des musiciens et des artistes de rue.\n\nPourquoi visiter :\nCopacabana est idéale pour ceux qui souhaitent vivre l'énergie unique de Rio tout en profitant de la mer. L'ambiance festive, la culture locale et les paysages urbains spectaculaires en font une destination inoubliable.\n\nConseils pratiques :\nPrivilégiez la visite entre décembre et mars pour profiter du soleil estival brésilien. Gardez vos affaires en sécurité sur la plage et explorez le quartier en journée.",
    reviews: [
      { name: 'Vicky Hladynets', rating: 4.8, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
      { name: 'Marco Silva', rating: 4.5, text: "Une expérience incroyable ! La plage est magnifique et l'atmosphère de Rio est unique. Je recommande vivement de visiter tôt le matin pour profiter de la tranquillité avant l'arrivée des foules." },
      { name: 'Sophie Martin', rating: 5.0, text: 'Absolument fantastique. La vue sur le Pain de Sucre depuis la plage est à couper le souffle. Les restaurants locaux sont excellents, surtout pour les fruits de mer frais.' },
    ],
  },
  {
    name: 'Whitehaven Beach',
    country: 'Australia',
    category: 'Beach',
    price: 350,
    rating: 4.8,
    isFeatured: false,
    images: Array(7).fill(img('Whitehaven Beach')),
    description:
      "Introduction :\nWhitehaven Beach est reconnue comme l'une des plages les plus pures au monde, nichée au cœur du Parc Marin de la Grande Barrière de Corail en Australie. Son sable blanc siliceux à 98% lui confère une blancheur et une douceur exceptionnelles.\n\nExpérience & activités :\nExplorez Hill Inlet au lever du soleil pour contempler les tourbillons de sable blanc et d'eau turquoise. La plongée en apnée, la voile et les promenades en catamaran sont les activités phares de la région. Une faune marine exceptionnelle vous attend sous les eaux.\n\nPourquoi visiter :\nIsolée et préservée, Whitehaven Beach offre une expérience de nature pure, loin de l'agitation touristique. C'est l'une des rares plages au monde où le sable ne chauffe pas sous le soleil grâce à sa composition en silice.\n\nConseils pratiques :\nAccessible uniquement en bateau ou en hydravion depuis Airlie Beach. Prévoyez une journée complète pour profiter pleinement du site. Emportez vos propres provisions car il n'y a pas de commerces sur place.",
    reviews: [
      { name: 'Vicky Hladynets', rating: 4.8, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
      { name: 'James Cooper', rating: 5.0, text: "The most beautiful beach I've ever seen in my life. The white silica sand is incredibly soft and the turquoise water is crystal clear. Absolutely worth the boat trip to get there." },
      { name: 'Amélie Dubois', rating: 4.5, text: "Époustouflant ! Le sable est d'une blancheur immaculée et l'eau d'une transparence incroyable. Le survol en hydravion pour arriver sur place est déjà une expérience en soi." },
    ],
  },
  {
    name: 'Seychelles',
    country: 'Seychelles',
    category: 'Beach',
    price: 739,
    rating: 4.8,
    isFeatured: false,
    images: Array(7).fill(img('Seychelles')),
    description:
      "Introduction :\nL'archipel des Seychelles, composé de 115 îles dispersées dans l'océan Indien, est souvent décrit comme le paradis sur Terre. Ses plages de granit rose, ses eaux cristallines et sa végétation luxuriante en font une destination de rêve absolue.\n\nExpérience & activités :\nSnorkeling et plongée sous-marine parmi des récifs coralliens exceptionnels, kayak entre les formations rocheuses granitiques uniques, randonnées dans les réserves naturelles classées au patrimoine mondial. La réserve de Vallée de Mai abrite le célèbre coco de mer.\n\nPourquoi visiter :\nLes Seychelles offrent un luxe naturel incomparable, combinant plages idylliques, biodiversité unique et culture créole authentique. C'est une destination prisée pour les lunes de miel et les voyageurs en quête d'évasion totale.\n\nConseils pratiques :\nLa meilleure période de visite s'étend d'avril à mai et d'octobre à novembre. Louez un véhicule pour explorer les différentes plages de Mahé ou Praslin. Les resorts de luxe sont nombreux mais il existe aussi des guesthouses plus abordables.",
    reviews: [
      { name: 'Vicky Hladynets', rating: 4.8, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
      { name: 'Elena Rossi', rating: 5.0, text: "Le paradis existe et il s'appelle les Seychelles. Les rochers de granit rose sur la plage d'Anse Source d'Argent sont à couper le souffle. La faune marine est d'une richesse extraordinaire." },
      { name: 'David Chen', rating: 4.7, text: 'Absolutely stunning destination. The granite boulders, turquoise lagoons and lush tropical vegetation create landscapes unlike anywhere else on Earth. Worth every penny.' },
    ],
  },
  {
    name: 'Grace Bay Beach',
    country: 'Turks & Caicos',
    category: 'Beach',
    price: 150,
    rating: 4.8,
    isFeatured: false,
    images: Array(7).fill(img('Grace Bay Beach')),
    description:
      "Introduction :\nGrace Bay Beach est l'une des plages les plus emblématiques du monde, célèbre pour son sable blanc immaculé et ses eaux turquoise cristallines. Que vous souhaitiez vous détendre au soleil, nager dans une mer calme ou profiter des sports nautiques, cette plage offre une expérience inoubliable pour tous les voyageurs.\n\nExpérience & activités :\nVous pourrez explorer les récifs coralliens en snorkeling, faire des balades en kayak ou tout simplement flâner le long du rivage au coucher du soleil. Les restaurants et cafés à proximité offrent des plats locaux frais et des cocktails exotiques, parfaits pour compléter votre journée.\n\nPourquoi visiter :\nGrace Bay Beach est idéale pour les couples, les familles et les aventuriers. Chaque visiteur peut trouver son moment parfait, que ce soit en lisant un livre sur le sable chaud, en découvrant la vie marine ou en se laissant séduire par le charme local.\n\nConseils pratiques :\nLa période idéale pour visiter est de décembre à avril, lorsque le temps est ensoleillé et les vents faibles. Réservez à l'avance pendant les fêtes car les hébergements sont très demandés.",
    reviews: [
      { name: 'Vicky Hladynets', rating: 4.8, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
      { name: 'Sarah Johnson', rating: 5.0, text: 'Grace Bay is hands down the most beautiful beach I have ever visited. The water is impossibly clear and the sand is like powdered sugar. Absolutely magical at sunset.' },
      { name: 'Pierre Leblanc', rating: 4.6, text: "Une plage d'exception. L'eau est d'une clarté remarquable et les couleurs du lagon au coucher du soleil sont simplement magiques. Un incontournable pour tous les amoureux de la mer." },
    ],
  },
  {
    name: 'Mont Everest',
    country: 'Nepal',
    category: 'Mountain',
    price: 246,
    rating: 4.8,
    isFeatured: true,
    images: Array(7).fill(img('Mont Everest')),
    description:
      "Introduction :\nLe Mont Everest, point culminant de la Terre à 8 849 m d'altitude, est une destination mythique pour les aventuriers du monde entier. Situé dans l'Himalaya entre le Népal et le Tibet, il attire des milliers de trekkeurs chaque année vers ses camps de base.\n\nExpérience & activités :\nLe trek jusqu'au Camp de Base Everest (5 364 m) est l'une des randonnées les plus emblématiques au monde. En chemin, vous traverserez des villages sherpa authentiques, des monastères bouddhistes et des paysages himalayens à couper le souffle. La flore et la faune locales sont également fascinantes.\n\nPourquoi visiter :\nL'Everest représente le défi ultime et l'aventure humaine dans sa plus pure expression. Même sans atteindre le sommet, le trek vers le camp de base offre une expérience transformatrice face à la grandeur de la nature.\n\nConseils pratiques :\nLa meilleure période est d'octobre à novembre ou d'avril à mai. Prévoyez une acclimatation progressive à l'altitude. Engagez un guide local sherpa expérimenté et souscrivez une assurance rapatriement adaptée.",
    reviews: [
      { name: 'Thomas Müller', rating: 5.0, text: 'An absolutely life-changing experience. The trek to Everest Base Camp pushed me to my limits and rewarded me with the most breathtaking views I have ever seen. The Sherpa guides are incredible.' },
      { name: 'Claire Fontaine', rating: 4.7, text: 'Une aventure inoubliable. Les paysages himalayens sont d\'une beauté saisissante. Les villages sherpa et les monastères ajoutent une dimension culturelle et spirituelle unique au voyage.' },
      { name: 'Kenji Tanaka', rating: 4.8, text: 'Standing at Everest Base Camp was a dream come true. The journey is demanding but every step is worth it. Make sure to take time to acclimatize and enjoy the stunning scenery along the way.' },
    ],
  },
  {
    name: 'Paris',
    country: 'France',
    category: 'City',
    price: 539,
    rating: 4.8,
    isFeatured: true,
    images: Array(7).fill(img('Paris')),
    description:
      "Introduction :\nParis, la Ville Lumière, est l'une des destinations les plus visitées et les plus célébrées au monde. Capitale de la France, elle est reconnue mondialement pour son architecture élégante, sa gastronomie raffinée, ses musées de renommée mondiale et son atmosphère romantique unique.\n\nExpérience & activités :\nMontez au sommet de la Tour Eiffel pour une vue panoramique inoubliable, explorez le Louvre et ses trésors artistiques, flânez sur les Champs-Élysées et dégustez une pâtisserie dans un café parisien. Montmartre, le Marais et les bords de Seine offrent également une expérience authentique de la vie parisienne.\n\nPourquoi visiter :\nParis est la destination idéale pour les amateurs d'art, de culture, de mode et de gastronomie. Chaque quartier possède son propre caractère et ses propres trésors à découvrir. La ville est également parfaite pour les voyages romantiques en couple.\n\nConseils pratiques :\nLe printemps (avril-mai) et l'automne (septembre-octobre) sont les meilleures périodes pour visiter. Achetez vos billets pour les musées à l'avance et explorez la ville à pied ou à vélo pour en découvrir tous les recoins.",
    reviews: [
      { name: 'Isabella Romano', rating: 4.9, text: 'Paris is simply magical. Every street, every café, every monument has its own story. The food is extraordinary and the art scene is world-class. I fell in love with this city completely.' },
      { name: 'Lucas Bernard', rating: 4.7, text: "Une ville magnifique qui ne déçoit jamais. La Tour Eiffel illuminée la nuit est un spectacle à ne pas manquer. Les musées sont exceptionnels et la cuisine parisienne est incomparable." },
      { name: 'Mia Johansson', rating: 5.0, text: 'The most romantic city in the world. Walking along the Seine at sunset, visiting hidden art galleries in Le Marais, having croissants at a street café — Paris is pure perfection.' },
    ],
  },
  {
    name: 'Machu Picchu',
    country: 'Peru',
    category: 'Mountain',
    price: 678,
    rating: 4.8,
    isFeatured: true,
    images: Array(7).fill(img('Machu Picchu')),
    description:
      "Introduction :\nMachu Picchu, la cité inca perdue dans les nuages, est l'un des sites archéologiques les plus extraordinaires et les plus mystérieux du monde. Perchée à 2 430 m d'altitude dans les Andes péruviennes, cette ancienne cité inca classée au patrimoine mondial de l'UNESCO est un trésor de l'humanité.\n\nExpérience & activités :\nExplorez les terrasses agricoles, les temples solaires et les mystérieuses structures en pierre de la cité inca. Le trek de l'Inca Trail sur 4 jours est l'une des randonnées les plus célèbres au monde. La Porte du Soleil (Inti Punku) offre une vue panoramique spectaculaire sur la cité.\n\nPourquoi visiter :\nMachu Picchu incarne le génie de la civilisation inca et la beauté sauvage des Andes. Chaque pierre raconte une histoire vieille de plusieurs siècles. Ce site unique au monde ne ressemble à rien d'autre sur Terre et marquera votre mémoire à jamais.\n\nConseils pratiques :\nRéservez vos billets d'entrée et les permis du trek Inca Trail plusieurs mois à l'avance car les places sont très limitées. La meilleure saison est de mai à septembre. Commencez votre visite tôt le matin pour éviter les foules et profiter du lever du soleil sur les ruines.",
    reviews: [
      { name: 'Ana Gonzalez', rating: 5.0, text: 'Machu Picchu is one of those places that takes your breath away the moment you see it. The mystical atmosphere, the ancient stones and the dramatic mountain backdrop create an unforgettable experience.' },
      { name: 'François Dupont', rating: 4.8, text: "Un site absolument fascinant. La cité inca émergeant des nuages dans les premières heures de la matinée est un spectacle à couper le souffle. Le trek Inca Trail pour y accéder est une aventure en soi." },
      { name: 'Oliver Schmidt', rating: 4.7, text: 'One of the most impressive archaeological sites I have ever visited. The precision of the Inca stonework is mind-blowing. Go early in the morning to see it in the mist — truly magical.' },
    ],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await Destination.deleteMany({});
  const inserted = await Destination.insertMany(destinations);

  console.log(`✅ ${inserted.length} destinations seeded:`);
  inserted.forEach((d) => console.log(`   [${d.isFeatured ? 'FEATURED' : '       '}] ${d.name} (${d.country}) — $${d.price} — ${d.category} — _id: ${d._id}`));

  await mongoose.disconnect();
  console.log('✅ Done');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
