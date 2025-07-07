import { create } from "zustand";
import type { Category, Color, Gender, Subcategory } from "@/types";

interface SearchQuery {
  gender: Gender | null;
  category: Category | null;
  subcategory: Subcategory[Category] | null;
  color: Color | null;
}

interface SearchQueryState {
  query: SearchQuery;
  setQuery: (partial: Partial<SearchQuery>) => void;
  clear: () => void;
}

export const useSearchQueryStore = create<SearchQueryState>((set) => ({
  query: {
    gender: null,
    category: null,
    subcategory: null,
    color: null,
  },
  setQuery: (partial) =>
    set((state) => ({
      query: { ...state.query, ...partial },
    })),
  clear: () =>
    set({
      query: { gender: null, category: null, subcategory: null, color: null },
    }),
}));
