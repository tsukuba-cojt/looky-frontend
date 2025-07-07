import { Stack } from "expo-router";

const SettingsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" options={{ presentation: "modal" }} />
      <Stack.Screen name="language" options={{ presentation: "modal" }} />
      <Stack.Screen name="theme" options={{ presentation: "modal" }} />
    </Stack>
  );
};

export default SettingsLayout;
