import { createFont, isWeb } from "tamagui";

const systemFont = createFont({
  family: isWeb
    ? '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    : "System",
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    "2xl": 22,
    "3xl": 28,
    "4xl": 34,
    true: 14,
  },
  lineHeight: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 24,
    "2xl": 28,
    "3xl": 32,
    "4xl": 36,
    true: 20,
  },
  weight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
    true: "400",
  },
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
    true: 0,
  },
  face: {
    400: { normal: "Inter_400Regular" },
    500: { normal: "Inter_500Medium" },
    700: { normal: "Inter_700Bold" },
  },
});

export const fonts = {
  heading: systemFont,
  body: systemFont,
};
