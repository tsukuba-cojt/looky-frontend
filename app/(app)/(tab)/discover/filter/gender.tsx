import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { View } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { genders } from "@/constants";
import { useSearchQueryStore } from "@/stores/useSearchQueryStore";

const GenderPage = memo(() => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const query = useSearchQueryStore((state) => state.query);
  const setQuery = useSearchQueryStore((state) => state.setQuery);

  return (
    <View flex={1} pt="$4" gap="$2">
      <FlashList
        contentContainerStyle={{ paddingBottom: 8 }}
        data={genders}
        estimatedItemSize={64}
        renderItem={({ item }) => (
          <Button
            variant="ghost"
            h="$14"
            px="$8"
            justify="space-between"
            rounded="$none"
            onPress={() => {
              setQuery({ gender: item });
              router.back();
            }}
          >
            <Button.Text> {t(`gender.${item}`)}</Button.Text>
            {query.gender === item && (
              <Button.Icon>
                <Icons.check size="$4" />
              </Button.Icon>
            )}
          </Button>
        )}
      />
    </View>
  );
});

export default GenderPage;
