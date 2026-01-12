import type { ConfigContext, ExpoConfig } from "@expo/config";

export type Extra = {
  storybookEnabled: string | undefined;
  SUPABASE_URL: string | undefined;
  SUPABASE_ANON_KEY: string | undefined;
  eas: {
    projectId: string;
  };
};

export interface ExtendedExpoConfig extends ExpoConfig {
  extra: Extra;
}

export default ({ config }: ConfigContext): ExtendedExpoConfig => ({
  ...config,
  name: "Looky",
  slug: "looky",
  scheme: "looky",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#f98f15",
  },
  ios: {
    bundleIdentifier: "com.looky.app",
    supportsTablet: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.looky.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#f98f15",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-audio",
    "expo-image-picker",
    "expo-dev-client",
    "expo-web-browser",
    "expo-camera",
    "expo-router",
    "expo-localization",
  ],
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    eas: {
      projectId: "b3038619-9727-4c51-883f-ce7ef59a3f24",
    },
  },
});
