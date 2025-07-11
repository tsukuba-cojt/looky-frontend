import { Stack } from "expo-router";
import { memo } from "react";

const DiscoverLayout = memo(() => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="search"
        options={{
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="filter"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
});

export default DiscoverLayout;
