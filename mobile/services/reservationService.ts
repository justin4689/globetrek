import { api } from "@/utils/api";
import { ApiDestination } from "./destinationService";

export type ReservationStatus = "upcoming" | "completed" | "cancelled";

export interface ApiReservation {
  _id: string;
  destination: ApiDestination;
  destinationName: string;
  country: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  price: number;
  status: ReservationStatus;
  bookingRef: string;
  createdAt: string;
}

export const reservationService = {
  getAll: (status?: ReservationStatus) => {
    const qs = status ? `?status=${status}` : "";
    return api.get<{ success: boolean; reservations: ApiReservation[] }>(`/reservations${qs}`);
  },

  getById: (id: string) =>
    api.get<{ success: boolean; reservation: ApiReservation }>(`/reservations/${id}`),

  create: (data: { destinationId: string; checkIn: string; checkOut: string; guests: number }) =>
    api.post<{ success: boolean; reservation: ApiReservation }>("/reservations", data),

  cancel: (id: string) =>
    api.patch<{ success: boolean; reservation: ApiReservation }>(`/reservations/${id}/cancel`),
};
