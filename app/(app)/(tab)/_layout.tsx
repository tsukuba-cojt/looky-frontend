import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { TabList, TabSlot, Tabs, TabTrigger } from "expo-router/ui";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XStack, YStack } from "tamagui";
import { Header } from "@/components/Header";
import type { Icons } from "@/components/Icons";
import { TabButton } from "@/components/TabButton";
import { tabs } from "@/constants";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";

const TabLayout = memo(() => {
  const { t } = useTranslation("common");
  const session = useSessionStore((state) => state.session);
  const insets = useSafeAreaInsets();

  const { data: user, isLoading } = useQuery(
    supabase
      .from("t_user")
      .select("id, name, avatar_url")
      .eq("id", session?.user.id ?? "")
      .maybeSingle(),
  );

  return (
    <Tabs
      options={{
        screenLayout: ({ children, route }) => (
          <YStack flex={1}>
            <Header
              title={t(`tab.${route.name === "index" ? "try_on" : route.name}`)}
              user={user ?? null}
              isLoading={isLoading}
            />
            {children}
          </YStack>
        ),
      }}
    >
      <TabSlot />
      <TabList asChild>
        <XStack
          pt="$3"
          px="$9"
          pb={insets.bottom + 2}
          items="center"
          justify="space-between"
        >
          {tabs.map((item) => (
            <TabTrigger
              key={item.key}
              name={item.name}
              href={item.href}
              asChild
            >
              <TabButton
                label={t(`tab.${item.key}`)}
                icon={item.icon as keyof typeof Icons}
              />
            </TabTrigger>
          ))}
        </XStack>
      </TabList>
    </Tabs>
  );
});

export default TabLayout;
