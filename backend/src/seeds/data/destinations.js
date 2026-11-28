// Demo destinations, shared by destinationSeed.js (full reset) and syncDestinationContent.js
// (updates text and photos in place, keeping reservations and favorites).

// Photos served by the API from backend/public/images: 7 per destination, "<slug>-1.jpg" is the cover.
// Sources and licences: backend/public/images/CREDITS.md
const PHOTOS_PER_DESTINATION = 7;
const slug = (name) => name.toLowerCase().replace(/\W+/g, '-');
const img = (name) =>
  Array.from({ length: PHOTOS_PER_DESTINATION }, (_, i) => `/images/${slug(name)}-${i + 1}.jpg`);

// Descriptions are split into sections: a line ending with ":" is a heading (see mobile/utils/text.ts)
const destinations = [
  {
    name: 'Copacabana',
    country: 'Brazil',
    category: 'Beach',
    price: 250,
    rating: 4.8,
    isFeatured: false,
    images: img('Copacabana'),
    description:
      "Introduction:\nCopacabana is one of the most famous beaches in the world, right in the heart of Rio de Janeiro. Its golden sand stretches for more than 4 km along the Atlantic Ocean, with spectacular views of the bay and the surrounding mountains.\n\nExperience & activities:\nPlay beach volleyball, go surfing or simply relax under the Brazilian sun. Plenty of beach bars and restaurants serve fresh caipirinhas and tasty local food. In the evening, the promenade comes alive with musicians and street artists.\n\nWhy visit:\nCopacabana is perfect for anyone who wants to feel Rio's unique energy while enjoying the sea. The festive atmosphere, the local culture and the striking cityscape make it an unforgettable destination.\n\nPractical tips:\nVisit between December and March to enjoy the Brazilian summer sun. Keep an eye on your belongings on the beach and explore the neighborhood during the day.",
    reviews: [
      { name: 'Vicky Hladynets', rating: 4.8, text: 'Lively from sunrise to midnight. The beach kiosks serve amazing coconut water and the sunset over the promenade is unforgettable.' },
      { name: 'Marco Silva', rating: 4.5, text: 'An incredible experience! The beach is stunning and the atmosphere in Rio is unique. I highly recommend going early in the morning to enjoy the calm before the crowds arrive.' },
      { name: 'Sophie Martin', rating: 5.0, text: 'Absolutely fantastic. The view of Sugarloaf Mountain from the beach is breathtaking. The local restaurants are excellent, especially for fresh seafood.' },
    ],
  },
  {
    name: 'Whitehaven Beach',
    country: 'Australia',
    category: 'Beach',
    price: 350,
    rating: 4.8,
    isFeatured: false,
    images: img('Whitehaven Beach'),
    description:
      "Introduction:\nWhitehaven Beach is known as one of the purest beaches in the world, tucked inside Australia's Great Barrier Reef Marine Park. Its 98% pure silica sand gives it an exceptional whiteness and softness.\n\nExperience & activities:\nHead to Hill Inlet at sunrise to watch the swirls of white sand and turquoise water. Snorkeling, sailing and catamaran cruises are the highlights of the area, with remarkable marine life waiting under the surface.\n\nWhy visit:\nRemote and unspoiled, Whitehaven Beach offers pure nature far from the tourist crowds. It is one of the few beaches in the world where the sand stays cool under the sun, thanks to its silica.\n\nPractical tips:\nOnly reachable by boat or seaplane from Airlie Beach. Plan a full day to make the most of it, and bring your own food and water: there are no shops on the island.",
    reviews: [
      { name: 'Vicky Hladynets', rating: 4.8, text: 'Pure white sand and turquoise water as far as you can see. The Hill Inlet lookout at low tide is the highlight of the trip.' },
      { name: 'James Cooper', rating: 5.0, text: "The most beautiful beach I've ever seen in my life. The white silica sand is incredibly soft and the turquoise water is crystal clear. Absolutely worth the boat trip to get there." },
      { name: 'Amélie Dubois', rating: 4.5, text: 'Breathtaking! The sand is spotless white and the water is incredibly clear. Flying in by seaplane is an experience in itself.' },
    ],
  },
  {
    name: 'Seychelles',
    country: 'Seychelles',
    category: 'Beach',
    price: 739,
    rating: 4.8,
    isFeatured: false,
    images: img('Seychelles'),
    description:
      "Introduction:\nThe Seychelles, an archipelago of 115 islands scattered across the Indian Ocean, is often described as paradise on Earth. Pink granite beaches, crystal-clear water and lush vegetation make it a true dream destination.\n\nExperience & activities:\nSnorkel and dive among outstanding coral reefs, kayak between unique granite boulders and hike through nature reserves listed as World Heritage Sites. The Vallée de Mai reserve is home to the famous coco de mer.\n\nWhy visit:\nThe Seychelles offer unmatched natural luxury, combining idyllic beaches, unique wildlife and authentic Creole culture. It is a favorite for honeymooners and travelers looking for a complete escape.\n\nPractical tips:\nThe best times to visit are April to May and October to November. Rent a car to explore the beaches of Mahé or Praslin. Luxury resorts are everywhere, but more affordable guesthouses exist too.",
    reviews: [
      { name: 'Vicky Hladynets', rating: 4.8, text: 'Calm, warm water and empty coves. Perfect for snorkeling — we saw sea turtles twice in a single morning.' },
      { name: 'Elena Rossi', rating: 5.0, text: "Paradise exists and it's called the Seychelles. The pink granite boulders of Anse Source d'Argent are breathtaking, and the marine life is extraordinary." },
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
    images: img('Grace Bay Beach'),
    description:
      "Introduction:\nGrace Bay Beach is one of the most iconic beaches in the world, famous for its spotless white sand and crystal-clear turquoise water. Whether you want to relax in the sun, swim in a calm sea or try water sports, it offers an unforgettable experience for every traveler.\n\nExperience & activities:\nExplore the coral reefs with a snorkel, go kayaking or simply stroll along the shore at sunset. Nearby restaurants and cafés serve fresh local dishes and tropical cocktails, the perfect end to the day.\n\nWhy visit:\nGrace Bay Beach is ideal for couples, families and adventurers alike. Everyone finds their perfect moment, whether reading on the warm sand, discovering marine life or soaking up the local charm.\n\nPractical tips:\nThe best time to visit is December to April, when the weather is sunny and the wind is light. Book ahead for the holidays, as accommodation fills up fast.",
    reviews: [
      { name: 'Vicky Hladynets', rating: 4.8, text: 'Soft sand, shallow clear water and very few crowds. Ideal for a relaxing week with kids.' },
      { name: 'Sarah Johnson', rating: 5.0, text: 'Grace Bay is hands down the most beautiful beach I have ever visited. The water is impossibly clear and the sand is like powdered sugar. Absolutely magical at sunset.' },
      { name: 'Pierre Leblanc', rating: 4.6, text: 'An exceptional beach. The water is remarkably clear and the colors of the lagoon at sunset are simply magical. A must for every sea lover.' },
    ],
  },
  {
    name: 'Mount Everest',
    country: 'Nepal',
    category: 'Mountain',
    price: 246,
    rating: 4.8,
    isFeatured: true,
    images: img('Mount Everest'),
    description:
      "Introduction:\nMount Everest, the highest point on Earth at 8,849 m, is a legendary destination for adventurers from all over the world. Standing in the Himalayas between Nepal and Tibet, it draws thousands of trekkers to its base camps every year.\n\nExperience & activities:\nThe trek to Everest Base Camp (5,364 m) is one of the most iconic hikes in the world. Along the way, you pass through authentic Sherpa villages, Buddhist monasteries and breathtaking Himalayan scenery, with fascinating local flora and fauna.\n\nWhy visit:\nEverest is the ultimate challenge and human adventure in its purest form. Even without reaching the summit, the trek to base camp is a life-changing experience in front of nature at its grandest.\n\nPractical tips:\nThe best seasons are October to November and April to May. Acclimatize to the altitude gradually, hire an experienced local Sherpa guide and get travel insurance that covers evacuation.",
    reviews: [
      { name: 'Thomas Müller', rating: 5.0, text: 'An absolutely life-changing experience. The trek to Everest Base Camp pushed me to my limits and rewarded me with the most breathtaking views I have ever seen. The Sherpa guides are incredible.' },
      { name: 'Claire Fontaine', rating: 4.7, text: 'An unforgettable adventure. The Himalayan landscapes are stunning, and the Sherpa villages and monasteries add a unique cultural and spiritual side to the trip.' },
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
    images: img('Paris'),
    description:
      "Introduction:\nParis, the City of Light, is one of the most visited and celebrated destinations in the world. The capital of France is famous for its elegant architecture, refined cuisine, world-class museums and unique romantic atmosphere.\n\nExperience & activities:\nClimb the Eiffel Tower for an unforgettable panoramic view, explore the treasures of the Louvre, stroll down the Champs-Élysées and enjoy a pastry in a Parisian café. Montmartre, the Marais and the banks of the Seine offer an authentic taste of Parisian life.\n\nWhy visit:\nParis is the ideal destination for lovers of art, culture, fashion and food. Every neighborhood has its own character and its own treasures to discover, and the city is perfect for a romantic getaway.\n\nPractical tips:\nSpring (April–May) and autumn (September–October) are the best times to visit. Buy museum tickets in advance and explore the city on foot or by bike to discover every corner.",
    reviews: [
      { name: 'Isabella Romano', rating: 4.9, text: 'Paris is simply magical. Every street, every café, every monument has its own story. The food is extraordinary and the art scene is world-class. I fell in love with this city completely.' },
      { name: 'Lucas Bernard', rating: 4.7, text: 'A beautiful city that never disappoints. The Eiffel Tower lit up at night is a sight not to be missed. The museums are exceptional and Parisian cuisine is second to none.' },
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
    images: img('Machu Picchu'),
    description:
      "Introduction:\nMachu Picchu, the lost Inca city in the clouds, is one of the most extraordinary and mysterious archaeological sites in the world. Perched at 2,430 m in the Peruvian Andes, this UNESCO World Heritage Site is a treasure of humanity.\n\nExperience & activities:\nExplore the farming terraces, the sun temples and the mysterious stone structures of the Inca city. The 4-day Inca Trail is one of the most famous treks in the world, and the Sun Gate (Inti Punku) offers a spectacular panoramic view of the site.\n\nWhy visit:\nMachu Picchu embodies the genius of the Inca civilization and the wild beauty of the Andes. Every stone tells a centuries-old story, and this one-of-a-kind site will stay with you forever.\n\nPractical tips:\nBook entry tickets and Inca Trail permits several months ahead, as places are very limited. The best season is May to September. Start your visit early in the morning to avoid the crowds and watch the sunrise over the ruins.",
    reviews: [
      { name: 'Ana Gonzalez', rating: 5.0, text: 'Machu Picchu is one of those places that takes your breath away the moment you see it. The mystical atmosphere, the ancient stones and the dramatic mountain backdrop create an unforgettable experience.' },
      { name: 'François Dupont', rating: 4.8, text: 'An absolutely fascinating site. The Inca city rising out of the clouds in the early morning is a breathtaking sight, and the Inca Trail to get there is an adventure in itself.' },
      { name: 'Oliver Schmidt', rating: 4.7, text: 'One of the most impressive archaeological sites I have ever visited. The precision of the Inca stonework is mind-blowing. Go early in the morning to see it in the mist — truly magical.' },
    ],
  },
];

module.exports = { destinations, slug };
