import { destinationService } from "@/services/destinationService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useDestinations(params: { category?: string | null; search?: string } = {}) {
  const search = params.search?.trim() || undefined;
  const category = params.category || undefined;
  return useQuery({
    queryKey: ["destinations", { category, search }],
    queryFn: async () => (await destinationService.getAll({ category, search })).destinations,
    placeholderData: keepPreviousData,
  });
}

export function useFeaturedDestinations() {
  return useQuery({
    queryKey: ["destinations", "featured"],
    queryFn: async () => (await destinationService.getFeatured()).destinations,
  });
}

export function useDestination(id: string | undefined) {
  return useQuery({
    queryKey: ["destination", id],
    queryFn: async () => (await destinationService.getById(id!)).destination,
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await destinationService.getCategories()).categories,
    staleTime: Infinity,
  });
}
