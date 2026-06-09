import { api } from "@/utils/api";
import { ApiDestination } from "./destinationService";

export interface ApiFavorite {
  _id: string;
  destination: ApiDestination;
  createdAt: string;
}

export const favoriteService = {
  getAll: () =>
    api.get<{ success: boolean; favorites: ApiFavorite[] }>("/favorites"),

  add: (destinationId: string) =>
    api.post<{ success: boolean; favorite: ApiFavorite }>("/favorites", { destinationId }),

  remove: (destinationId: string) =>
    api.delete<{ success: boolean }>(`/favorites/${destinationId}`),
};
