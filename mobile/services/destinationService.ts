import { api } from "@/utils/api";

export interface ApiDestination {
  _id: string;
  name: string;
  country: string;
  category: string;
  price: number;
  rating: number;
  images: string[];
  description: string;
  isFeatured: boolean;
  reviews?: ApiReview[];
}

export interface ApiReview {
  _id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  icon: string;
}

export const destinationService = {
  getAll: (params?: { category?: string; search?: string; featured?: boolean; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.featured) query.set("featured", "true");
    if (params?.page) query.set("page", String(params.page));
    const qs = query.toString();
    return api.get<{ success: boolean; destinations: ApiDestination[]; total: number }>(`/destinations${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) =>
    api.get<{ success: boolean; destination: ApiDestination }>(`/destinations/${id}`),

  getCategories: () =>
    api.get<{ success: boolean; categories: ApiCategory[] }>("/destinations/categories"),

  getFeatured: () =>
    api.get<{ success: boolean; destinations: ApiDestination[] }>("/destinations?featured=true"),
};
