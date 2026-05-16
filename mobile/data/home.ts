import type { Category, Destination, RecommendedItem } from "@/types/home";

const avatar = require("../assets/image/avatar.jpg");

export const categories: Category[] = [
  { id: "1", name: "Beach", icon: "beach" },
  { id: "2", name: "Mountain", icon: "image-filter-hdr" },
  { id: "3", name: "Lake", icon: "waves" },
  { id: "4", name: "Desert", icon: "weather-sunny" },
  { id: "5", name: "Forest", icon: "forest" },
];

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Copacabana",
    country: "Brazil",
    price: 250,
    rating: 4.8,
    image: require("../assets/image/image10.jpg"),
    images: [
      require("../assets/image/image10.jpg"),
      require("../assets/image/image11.jpg"),
      require("../assets/image/image12.jpg"),
      require("../assets/image/image13.jpg"),
      require("../assets/image/image14.jpg"),
      require("../assets/image/image15.jpg"),
      require("../assets/image/benjamin-voros-AD6rn3vqG7o-unsplash.jpg"),
    ],
    description:
      "Introduction :\nCopacabana est l'une des plages les plus célèbres au monde, située au cœur de Rio de Janeiro. Son sable doré s'étend sur plus de 4 km face à l'océan Atlantique, offrant une vue spectaculaire sur la baie et les montagnes environnantes.\n\nExpérience & activités :\nVous pourrez pratiquer le beach-volley, le surf ou simplement vous détendre sous le soleil brésilien. De nombreux restaurants et bars de plage proposent des caipirinhas fraîches et une cuisine locale savoureuse. Le soir, la promenade s'anime avec des musiciens et des artistes de rue.\n\nPourquoi visiter :\nCopacabana est idéale pour ceux qui souhaitent vivre l'énergie unique de Rio tout en profitant de la mer. L'ambiance festive, la culture locale et les paysages urbains spectaculaires en font une destination inoubliable.\n\nConseils pratiques :\nPrivilégiez la visite entre décembre et mars pour profiter du soleil estival brésilien. Gardez vos affaires en sécurité sur la plage et explorez le quartier en journée.",
    reviews: [
      {
        id: "r1",
        name: "Vicky Hladynets",
        avatar,
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      },
      {
        id: "r2",
        name: "Marco Silva",
        avatar,
        rating: 4.5,
        text: "Une expérience incroyable ! La plage est magnifique et l'atmosphère de Rio est unique. Je recommande vivement de visiter tôt le matin pour profiter de la tranquillité avant l'arrivée des foules.",
      },
      {
        id: "r3",
        name: "Sophie Martin",
        avatar,
        rating: 5.0,
        text: "Absolument fantastique. La vue sur le Pain de Sucre depuis la plage est à couper le souffle. Les restaurants locaux sont excellents, surtout pour les fruits de mer frais.",
      },
    ],
  },
  {
    id: "2",
    name: "Whitehaven Beach",
    country: "Australia",
    price: 350,
    rating: 4.8,
    image: require("../assets/image/image11.jpg"),
    images: [
      require("../assets/image/image11.jpg"),
      require("../assets/image/image10.jpg"),
      require("../assets/image/image12.jpg"),
      require("../assets/image/image13.jpg"),
      require("../assets/image/image14.jpg"),
      require("../assets/image/image15.jpg"),
      require("../assets/image/elizeu-dias-RN6ts8IZ4_0-unsplash.jpg"),
    ],
    description:
      "Introduction :\nWhitehaven Beach est reconnue comme l'une des plages les plus pures au monde, nichée au cœur du Parc Marin de la Grande Barrière de Corail en Australie. Son sable blanc siliceux à 98% lui confère une blancheur et une douceur exceptionnelles.\n\nExpérience & activités :\nExplorez Hill Inlet au lever du soleil pour contempler les tourbillons de sable blanc et d'eau turquoise. La plongée en apnée, la voile et les promenades en catamaran sont les activités phares de la région. Une faune marine exceptionnelle vous attend sous les eaux.\n\nPourquoi visiter :\nIsolée et préservée, Whitehaven Beach offre une expérience de nature pure, loin de l'agitation touristique. C'est l'une des rares plages au monde où le sable ne chauffe pas sous le soleil grâce à sa composition en silice.\n\nConseils pratiques :\nAccessible uniquement en bateau ou en hydravion depuis Airlie Beach. Prévoyez une journée complète pour profiter pleinement du site. Emportez vos propres provisions car il n'y a pas de commerces sur place.",
    reviews: [
      {
        id: "r1",
        name: "Vicky Hladynets",
        avatar,
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      },
      {
        id: "r2",
        name: "James Cooper",
        avatar,
        rating: 5.0,
        text: "The most beautiful beach I've ever seen in my life. The white silica sand is incredibly soft and the turquoise water is crystal clear. Absolutely worth the boat trip to get there.",
      },
      {
        id: "r3",
        name: "Amélie Dubois",
        avatar,
        rating: 4.5,
        text: "Époustouflant ! Le sable est d'une blancheur immaculée et l'eau d'une transparence incroyable. Le survol en hydravion pour arriver sur place est déjà une expérience en soi.",
      },
    ],
  },
  {
    id: "3",
    name: "Seychelles",
    country: "Seychelles",
    price: 739,
    rating: 4.8,
    image: require("../assets/image/image12.jpg"),
    images: [
      require("../assets/image/image12.jpg"),
      require("../assets/image/image11.jpg"),
      require("../assets/image/image10.jpg"),
      require("../assets/image/image13.jpg"),
      require("../assets/image/image14.jpg"),
      require("../assets/image/image15.jpg"),
      require("../assets/image/benjamin-voros-AD6rn3vqG7o-unsplash.jpg"),
    ],
    description:
      "Introduction :\nL'archipel des Seychelles, composé de 115 îles dispersées dans l'océan Indien, est souvent décrit comme le paradis sur Terre. Ses plages de granit rose, ses eaux cristallines et sa végétation luxuriante en font une destination de rêve absolue.\n\nExpérience & activités :\nSnorkeling et plongée sous-marine parmi des récifs coralliens exceptionnels, kayak entre les formations rocheuses granitiques uniques, randonnées dans les réserves naturelles classées au patrimoine mondial. La réserve de Vallée de Mai abrite le célèbre coco de mer.\n\nPourquoi visiter :\nLes Seychelles offrent un luxe naturel incomparable, combinant plages idylliques, biodiversité unique et culture créole authentique. C'est une destination prisée pour les lunes de miel et les voyageurs en quête d'évasion totale.\n\nConseils pratiques :\nLa meilleure période de visite s'étend d'avril à mai et d'octobre à novembre. Louez un véhicule pour explorer les différentes plages de Mahé ou Praslin. Les resorts de luxe sont nombreux mais il existe aussi des guesthouses plus abordables.",
    reviews: [
      {
        id: "r1",
        name: "Vicky Hladynets",
        avatar,
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      },
      {
        id: "r2",
        name: "Elena Rossi",
        avatar,
        rating: 5.0,
        text: "Le paradis existe et il s'appelle les Seychelles. Les rochers de granit rose sur la plage d'Anse Source d'Argent sont à couper le souffle. La faune marine est d'une richesse extraordinaire.",
      },
      {
        id: "r3",
        name: "David Chen",
        avatar,
        rating: 4.7,
        text: "Absolutely stunning destination. The granite boulders, turquoise lagoons and lush tropical vegetation create landscapes unlike anywhere else on Earth. Worth every penny.",
      },
    ],
  },
  {
    id: "4",
    name: "Grace Bay Beach",
    country: "Turks & Caicos",
    price: 150,
    rating: 4.8,
    image: require("../assets/image/image13.jpg"),
    images: [
      require("../assets/image/image13.jpg"),
      require("../assets/image/image10.jpg"),
      require("../assets/image/image11.jpg"),
      require("../assets/image/image12.jpg"),
      require("../assets/image/image14.jpg"),
      require("../assets/image/image15.jpg"),
      require("../assets/image/elizeu-dias-RN6ts8IZ4_0-unsplash.jpg"),
    ],
    description:
      "Introduction :\nGrace Bay Beach est l'une des plages les plus emblématiques du monde, célèbre pour son sable blanc immaculé et ses eaux turquoise cristallines. Que vous souhaitiez vous détendre au soleil, nager dans une mer calme ou profiter des sports nautiques, cette plage offre une expérience inoubliable pour tous les voyageurs.\n\nExpérience & activités :\nVous pourrez explorer les récifs coralliens en snorkeling, faire des balades en kayak ou tout simplement flâner le long du rivage au coucher du soleil. Les restaurants et cafés à proximité offrent des plats locaux frais et des cocktails exotiques, parfaits pour compléter votre journée.\n\nPourquoi visiter :\nGrace Bay Beach est idéale pour les couples, les familles et les aventuriers. Chaque visiteur peut trouver son moment parfait, que ce soit en lisant un livre sur le sable chaud, en découvrant la vie marine ou en se laissant séduire par le charme local.\n\nConseils pratiques :\nLa période idéale pour visiter est de décembre à avril, lorsque le temps est ensoleillé et les vents faibles. Réservez à l'avance pendant les fêtes car les hébergements sont très demandés.",
    reviews: [
      {
        id: "r1",
        name: "Vicky Hladynets",
        avatar,
        rating: 4.8,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
      {
        id: "r2",
        name: "Sarah Johnson",
        avatar,
        rating: 5.0,
        text: "Grace Bay is hands down the most beautiful beach I have ever visited. The water is impossibly clear and the sand is like powdered sugar. Absolutely magical at sunset.",
      },
      {
        id: "r3",
        name: "Pierre Leblanc",
        avatar,
        rating: 4.6,
        text: "Une plage d'exception. L'eau est d'une clarté remarquable et les couleurs du lagon au coucher du soleil sont simplement magiques. Un incontournable pour tous les amoureux de la mer.",
      },
    ],
  },
];

export const recommended: RecommendedItem[] = [
  {
    id: "1",
    name: "Mont Everest",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor",
    price: 246,
    rating: 4.8,
    image: require("../assets/image/image16.jpg"),
  },
  {
    id: "2",
    name: "Paris",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 539,
    rating: 4.8,
    image: require("../assets/image/image1.jpg"),
  },
  {
    id: "3",
    name: "Machu Picchu",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: 678,
    rating: 4.8,
    image: require("../assets/image/image2.jpg"),
  },
];
