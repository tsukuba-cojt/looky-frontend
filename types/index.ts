import type { categories, colors, genders, subcategories } from "@/constants";

export type Gender = (typeof genders)[number];
export type Category = (typeof categories)[number];
export type Subcategory = typeof subcategories;
export type Color = keyof typeof colors;
