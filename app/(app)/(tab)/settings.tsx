import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { signOut } from "@/lib/auth";

const SettingsPage = () => {
  const { t } = useTranslation("settings");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} pt="$8" px="$8" gap="$8">
        <Button
          variant="ghost"
          onPress={() => {
            try {
              signOut();
            } catch {
              toast.error(t("error"));
            }
          }}
          justify="space-between"
        >
          <XStack gap="$2" items="center">
            <Button.Icon>
              <Icons.logout />
            </Button.Icon>
            <Button.Text>{t("logout")}</Button.Text>
          </XStack>
          <Button.Icon>
            <Icons.chevronRight />
          </Button.Icon>
        </Button>
      </YStack>
    </SafeAreaView>
  );
};

export default SettingsPage;
