import type { Category, Destination, RecommendedItem } from "@/types/home";

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
  },
  {
    id: "2",
    name: "Whitehaven Beach",
    country: "Australia",
    price: 350,
    rating: 4.8,
    image: require("../assets/image/image11.jpg"),
  },
  {
    id: "3",
    name: "Seychelles",
    country: "Seychelles",
    price: 739,
    rating: 4.8,
    image: require("../assets/image/image12.jpg"),
  },
  {
    id: "4",
    name: "Grace Bay Beach",
    country: "Turks & Caicos",
    price: 150,
    rating: 4.8,
    image: require("../assets/image/image13.jpg"),
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
