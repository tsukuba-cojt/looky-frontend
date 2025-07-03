import { Stack } from "expo-router";

const CategoriesLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[category]/index" />
    </Stack>
  );
};

export default CategoriesLayout;
