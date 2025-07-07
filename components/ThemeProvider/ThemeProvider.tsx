import {
  DefaultTheme,
  ThemeProvider as ReactNavitationThemeProvider,
} from "@react-navigation/native";
import type { ReactNode } from "react";
import { useTheme } from "tamagui";
import { useThemeStore } from "@/stores/useThemeStore";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  return (
    <ReactNavitationThemeProvider
      value={{
        colors: {
          primary: theme.primaryBackground.val,
          background: theme.background.val,
          card: theme.background.val,
          text: theme.color.val,
          border: theme.borderColor.val,
          notification: theme.background.val,
        },
        dark: resolvedTheme() === "dark",
        fonts: DefaultTheme.fonts,
      }}
    >
      {children}
    </ReactNavitationThemeProvider>
  );
};
