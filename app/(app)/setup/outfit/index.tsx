import { Image } from "expo-image";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native";
import { H1, Text, YStack } from "tamagui";
import { Button } from "@/components/Button";

const IntroPage = () => {
  const { t } = useTranslation("setup");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} px="$8" pt="$24" pb="$6" justify="space-between">
        <YStack items="center" gap="$12">
          <Image
            style={{ width: 300, height: 300 }}
            source={require("../../../../assets/images/intro.png")}
            transition={200}
          />
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
