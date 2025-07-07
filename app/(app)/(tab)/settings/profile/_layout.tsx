import { Link, Stack, usePathname, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { PortalProvider, Text } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";

const ProfileLayout = () => {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <PortalProvider shouldAddRootHost>
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
            title: t("profile.title"),
          }}
        />
        <Stack.Screen
          name="name"
          options={{
            title: t("profile.name.title"),
          }}
        />
        <Stack.Screen
          name="email"
          options={{
            title: t("profile.email.title"),
          }}
        />
        <Stack.Screen
          name="gender"
          options={{
            title: t("profile.gender.title"),
          }}
        />
        <Stack.Screen
          name="height"
          options={{
            title: t("profile.height.title"),
          }}
        />
      </Stack>
    </PortalProvider>
  );
};

export default ProfileLayout;
