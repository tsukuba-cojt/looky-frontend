import { z } from "zod/v4";
import { genders } from "@/constants";

export const setupSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "required_error" : "invalid_type_error",
    })
    .min(3, { message: "too_short_error" })
    .max(128, { message: "too_long_error" })
    .optional(),
  gender: z.enum(genders, { error: "required_error" }).optional(),
  avatar: z
    .object(
      {
        id: z.uuid(),
        uri: z.string(),
      },
      {
        error: "required_error",
      },
    )
    .optional(),
  outfits: z
    .array(z.object({ id: z.uuid(), uri: z.string() }))
    .nonempty({ error: "required_error" }),
});

export const profileSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "required_error" : "invalid_type_error",
    })
    .min(3, { message: "too_short_error" })
    .max(128, {
      message: "too_long_error",
    }),
  gender: z.enum(genders, { error: "required_error" }).nullable(),
  email: z.email({ message: "invalid_email_error" }),
  height: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "required_error" : "invalid_type_error",
    })
    .min(0, { message: "too_short_height" })
    .max(250, { message: "too_long_height" }),
});
