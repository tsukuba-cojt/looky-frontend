import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/client";

const AppLayout = () => {
  const { session } = useAuth();

  const { data: user, isLoading } = useQuery(
    supabase
      .from("t_user")
      .select("id")
      .eq("id", session?.user.id ?? "")
      .single(),
  );

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="setup" />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(tab)" />
      </Stack.Protected>
      <Stack.Screen name="camera" />
      <Stack.Screen name="crop" />
    </Stack>
  );
};

export default AppLayout;
