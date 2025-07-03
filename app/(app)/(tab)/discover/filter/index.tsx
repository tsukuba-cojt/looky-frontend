import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { useSearchQueryStore } from "@/stores/useSearchQueryStore";

const FilterPage = () => {
  const { t } = useTranslation(["common", "discover"]);
  const insets = useSafeAreaInsets();
  const query = useSearchQueryStore((state) => state.query);

  return (
    <YStack flex={1} pt="$4" justify="space-between">
      <YStack gap="$2">
        <Link href="/discover/filter/genders" asChild>
          <Button
            variant="ghost"
            h="$16"
            pr="$8"
            pl="$6"
            justify="space-between"
            rounded="$none"
          >
            <XStack gap="$3" items="center">
              <Button.Icon>
                <View p="$2" bg="$mutedBackground" rounded="$full">
                  <Icons.userRound size="$4" />
                </View>
              </Button.Icon>
              <Button.Text>{t("discover:genders")}</Button.Text>
            </XStack>
            <XStack gap="$3">
              <Button.Text color={query.gender ? "$color" : "$mutedColor"}>
                {query.gender
                  ? t(`common:gender.${query.gender}`)
                  : t("discover:not_selected")}
              </Button.Text>
              <Button.Icon>
                <Icons.chevronRight size="$4" />
              </Button.Icon>
            </XStack>
          </Button>
        </Link>
        <Link href="/discover/filter/categories" asChild>
          <Button
            variant="ghost"
            h="$16"
            pl="$6"
            pr="$8"
            justify="space-between"
            rounded="$none"
          >
            <XStack gap="$3" items="center">
              <Button.Icon>
                <View p="$2" bg="$mutedBackground" rounded="$full">
                  <Icons.shirt size="$4" />
                </View>
              </Button.Icon>
              <Button.Text>{t("discover:categories")}</Button.Text>
            </XStack>
            <XStack gap="$3">
              <Button.Text color={query.subcategory ? "$color" : "$mutedColor"}>
                {query.subcategory
                  ? t(
                      `common:subcategory.${query.category}.${query.subcategory}`,
                    )
                  : t("discover:not_selected")}
              </Button.Text>
              <Button.Icon>
                <Icons.chevronRight size="$4" />
              </Button.Icon>
            </XStack>
          </Button>
        </Link>
        <Link href="/discover/filter/colors" asChild>
          <Button
            variant="ghost"
            h="$16"
            pl="$6"
            pr="$8"
            justify="space-between"
            rounded="$none"
          >
            <XStack gap="$3" items="center">
              <Button.Icon>
                <View p="$2" bg="$mutedBackground" rounded="$full">
                  <Icons.palette size="$4" />
                </View>
              </Button.Icon>
              <Button.Text>{t("discover:colors")}</Button.Text>
            </XStack>
            <XStack gap="$3">
              <Button.Text color={query.color ? "$color" : "$mutedColor"}>
                {query.color
                  ? t(`common:color.${query.color}`)
                  : t("discover:not_selected")}
              </Button.Text>
              <Button.Icon>
                <Icons.chevronRight size="$4" />
              </Button.Icon>
            </XStack>
          </Button>
        </Link>
      </YStack>
      <YStack w="100%" gap="$4" px="$8" pb={insets.bottom}>
        <Button variant="primary">
          <Button.Text>{t("discover:search")}</Button.Text>
        </Button>
        <Button variant="link">
          <Button.Text>{t("discover:clear")}</Button.Text>
        </Button>
      </YStack>
    </YStack>
  );
};
export default FilterPage;
