import { z } from "zod/v4";

export const signupSchema = z.object({
  email: z.email({ error: "invalid_email" }),
});

export const loginSchema = z.object({
  email: z.email({ error: "invalid_email" }),
});

export const otpSchema = z.object(
  Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [
      i.toString(),
      z.string().regex(/^\d$/).default(""),
    ]),
  ),
);
