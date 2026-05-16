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
};

export type RecommendedItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: any;
};
