import { usePathname } from "expo-router";
import { TabList, TabSlot, Tabs, TabTrigger } from "expo-router/ui";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Heading, Text, XStack, YStack } from "tamagui";
import { Icons } from "@/components/Icons";
import { navConfig } from "@/config/nav";

const TabLayout = () => {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <XStack
        pt={insets.top + 2}
        px="$9"
        pb="$3"
        items="center"
        justify="space-between"
      >
        <Heading>
          {t(navConfig.find((item) => item.href === pathname)?.key ?? "")}
        </Heading>
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
          {navConfig.map((item) => {
            const isActive = pathname === item.href;
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
                    {t(`nav.${item.key}`)}
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
