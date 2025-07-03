import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { categories } from "@/constants";
import { useSearchQueryStore } from "@/stores/useSearchQueryStore";

const CategoriesPage = () => {
  const { t } = useTranslation("common");
  const setQuery = useSearchQueryStore().setQuery;

  return (
    <YStack flex={1} pt="$4" gap="$2">
      <FlashList
        contentContainerStyle={{ paddingBottom: 8 }}
        data={categories}
        estimatedItemSize={64}
        renderItem={({ item }) => (
          <Link
            replace
            href={{
              pathname: "/discover/filter/categories/[category]",
              params: { category: item },
            }}
            asChild
          >
            <Button
              variant="ghost"
              h="$16"
              px="$8"
              justify="space-between"
              rounded="$none"
              onPress={() => setQuery({ category: item })}
            >
              <Button.Text> {t(`category.${item}`)}</Button.Text>
              <Button.Icon>
                <Icons.chevronRight size="$4" />
              </Button.Icon>
            </Button>
          </Link>
        )}
      />
    </YStack>
  );
};
export default CategoriesPage;
