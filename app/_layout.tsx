import "expo-dev-client";
import "@/locales";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { memo, useEffect } from "react";
import { AppState, type AppStateStatus, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Toaster } from "sonner-native";
import { SWRConfig } from "swr";
import { PortalProvider, TamaguiProvider } from "tamagui";
import { ThemeProvider } from "@/components/ThemeProvider";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { config } from "@/tamagui.config";

SplashScreen.preventAutoHideAsync();

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const RootNavigator = memo(() => {
  const session = useSessionStore((state) => state.session);
  const isLoading = useSessionStore((state) => state.isLoading);
  const isAuth = session !== null;

  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuth}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isAuth}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
});

const RootLayout = memo(() => {
  const colorSchema = useColorScheme();
  const theme = useThemeStore((state) => state.theme);
  const setSession = useSessionStore((state) => state.setSession);
  const setIsLoading = useSessionStore((state) => state.setIsLoading);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setIsLoading(false);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setSession, setIsLoading]);

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => {
          return true;
        },
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (nextAppState: AppStateStatus) => {
            if (
              appState.match(/inactive|background/) &&
              nextAppState === "active"
            ) {
              callback();
            }
            appState = nextAppState;
          };

          const subscription = AppState.addEventListener(
            "change",
            onAppStateChange,
          );

          return () => {
            subscription.remove();
          };
        },
      }}
    >
      <TamaguiProvider
        config={config}
        defaultTheme={theme === "system" ? (colorSchema ?? "light") : theme}
      >
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PortalProvider shouldAddRootHost>
              <KeyboardProvider>
                <StatusBar
                  style={
                    theme === "system"
                      ? "auto"
                      : theme === "light"
                        ? "dark"
                        : "light"
                  }
                />
                <RootNavigator />
                <Toaster />
              </KeyboardProvider>
            </PortalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </TamaguiProvider>
    </SWRConfig>
  );
});

export default RootLayout;
