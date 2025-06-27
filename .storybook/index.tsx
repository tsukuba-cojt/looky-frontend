import AsyncStorage from "@react-native-async-storage/async-storage";
import { view } from "./storybook.requires";
import { useColorScheme } from "react-native";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { TamaguiProvider } from "tamagui";
import { config } from "../tamagui.config";

const StorybookUI = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

const StorybookUIRoot = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider
      config={config}
      defaultTheme={colorScheme === "dark" ? "dark" : "light"}
    >
      <StorybookUI />
    </TamaguiProvider>
  );
};

export default StorybookUIRoot;
