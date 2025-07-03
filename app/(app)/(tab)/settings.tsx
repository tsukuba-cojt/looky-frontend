import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { toast } from "sonner-native";
import { Avatar, Text, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { supabase } from "@/lib/client";

const SettingsPage = () => {
  const { t } = useTranslation("settings");
  const { session } = useAuth();

  const { data: user } = useQuery(
    supabase
      .from("t_user")
      .select("id, name, avatar_url, gender")
      .eq("id", session?.user.id ?? "")
      .single(),
  );

  return (
    <YStack flex={1} pt="$8" px="$8" gap="$10">
      <XStack px="$2" items="center" gap="$4">
        <Avatar circular size="$16">
          <Avatar.Image src={user?.avatar_url || undefined} />
          <Avatar.Fallback
            items="center"
            justify="center"
            bg="$mutedBackground"
          >
            <Text fontSize="$2xl" fontWeight="$semibold">
              {user?.name.charAt(0).toUpperCase() ?? ""}
            </Text>
          </Avatar.Fallback>
        </Avatar>
        <YStack flex={1} gap="$2">
          <Text
            fontSize="$xl"
            fontWeight="$bold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user?.name ?? ""}
          </Text>
          <Text
            fontSize="$sm"
            color="$mutedColor"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user?.gender?.toUpperCase() ?? ""}
          </Text>
        </YStack>
      </XStack>
      <YStack gap="$6">
        <Link href="/settings/profile" asChild>
          <Button variant="ghost" justify="space-between">
            <XStack gap="$3" items="center">
              <Button.Icon>
                <Icons.userRound size="$4" />
              </Button.Icon>
              <Button.Text>{t("profile")}</Button.Text>
            </XStack>
            <Button.Icon>
              <Icons.chevronRight size="$4" />
            </Button.Icon>
          </Button>
        </Link>
        <Link href="/settings/style" asChild>
          <Button variant="ghost" justify="space-between">
            <XStack gap="$3" items="center">
              <Button.Icon>
                <Icons.shirt size="$4" />
              </Button.Icon>
              <Button.Text>{t("style")}</Button.Text>
            </XStack>
            <Button.Icon>
              <Icons.chevronRight size="$4" />
            </Button.Icon>
          </Button>
        </Link>
        <Link href="/settings/language" asChild>
          <Button variant="ghost" justify="space-between">
            <XStack gap="$3" items="center">
              <Button.Icon>
                <Icons.languages size="$4" />
              </Button.Icon>
              <Button.Text>{t("language")}</Button.Text>
            </XStack>
            <Button.Icon>
              <Icons.chevronRight size="$4" />
            </Button.Icon>
          </Button>
        </Link>
        <Link href="/settings/theme" asChild>
          <Button variant="ghost" justify="space-between">
            <XStack gap="$3" items="center">
              <Button.Icon>
                <Icons.palette size="$4" />
              </Button.Icon>
              <Button.Text>{t("theme")}</Button.Text>
            </XStack>
            <Button.Icon>
              <Icons.chevronRight size="$4" />
            </Button.Icon>
          </Button>
        </Link>
        <Link href="/settings/policy" asChild>
          <Button variant="ghost" justify="space-between">
            <XStack gap="$3" items="center">
              <Button.Icon>
                <Icons.palette size="$4" />
              </Button.Icon>
              <Button.Text>{t("policy")}</Button.Text>
            </XStack>
            <Button.Icon>
              <Icons.chevronRight size="$4" />
            </Button.Icon>
          </Button>
        </Link>
        <Button
          variant="ghost"
          onPress={() => {
            Alert.alert(
              t("signout.title"),
              t("signout.description"),
              [
                {
                  text: t("signout.cancel"),
                  style: "cancel",
                },
                {
                  text: t("signout.continue"),
                  onPress: async () => {
                    try {
                      await signOut();
                    } catch {
                      toast.error(t("signout.error"));
                    }
                  },
                },
              ],
              { cancelable: true },
            );
          }}
          justify="space-between"
        >
          <XStack gap="$3" items="center">
            <Button.Icon>
              <Icons.logout size="$4" />
            </Button.Icon>
            <Button.Text>{t("signout.title")}</Button.Text>
          </XStack>
          <Button.Icon>
            <Icons.chevronRight size="$4" />
          </Button.Icon>
        </Button>
      </YStack>
    </YStack>
  );
};

export default SettingsPage;
