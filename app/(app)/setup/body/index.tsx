import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native";
import { Text, YStack } from "tamagui";
import { Button } from "@/components/Button";

const IntroPage = () => {
  const { t } = useTranslation("setup");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} items="center" justify="center" gap="$16">
        <Text fontSize="$2xl" fontWeight="$bold">
          {t("body.intro.title")}
        </Text>
        {/* <Icon width={320} height={320} /> */}
        <Button
          variant="primary"
          rounded="$full"
          onPress={() => router.push("/(app)/setup/body/guide")}
        >
          <Button.Text fontWeight="$bold">
            {t("body.intro.get_started")}
          </Button.Text>
        </Button>
        <Text fontSize="$xs" color="$placeholderColor">
          {t("body.intro.description")}
        </Text>
      </YStack>
    </SafeAreaView>
  );
};

export default IntroPage;
