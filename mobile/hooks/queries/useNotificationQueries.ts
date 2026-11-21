import { notificationService } from "@/services/notificationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const NOTIFICATIONS_KEY = ["notifications"];

const fetchNotifications = () => notificationService.getAll();

export function useNotifications() {
  return useQuery({ queryKey: NOTIFICATIONS_KEY, queryFn: fetchNotifications });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: fetchNotifications,
    select: (res) => res.unreadCount,
  });
}

/** The API has no single-notification route, so the detail is read from the list. */
export function useNotification(id: string | undefined) {
  const query = useNotifications();
  return { ...query, data: query.data?.notifications.find((n) => n._id === id) };
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}
