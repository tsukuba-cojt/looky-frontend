import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { H1, Text, View, XStack, YStack } from "tamagui";
import { wait } from "@/lib/utilts";

const LoadingPage = () => {
  const { t } = useTranslation("loading");
  const router = useRouter();
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    (async () => {
      await wait(10);
      router.push("/");
    })();
  }, [router]);

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
        <XStack items="flex-end" gap="$1">
          <H1 fontWeight="$bold" fontSize="$4xl" color="$primaryColor">
            {t("title")}
          </H1>
          <XStack gap="$1.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index.toString()}
                animation={[
                  "pulse",
                  {
                    // @ts-expect-error
                    delay: index * 200,

                    // @ts-expect-error
                    duration: 500,
                  },
                ]}
                w="$1.5"
                h="$1.5"
                enterStyle={{ opacity: 0.5 }}
                rounded="$full"
                bg="$primaryColor"
              />
            ))}
          </XStack>
        </XStack>
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
};

export default LoadingPage;
