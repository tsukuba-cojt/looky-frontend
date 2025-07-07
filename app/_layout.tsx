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
import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Toaster } from "sonner-native";
import { SWRConfig } from "swr";
import { PortalProvider, TamaguiProvider } from "tamagui";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/client";
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

const RootLayout = () => {
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

  return (
    <AuthProvider>
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
        <TamaguiProvider config={config} defaultTheme={resolvedTheme()}>
          <ThemeProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <PortalProvider shouldAddRootHost>
                <KeyboardProvider>
                  <StatusBar style={resolvedTheme()} />
                  <RootNavigator />
                  <Toaster />
                </KeyboardProvider>
              </PortalProvider>
            </GestureHandlerRootView>
          </ThemeProvider>
        </TamaguiProvider>
      </SWRConfig>
    </AuthProvider>
  );
};

const RootNavigator = () => {
  const { session, isLoading } = useAuth();
  const isAuth = session !== null;

  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded && !isLoading) {
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
};

export default RootLayout;
