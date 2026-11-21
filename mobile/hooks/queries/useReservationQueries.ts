import { notificationService } from "@/services/notificationService";
import { reservationService } from "@/services/reservationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useReservations() {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: async () => (await reservationService.getAll()).reservations,
  });
}

export function useReservation(id: string | undefined) {
  return useQuery({
    queryKey: ["reservation", id],
    queryFn: async () => (await reservationService.getById(id!)).reservation,
    enabled: !!id,
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reservationService.cancel(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservation", id] });
    },
  });
}

export function useUnreadNotificationsCount() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getAll(),
    select: (res) => res.unreadCount,
  });
}
