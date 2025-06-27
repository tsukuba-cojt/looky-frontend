import { useTranslation } from "react-i18next";
import { toast } from "sonner-native";
import { YStack } from "tamagui";
import { Button } from "@/components/Button";
import { signOut } from "@/lib/auth";

const SettingsPage = () => {
  const { t } = useTranslation("settings");

  return (
    <YStack flex={1} items="center" justify="center">
      <Button
        variant="primary"
        onPress={() => {
          try {
            signOut();
          } catch {
            toast.error(t("error"));
          }
        }}
      >
        <Button.Text>Sign Out</Button.Text>
      </Button>
    </YStack>
  );
};

export default SettingsPage;
