import { Stack } from "expo-router";

const OutfitLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="guide" />
      <Stack.Screen name="gallery" />
    </Stack>
  );
};

export default OutfitLayout;
