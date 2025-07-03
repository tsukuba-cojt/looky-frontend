import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Link, usePathname } from "expo-router";
import { TabList, TabSlot, Tabs, TabTrigger } from "expo-router/ui";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar, H1, Text, XStack, YStack } from "tamagui";
import { Icons } from "@/components/Icons";
import { Skeleton } from "@/components/Skeleton";
import { tabs } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/client";

const TabLayout = () => {
  const { t } = useTranslation("common");
  const { session } = useAuth();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const { data: user, isLoading } = useQuery(
    supabase
      .from("t_user")
      .select("id, name, avatar_url")
      .eq("id", session?.user.id ?? "")
      .single(),
  );

  return (
    <Tabs>
      <XStack
        pt={insets.top + 8}
        px="$9"
        pb="$3"
        items="center"
        justify="space-between"
      >
        <H1 fontSize="$2xl" lineHeight="$2xl" fontWeight="$bold">
          {t(
            `tab.${tabs.find((item) => item.href === `/${pathname.split("/")[1]}`)?.key}`,
          )}
        </H1>
        {isLoading ? (
          <Skeleton w="$9" h="$9" rounded="$full" />
        ) : (
          <Link href="/settings" asChild>
            <Avatar circular size="$9">
              <Avatar.Image src={user?.avatar_url || undefined} />
              <Avatar.Fallback
                items="center"
                justify="center"
                bg="$mutedBackground"
              >
                <Text>{user?.name.charAt(0).toUpperCase() ?? ""}</Text>
              </Avatar.Fallback>
            </Avatar>
          </Link>
        )}
      </XStack>
      <TabSlot />
      <TabList asChild>
        <XStack
          pt="$3"
          px="$9"
          pb={insets.bottom + 2}
          items="center"
          justify="space-between"
        >
          {tabs.map((item) => {
            const isActive = item.href === `/${pathname.split("/")[1]}`;
            const Icon = Icons[item.icon as keyof typeof Icons];

            return (
              <TabTrigger key={item.key} name={item.name} href={item.href}>
                <YStack gap="$1" items="center">
                  <Icon
                    size="$6"
                    color={isActive ? "$primaryBackground" : "$color"}
                    opacity={isActive ? 1 : 0.6}
                  />
                  <Text
                    fontSize="$sm"
                    color={isActive ? "$primaryBackground" : "$color"}
                    opacity={isActive ? 1 : 0.6}
                  >
                    {t(`tab.${item.key}`)}
                  </Text>
                </YStack>
              </TabTrigger>
            );
          })}
        </XStack>
      </TabList>
    </Tabs>
  );
};

export default TabLayout;
