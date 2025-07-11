import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Stack } from "expo-router";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";

const AppLayout = () => {
  const session = useSessionStore((state) => state.session);

  const { data: user, isLoading } = useQuery(
    supabase
      .from("t_user")
      .select("id")
      .eq("id", session?.user.id ?? "")
      .maybeSingle(),
  );

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="setup" />
      </Stack.Protected>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tab)" />
        <Stack.Screen name="details/[id]" />
      </Stack.Protected>
      <Stack.Screen
        name="camera"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="crop" />
      <Stack.Screen name="loading" />
    </Stack>
  );
};

export default AppLayout;
