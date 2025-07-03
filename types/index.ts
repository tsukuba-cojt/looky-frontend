import type { categories, colors, genders, subcategories } from "@/constants";
import type { Database } from "./database";

export type User = Database["public"]["Tables"]["t_user"]["Row"];

export type Gender = (typeof genders)[number];
export type Category = (typeof categories)[number];
export type Subcategory = typeof subcategories;
export type Color = keyof typeof colors;
