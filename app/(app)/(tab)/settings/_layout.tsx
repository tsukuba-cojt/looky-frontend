import { Stack } from "expo-router";
import { memo } from "react";

const SettingsLayout = memo(() => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" options={{ presentation: "modal" }} />
      <Stack.Screen name="outfit" options={{ presentation: "modal" }} />
      <Stack.Screen name="language" options={{ presentation: "modal" }} />
      <Stack.Screen name="theme" options={{ presentation: "modal" }} />
    </Stack>
  );
});

export default SettingsLayout;
