import { api } from "@/utils/api";
import { ApiDestination } from "./destinationService";

export type ReservationStatus = "upcoming" | "completed" | "cancelled";
export type PaymentStatus = "deposit_paid" | "refunded" | "non_refundable";

export interface BookingRequest {
  destinationId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface DepositPayment {
  clientSecret: string;
  paymentIntentId: string;
  total: number;
  deposit: number;
  balance: number;
}

export interface ApiReservation {
  _id: string;
  destination: ApiDestination;
  destinationName: string;
  country: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  price: number;
  depositAmount: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
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

  /** Prices the booking and opens a Stripe payment for its 30% deposit. */
  createPaymentIntent: (data: BookingRequest) =>
    api.post<{ success: boolean } & DepositPayment>("/reservations/payment-intent", data),

  /** Creates the reservation once the deposit is paid (safe to call twice). */
  confirm: (paymentIntentId: string) =>
    api.post<{ success: boolean; reservation: ApiReservation }>("/reservations/confirm", { paymentIntentId }),

  cancel: (id: string) =>
    api.patch<{ success: boolean; reservation: ApiReservation; refunded: boolean }>(`/reservations/${id}/cancel`),
};
