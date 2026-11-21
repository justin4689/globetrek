import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type SortOption = "popular" | "price_asc" | "price_desc" | "rating";
export type PriceRange = "budget" | "mid" | "luxury";

export interface DestinationFilters {
  sort: SortOption;
  price: PriceRange | null;
  minRating: number | null;
}

export const DEFAULT_FILTERS: DestinationFilters = { sort: "popular", price: null, minRating: null };

/** Price bounds sent to the API for each range. */
export const PRICE_BOUNDS: Record<PriceRange, { minPrice?: number; maxPrice?: number }> = {
  budget: { maxPrice: 200 },
  mid: { minPrice: 200, maxPrice: 500 },
  luxury: { minPrice: 500 },
};

interface FiltersContextType {
  filters: DestinationFilters;
  setFilters: (filters: DestinationFilters) => void;
  resetFilters: () => void;
  /** Number of filters that differ from the defaults (for the badge on the filter button). */
  activeCount: number;
}

const FiltersContext = createContext<FiltersContextType | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<DestinationFilters>(DEFAULT_FILTERS);

  const value = useMemo<FiltersContextType>(
    () => ({
      filters,
      setFilters,
      resetFilters: () => setFilters(DEFAULT_FILTERS),
      activeCount:
        Number(filters.sort !== DEFAULT_FILTERS.sort) +
        Number(filters.price !== null) +
        Number(filters.minRating !== null),
    }),
    [filters]
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}
