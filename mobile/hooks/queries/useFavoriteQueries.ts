import { ApiFavorite, favoriteService } from "@/services/favoriteService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

const FAVORITES_KEY = ["favorites"];

export function useFavorites() {
  return useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: async () => (await favoriteService.getAll()).favorites,
  });
}

/** Set of destination ids the user has favorited. */
export function useFavoriteIds() {
  const { data } = useFavorites();
  return useMemo(() => new Set((data ?? []).map((f) => f.destination._id)), [data]);
}

/** Adds or removes a favorite, updating the cache optimistically. */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ destinationId, isFavorite }: { destinationId: string; isFavorite: boolean }) =>
      isFavorite ? favoriteService.remove(destinationId) : favoriteService.add(destinationId),

    onMutate: async ({ destinationId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_KEY });
      const previous = queryClient.getQueryData<ApiFavorite[]>(FAVORITES_KEY);
      if (previous && isFavorite) {
        queryClient.setQueryData<ApiFavorite[]>(
          FAVORITES_KEY,
          previous.filter((f) => f.destination._id !== destinationId)
        );
      }
      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(FAVORITES_KEY, context.previous);
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: FAVORITES_KEY }),
  });
}
