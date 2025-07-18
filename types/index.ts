import type {
  categories,
  colors,
  genders,
  languages,
  origins,
  subcategories,
  themes,
} from "@/constants";
import type { Database } from "./database.types";

export type User = Database["public"]["Tables"]["t_user"]["Row"];
export type Vton = Database["public"]["Tables"]["t_vton"]["Row"];
export type UserVton = Database["public"]["Tables"]["t_user_vton"]["Row"];

export type Gender = (typeof genders)[number];
export type Category = (typeof categories)[number];

export type Subcategory = {
  [C in Category]: (typeof subcategories)[C][number];
};

export type Color = keyof typeof colors;

export type Language = (typeof languages)[number];

export type Theme = (typeof themes)[number];

export type History = {
  id: string;
  text: string;
  createAt: string;
};

export type Origin = (typeof origins)[number];
