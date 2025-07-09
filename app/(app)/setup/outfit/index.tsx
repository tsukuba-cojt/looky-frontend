import { Image } from "expo-image";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native";
import { H1, Text, View, YStack } from "tamagui";
import { Button } from "@/components/Button";

const IntroPage = () => {
  const { t } = useTranslation("setup");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} px="$8" pt="$24" pb="$6" justify="space-between">
        <YStack items="center" gap="$12">
          <View
            w={300}
            h={300}
            bg="$primaryBackground"
            rounded="$full"
            overflow="hidden"
          >
            <Image
              style={{
                width: "100%",
                height: "150%",
                transform: [{ translateY: 60 }],
              }}
              source={require("../../../../assets/images/dummy.png")}
              contentFit="contain"
              transition={200}
            />
          </View>
          <YStack gap="$6">
            <H1
              fontSize="$2xl"
              lineHeight="$2xl"
              fontWeight="$bold"
              text="center"
            >
              {t("outfit.intro.title")}
            </H1>
            <Text text="center" color="$mutedColor">
              {t("outfit.intro.description")}
            </Text>
          </YStack>
        </YStack>
        <YStack gap="$3">
          <Link href="/setup/outfit/guide" asChild>
            <Button variant="primary">
              <Button.Text>{t("outfit.intro.get_started")}</Button.Text>
            </Button>
          </Link>
          <Text fontSize="$xs" color="$placeholderColor" text="center">
            {t("outfit.intro.note")}
          </Text>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default IntroPage;
