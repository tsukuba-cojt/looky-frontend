import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { subcategories } from "@/constants";
import { useSearchQueryStore } from "@/stores/useSearchQueryStore";
import type { Category } from "@/types";

const SubcategoryPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: Category }>();
  const query = useSearchQueryStore((state) => state.query);
  const setQuery = useSearchQueryStore((state) => state.setQuery);

  return (
    <YStack flex={1} pt="$4" gap="$2">
      <FlashList
        contentContainerStyle={{ paddingBottom: 8 }}
        data={subcategories[category]}
        estimatedItemSize={64}
        renderItem={({ item }) => (
          <Button
            variant="ghost"
            h="$14"
            px="$8"
            justify="space-between"
            rounded="$none"
            onPress={() => {
              setQuery({ subcategory: item });
              router.back();
            }}
          >
            <Button.Text> {t(`subcategory.${category}.${item}`)}</Button.Text>
            {query.subcategory === item && (
              <Button.Icon>
                <Icons.check size="$4" />
              </Button.Icon>
            )}
          </Button>
        )}
      />
    </YStack>
  );
};

export default SubcategoryPage;
