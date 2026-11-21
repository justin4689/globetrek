import { DestinationFilters, PRICE_BOUNDS } from "@/context/FiltersContext";
import { destinationService } from "@/services/destinationService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useDestinations(
  params: { category?: string | null; search?: string; filters?: DestinationFilters } = {}
) {
  const search = params.search?.trim() || undefined;
  const category = params.category || undefined;
  const { filters } = params;
  const apiParams = {
    category,
    search,
    sort: filters && filters.sort !== "popular" ? filters.sort : undefined,
    minRating: filters?.minRating ?? undefined,
    ...(filters?.price ? PRICE_BOUNDS[filters.price] : {}),
  };
  return useQuery({
    queryKey: ["destinations", apiParams],
    queryFn: async () => (await destinationService.getAll(apiParams)).destinations,
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
