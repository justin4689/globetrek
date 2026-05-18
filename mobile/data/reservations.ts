export type Reservation = {
  id: string;
  destinationId: string;
  destinationName: string;
  country: string;
  image: any;
  checkIn: string;
  checkOut: string;
  guests: number;
  price: number;
  status: "upcoming" | "completed" | "cancelled";
  bookingRef: string;
};

export const reservations: Reservation[] = [
  {
    id: "res1",
    destinationId: "1",
    destinationName: "Copacabana",
    country: "Brazil",
    image: require("../assets/image/image10.jpg"),
    checkIn: "2026-06-15",
    checkOut: "2026-06-22",
    guests: 2,
    price: 1750,
    status: "upcoming",
    bookingRef: "GTK-20260001",
  },
  {
    id: "res2",
    destinationId: "3",
    destinationName: "Seychelles",
    country: "Seychelles",
    image: require("../assets/image/image12.jpg"),
    checkIn: "2026-08-10",
    checkOut: "2026-08-17",
    guests: 2,
    price: 5173,
    status: "upcoming",
    bookingRef: "GTK-20260002",
  },
  {
    id: "res3",
    destinationId: "2",
    destinationName: "Whitehaven Beach",
    country: "Australia",
    image: require("../assets/image/image11.jpg"),
    checkIn: "2025-12-20",
    checkOut: "2025-12-27",
    guests: 3,
    price: 2450,
    status: "completed",
    bookingRef: "GTK-20250003",
  },
  {
    id: "res4",
    destinationId: "4",
    destinationName: "Grace Bay Beach",
    country: "Turks & Caicos",
    image: require("../assets/image/image13.jpg"),
    checkIn: "2025-10-05",
    checkOut: "2025-10-12",
    guests: 2,
    price: 1050,
    status: "cancelled",
    bookingRef: "GTK-20250004",
  },
];
