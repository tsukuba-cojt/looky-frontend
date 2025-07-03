import { z } from "zod/v4";
import { genders } from "@/constants";

export const setupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "too_short_name" })
    .max(128, { message: "too_long_name" }),
  gender: z.enum(genders).optional(),
  avatarUrl: z.string().optional(),
  bodyUrl: z.string(),
});
