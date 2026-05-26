export type NotificationType =
  | "reservation_confirmed"
  | "reservation_cancelled"
  | "payment_successful"
  | "payment_failed"
  | "rate_booking";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  subtitle: string;
  time: string;
  day: string;
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  amount?: number;
  reason?: string;
  detailReason?: string;
}

export const notifications: NotificationItem[] = [
  {
    id: "1",
    type: "reservation_confirmed",
    title: "Reservation confirmed",
    subtitle: "Your reservation at Hilton Rome is confirmed",
    time: "2 m ago",
    day: "Today",
    destination: "Grace Bay Beach",
    checkIn: "April 26",
    checkOut: "April 29",
  },
  {
    id: "2",
    type: "reservation_cancelled",
    title: "Reservation cancelled",
    subtitle: "Your reservation at Hilton Rome has been cancelled",
    time: "2 m ago",
    day: "Today",
    destination: "Grace Bay Beach",
    checkIn: "April 26",
    checkOut: "April 29",
    reason: "There was an issue with your payment method",
  },
  {
    id: "3",
    type: "reservation_confirmed",
    title: "Reservation confirmed",
    subtitle: "Your reservation at Hilton Rome is confirmed",
    time: "2 m ago",
    day: "Today",
    destination: "Grace Bay Beach",
    checkIn: "April 26",
    checkOut: "April 29",
  },
  {
    id: "4",
    type: "payment_successful",
    title: "Payment Successful",
    subtitle: "Your payment of $350 has been completed",
    time: "11:00 AM",
    day: "Tuesday",
    amount: 350,
  },
  {
    id: "5",
    type: "payment_failed",
    title: "Payment Failed",
    subtitle: "There was an issue with your payment of $430",
    time: "06:00 AM",
    day: "Tuesday",
    amount: 430,
    reason:
      "We were unable to process your payment due to an issue with your credit card.",
    detailReason:
      "Please check your card details or update your payment method to complete your reservation. If the problem continues, feel free to contact our support team for assistance.",
  },
  {
    id: "6",
    type: "rate_booking",
    title: "Rate Your Booking",
    subtitle: "How was your stay in Grace Bay Beach?",
    time: "07:00 PM",
    day: "Tuesday",
    destination: "Grace Bay Beach",
  },
];
