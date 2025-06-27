import { defaultConfig } from "@tamagui/config/v4";

export const shorthands = {
  ...defaultConfig.shorthands,
  w: "width",
  h: "height",
} as const;
