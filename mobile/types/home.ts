export type Review = {
  id: string;
  name: string;
  avatar: any;
  rating: number;
  text: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Destination = {
  id: string;
  name: string;
  country: string;
  price: number;
  rating: number;
  image: any;
  images: any[];
  description: string;
  reviews: Review[];
};

export type RecommendedItem = {
  id: string;
  destinationId: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: any;
};
