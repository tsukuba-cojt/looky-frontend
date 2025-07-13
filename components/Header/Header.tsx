import { Link } from "expo-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, H1, Text, XStack } from "tamagui";
import type { User } from "@/types";
import { Skeleton } from "../Skeleton";

interface HeaderProps {
  title: string;
  user: Pick<User, "id" | "name" | "avatar_url"> | null;
  isLoading: boolean;
}

export const Header = memo(({ title, user, isLoading }: HeaderProps) => {
  const { t } = useTranslation("common");
  const insets = useSafeAreaInsets();

  return (
    <XStack
      px="$8"
      pt={insets.top + 8}
      pb="$2"
      items="center"
      justify="space-between"
    >
      <H1 fontSize="$2xl" lineHeight="$2xl" fontWeight="$bold">
        {title}
      </H1>
      {isLoading ? (
        <Skeleton w="$9" h="$9" />
      ) : (
        <Link href="/settings" asChild>
          <Avatar circular size="$9">
            <Avatar.Image
              src={`https://looky-avatar-images.s3.ap-northeast-1.amazonaws.com/${user?.avatar_url}`}
            />
            <Avatar.Fallback
              items="center"
              justify="center"
              bg="$mutedBackground"
            >
              <Text>
                {user?.name?.charAt(0).toUpperCase() ??
                  t("not_configured").charAt(0)}
              </Text>
            </Avatar.Fallback>
          </Avatar>
        </Link>
      )}
    </XStack>
  );
});
