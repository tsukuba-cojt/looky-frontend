import {
  DefaultTheme,
  ThemeProvider as ReactNavitationThemeProvider,
} from "@react-navigation/native";
import type { ReactNode } from "react";
import { useTheme } from "tamagui";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

  return (
    <ReactNavitationThemeProvider
      value={{
        ...DefaultTheme,
        colors: {
          primary: theme.primaryBackground.val,
          background: theme.background.val,
          card: theme.background.val,
          text: theme.color.val,
          border: theme.borderColor.val,
          notification: theme.background.val,
        },
        fonts: DefaultTheme.fonts,
      }}
    >
      {children}
    </ReactNavitationThemeProvider>
  );
};
