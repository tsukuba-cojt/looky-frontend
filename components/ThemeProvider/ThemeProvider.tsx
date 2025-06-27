import {
  DefaultTheme,
  ThemeProvider as ReactNavitationThemeProvider,
} from "@react-navigation/native";
import type { ReactNode } from "react";
import { useColorScheme } from "react-native";
import { useTheme } from "tamagui";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

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
        dark: colorScheme === "dark",
        fonts: DefaultTheme.fonts,
      }}
    >
      {children}
    </ReactNavitationThemeProvider>
  );
};
