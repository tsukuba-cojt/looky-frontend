import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Link, usePathname, useRouter } from "expo-router";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, TouchableOpacity } from "react-native";
import { toast } from "sonner-native";
import { Avatar, getFontSize, Text, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { ImagePickerSheet } from "@/components/ImagePickerSheet";
import { Skeleton } from "@/components/Skeleton";
import { signOut } from "@/lib/auth";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";

const SettingsPage = memo(() => {
  const { t } = useTranslation(["common", "settings"]);
  const session = useSessionStore((state) => state.session);
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { data: user, isLoading } = useQuery(
    supabase
      .from("t_user")
      .select("id, name, avatar_url, gender")
      .eq("id", session?.user.id ?? "")
      .maybeSingle(),
  );

  return (
    <>
      <YStack flex={1} pt="$8" px="$8" gap="$10">
        <XStack px="$2" items="center" gap="$4">
          <TouchableOpacity activeOpacity={0.6} onPress={() => setIsOpen(true)}>
            <Avatar circular size="$16">
              <Avatar.Image
                src={`https://looky-avatar-images.s3.ap-northeast-1.amazonaws.com/${user?.avatar_url}`}
              />
              <Avatar.Fallback
                items="center"
                justify="center"
                bg="$mutedBackground"
              >
                <Text fontSize="$2xl" fontWeight="$semibold">
                  {user?.name?.charAt(0).toUpperCase() ??
                    t("common:not_configured").charAt(0)}
                </Text>
              </Avatar.Fallback>
            </Avatar>
          </TouchableOpacity>
          <View flex={1}>
            {isLoading ? (
              <YStack gap="$2">
                <Skeleton w="$16" h={getFontSize("$xl")} />
                <Skeleton w="$32" h={getFontSize("$sm")} />
              </YStack>
            ) : (
              <YStack gap="$2">
                <Text
                  fontSize="$xl"
                  fontWeight="$bold"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {user?.name ?? t("common:not_configured")}
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
            )}
          </View>
        </XStack>
        <YStack gap="$6">
          <Link href="/settings/profile" asChild>
            <Button variant="ghost" justify="space-between">
              <XStack gap="$3" items="center">
                <Button.Icon>
                  <Icons.userRound size="$4" />
                </Button.Icon>
                <Button.Text>{t("settings:profile.title")}</Button.Text>
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
                <Button.Text>{t("settings:style.title")}</Button.Text>
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
                <Button.Text>{t("settings:language.title")}</Button.Text>
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
                <Button.Text>{t("settings:theme.title")}</Button.Text>
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
                t("settings:signout.title"),
                t("settings:signout.description"),
                [
                  {
                    text: t("settings:signout.cancel"),
                    style: "cancel",
                  },
                  {
                    text: t("settings:signout.continue"),
                    onPress: async () => {
                      try {
                        await signOut();
                        toast.success(t("settings:signout.success"));
                      } catch {
                        toast.error(t("settings:signout.error"));
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
              <Button.Text>{t("settings:signout.title")}</Button.Text>
            </XStack>
            <Button.Icon>
              <Icons.chevronRight size="$4" />
            </Button.Icon>
          </Button>
        </YStack>
      </YStack>
      <ImagePickerSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        onImagePicked={(uri) => {
          router.push({
            pathname: "/crop",
            params: {
              uri,
              from: pathname,
            },
          });
          setIsOpen(false);
        }}
      />
    </>
  );
});

export default SettingsPage;
