import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { View, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";

const siteUrl = Constants.expoConfig?.extra?.siteUrl;

const LegalPage = memo(() => {
  const { t } = useTranslation("settings");
  const router = useRouter();

  const items = [
    {
      label: t("legal.terms"),
      url: `${siteUrl}/terms`,
    },
    {
      label: t("legal.privacy"),
      url: `${siteUrl}/privacy`,
    },
  ];

  return (
    <View flex={1} pt="$8" px="$8">
      <YStack gap="$6">
        {items.map((item) => (
          <Button
            key={item.url}
            variant="ghost"
            justify="space-between"
            onPress={() =>
              router.push({
                pathname: "/settings/webview",
                params: { url: item.url },
              })
            }
          >
            <Button.Text>{item.label}</Button.Text>
            <Button.Icon>
              <Icons.chevronRight size="$4" />
            </Button.Icon>
          </Button>
        ))}
      </YStack>
    </View>
  );
});

export default LegalPage;
