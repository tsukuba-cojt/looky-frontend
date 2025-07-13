import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { categories } from "@/constants";
import type { Category } from "@/types";

const data = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/1200/900?random=${i + 1}`,
}));

const LikePage = memo(() => {
  const { t } = useTranslation(["common", "collections"]);
  const [category, setCategory] = useState<Category>("tops");

  return (
    <YStack flex={1} pt="$6" gap="$4">
      <YStack gap="$4" px="$8">
        <XStack gap="$2">
          {categories.map((item, index) => (
            <Button
              key={index.toString()}
              variant={category === item ? "primary" : "outline"}
              h="auto"
              px="$3"
              py="$2"
              rounded="$full"
              boxShadow="none"
              onPress={() => setCategory(item)}
            >
              <Button.Text fontSize="$sm">
                {t(`common:category.${item}`)}
              </Button.Text>
            </Button>
          ))}
        </XStack>
      </YStack>
      <FlashList
        numColumns={2}
        data={data}
        estimatedItemSize={240}
        contentContainerStyle={{
          paddingHorizontal: 24,
        }}
        renderItem={({ item, index }) => (
          <View
            pt={index > 1 ? 16 : 0}
            pl={index % 2 === 1 ? 8 : 0}
            pr={index % 2 === 0 ? 8 : 0}
          >
            <View
              w="100%"
              aspectRatio={3 / 4}
              rounded="$2xl"
              boxShadow="$sm"
              overflow="hidden"
              bg="$mutedBackground"
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                }}
                source={item.url}
                transition={200}
              />
            </View>
          </View>
        )}
      />
    </YStack>
  );
});

export default LikePage;
