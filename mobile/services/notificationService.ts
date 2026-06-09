import { api } from "@/utils/api";

export type NotificationType =
  | "reservation_confirmed"
  | "reservation_cancelled"
  | "payment_successful"
  | "payment_failed"
  | "rate_booking";

export interface ApiNotification {
  _id: string;
  type: NotificationType;
  title: string;
  subtitle: string;
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  amount?: number;
  reason?: string;
  detailReason?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  getAll: () =>
    api.get<{ success: boolean; unreadCount: number; notifications: ApiNotification[] }>("/notifications"),

  markAsRead: (id: string) =>
    api.patch<{ success: boolean; notification: ApiNotification }>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch<{ success: boolean }>("/notifications/read-all"),
};
