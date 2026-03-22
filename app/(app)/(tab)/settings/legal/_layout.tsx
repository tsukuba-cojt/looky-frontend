import { Stack } from "expo-router";
import { memo } from "react";

const LegalLayout = memo(() => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
});

export default LegalLayout;
