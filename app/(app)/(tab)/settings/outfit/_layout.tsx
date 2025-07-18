import { Link, Stack, usePathname, useRouter } from "expo-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";

const OutfitLayout = memo(() => {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerLeft: (props) =>
          pathname.split("/").length > 3 && (
            <Button
              {...props}
              variant="ghost"
              size="icon"
              w="$9"
              h="$9"
              circular
              onPress={router.back}
            >
              <Button.Icon>
                <Icons.chevronLeft size="$6" />
              </Button.Icon>
            </Button>
          ),
        headerTitle: ({ children, ...props }) => (
          <Text {...props} fontSize="$xl" fontWeight="$bold">
            {children}
          </Text>
        ),
        headerRight: (props) => (
          <Link replace href="/settings" asChild>
            <Button
              {...props}
              variant="ghost"
              size="icon"
              w="$9"
              h="$9"
              circular
            >
              <Button.Icon>
                <Icons.x size="$6" />
              </Button.Icon>
            </Button>
          </Link>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t("outfit.gallery.title"),
        }}
      />
      <Stack.Screen
        name="guide"
        options={{
          title: t("outfit.guide.title"),
        }}
      />
    </Stack>
  );
});

export default OutfitLayout;
