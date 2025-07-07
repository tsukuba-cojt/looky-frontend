import type {
  categories,
  colors,
  genders,
  languages,
  subcategories,
  themes,
} from "@/constants";
import type { Database } from "./database.types";

export type User = Database["public"]["Tables"]["t_user"]["Row"];

export type Gender = (typeof genders)[number];
export type Category = (typeof categories)[number];

export type Subcategory = {
  [C in Category]: (typeof subcategories)[C][number];
};

export type Color = keyof typeof colors;

export type Language = (typeof languages)[number];

export type Theme = (typeof themes)[number];
