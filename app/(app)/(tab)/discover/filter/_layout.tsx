import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { H1, View, XStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";

const FilterLayout = () => {
  const { t } = useTranslation("discover");
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        header: ({ route }) => (
          <XStack items="center" justify="space-between" pt="$4" px="$4">
            {route.name === "index" ? (
              <View w="$9" />
            ) : (
              <Button
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
            )}
            <H1 fontSize="$xl" fontWeight="$bold">
              {t(route.name === "index" ? "filter" : route.name)}
            </H1>
            <Button
              variant="ghost"
              size="icon"
              w="$9"
              h="$9"
              circular
              onPress={router.back}
            >
              <Button.Icon>
                <Icons.x size="$6" />
              </Button.Icon>
            </Button>
          </XStack>
        ),
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="categories" />
    </Stack>
  );
};

export default FilterLayout;
