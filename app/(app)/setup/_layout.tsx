import { Stack } from "expo-router";

const SetupLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="body" />
    </Stack>
  );
};

export default SetupLayout;
