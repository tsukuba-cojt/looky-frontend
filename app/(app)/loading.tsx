import { useSubscription } from "@supabase-cache-helpers/postgrest-swr";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { memo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { H1, Text, View, YStack } from "tamagui";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";

const LoadingPage = memo(() => {
  const { t } = useTranslation("loading");
  const session = useSessionStore((state) => state.session);
  const router = useRouter();
  const animation = useRef<LottieView>(null);

  useSubscription(
    supabase,
    "task",
    {
      event: "*",
      table: "t_task",
      schema: "public",
      filter: `user_id=eq.${session?.user.id}`,
    },
    ["id"],
    {
      callback: async (payload) => {
        if (payload.eventType === "UPDATE") {
          const { count } = await supabase
            .from("t_task")
            .select("id", { count: "exact", head: true })
            .eq("user_id", session?.user.id ?? "")
            .eq("status", "pending");

          if (count === 0) {
            router.replace("/");
          }
        }
      },
    },
  );

  return (
    <YStack
      flex={1}
      items="center"
      justify="center"
      gap="$8"
      bg="$primaryBackground"
    >
      <View w={300} h={300} rounded="$full" bg="$primaryColor">
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: "100%",
            height: "100%",
          }}
          source={require("../../assets/loading.json")}
        />
      </View>
      <YStack items="center" gap="$6">
        <H1 fontWeight="$bold" fontSize="$4xl" color="$primaryColor">
          {t("title")}
        </H1>
        <Text
          text="center"
          fontWeight="$bold"
          fontSize="$md"
          lineHeight="$md"
          color="$primaryColor"
        >
          {t("description")}
        </Text>
      </YStack>
    </YStack>
  );
});

export default LoadingPage;
