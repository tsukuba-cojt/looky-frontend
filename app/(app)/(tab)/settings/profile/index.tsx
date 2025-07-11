import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import {
  Link,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { Avatar, getFontSize, Text, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { ImagePickerSheet } from "@/components/ImagePickerSheet";
import { Skeleton } from "@/components/Skeleton";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";

const ProfilePage = () => {
  const { t } = useTranslation(["common", "settings"]);
  const session = useSessionStore((state) => state.session);
  const router = useRouter();
  const pathname = usePathname();
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const [isOpen, setIsOpen] = useState(false);

  const { data: user, isLoading } = useQuery(
    supabase
      .from("t_user")
      .select("id, name, avatar_url, gender, height")
      .eq("id", session?.user.id ?? "")
      .maybeSingle()
  );

  return (
    <>
      <YStack flex={1} items="center" pt="$8" gap="$8">
        <TouchableOpacity activeOpacity={0.6} onPress={() => setIsOpen(true)}>
          <Avatar circular size="$24">
            <Avatar.Image src={uri ?? user?.avatar_url ?? undefined} />
            <Avatar.Fallback
              items="center"
              justify="center"
              bg="$mutedBackground"
            >
              <Text fontSize="$4xl" fontWeight="$semibold">
                {user?.name?.charAt(0).toUpperCase() ??
                  t("common:not_configured").charAt(0)}
              </Text>
            </Avatar.Fallback>
          </Avatar>
        </TouchableOpacity>
        <YStack w="100%">
          <Link href="/settings/profile/name" asChild>
            <Button variant="ghost" h="$14" px="$6" gap="$4" rounded="$none">
              <Button.Text>{t("settings:profile.name.title")}</Button.Text>
              <XStack flex={1} gap="$4" justify="flex-end">
                {isLoading ? (
                  <Skeleton w="$20" h={getFontSize("$md")} rounded="$full" />
                ) : (
                  <Button.Text color={user?.name ? "$color" : "$mutedColor"}>
                    {user?.name ?? t("settings:profile.not_configured")}
                  </Button.Text>
                )}
                <Button.Icon>
                  <Icons.chevronRight size="$4" />
                </Button.Icon>
              </XStack>
            </Button>
          </Link>
          <Link href="/settings/profile/email" asChild>
            <Button variant="ghost" h="$14" px="$6" gap="$4" rounded="$none">
              <Button.Text>{t("settings:profile.email.title")}</Button.Text>
              <XStack flex={1} gap="$4" justify="flex-end">
                {isLoading ? (
                  <Skeleton w="$20" h={getFontSize("$md")} rounded="$full" />
                ) : (
                  <Button.Text
                    color={session?.user.email ? "$color" : "$mutedColor"}
                  >
                    {session?.user.email ??
                      t("settings:profile.not_configured")}
                  </Button.Text>
                )}
                <Button.Icon>
                  <Icons.chevronRight size="$4" />
                </Button.Icon>
              </XStack>
            </Button>
          </Link>
          <Link href="/settings/profile/gender" asChild>
            <Button variant="ghost" h="$14" px="$6" gap="$4" rounded="$none">
              <Button.Text>{t("settings:profile.gender.title")}</Button.Text>
              <XStack flex={1} gap="$4" justify="flex-end">
                {isLoading ? (
                  <Skeleton w="$20" h={getFontSize("$md")} rounded="$full" />
                ) : (
                  <Button.Text color={user?.gender ? "$color" : "$mutedColor"}>
                    {user?.gender
                      ? t(`common:gender.${user.gender}`)
                      : t("settings:profile.not_selected")}
                  </Button.Text>
                )}
                <Button.Icon>
                  <Icons.chevronRight size="$4" />
                </Button.Icon>
              </XStack>
            </Button>
          </Link>
          <Link href="/settings/profile/height" asChild>
            <Button variant="ghost" h="$14" px="$6" gap="$4" rounded="$none">
              <Button.Text>{t("settings:profile.height.title")}</Button.Text>
              <XStack flex={1} gap="$4" justify="flex-end">
                {isLoading ? (
                  <Skeleton w="$20" h={getFontSize("$md")} rounded="$full" />
                ) : (
                  <Button.Text color={user?.height ? "$color" : "$mutedColor"}>
                    {user?.height
                      ? t(`common:height.${user.height}`)
                      : t("settings:profile.not_configured")}
                  </Button.Text>
                )}
                <Button.Icon>
                  <Icons.chevronRight size="$4" />
                </Button.Icon>
              </XStack>
            </Button>
          </Link>
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
};

export default ProfilePage;
