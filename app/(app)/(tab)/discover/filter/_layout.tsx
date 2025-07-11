import { Link, Stack, usePathname, useRouter } from "expo-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";

const FilterLayout = memo(() => {
  const { t } = useTranslation("discover");
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
          <Link replace href="/discover" asChild>
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
          title: t("filter"),
        }}
      />
      <Stack.Screen
        name="gender"
        options={{
          title: t("gender"),
        }}
      />
      <Stack.Screen
        name="category"
        options={{
          title: t("category"),
        }}
      />
      <Stack.Screen
        name="subcategory"
        options={{
          title: t("subcategory"),
        }}
      />
      <Stack.Screen
        name="color"
        options={{
          title: t("color"),
        }}
      />
    </Stack>
  );
});

export default FilterLayout;
