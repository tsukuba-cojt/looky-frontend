import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { CategorySelectSheet } from "@/components/CategorySelectSheet";
import { ColorPickerSheet } from "@/components/ColorPickerSheet/ColorPickerSheet";
import { GenderSelectSheet } from "@/components/GenderSelectSheet";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/Input";
import { useSheet } from "@/hooks/useSheet";
import type { Category, Color, Gender } from "@/types";

const data = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/1200/900?random=${i + 1}`,
}));

const SearchPage = () => {
  const { t } = useTranslation("search");
  const [gender, setGender] = useState<Gender>();
  const [category, setCategory] = useState<Category>();
  const [color, setColor] = useState<Color>();

  const { open, getSheetProps } = useSheet();

  return (
    <>
      <YStack flex={1} pt="$4" gap="$4">
        <YStack gap="$4" px="$8">
          <XStack items="center" gap="$4">
            <XStack position="relative" items="center" shrink={1}>
              <Input
                placeholder={t("placeholder")}
                rounded="$full"
                borderWidth={0}
                pl="$9"
                boxShadow="none"
                bg="$mutedBackground"
              />
              <Icons.search
                position="absolute"
                l="$3"
                size="$4"
                color="$mutedColor"
              />
            </XStack>
            <Icons.slidersHorizontal size="$5" />
          </XStack>
          <XStack gap="$2">
            <Button
              variant="secondary"
              h="$8"
              pr="$2"
              pl="$3"
              gap="$1"
              rounded="$full"
              boxShadow="none"
              onPress={() => open("gender")}
            >
              <Button.Text fontSize="$sm">{t("label.gender")}</Button.Text>
              <Button.Icon>
                <Icons.chevronDown size="$4" color="$mutedColor" />
              </Button.Icon>
            </Button>
            <Button
              variant="secondary"
              h="$8"
              pr="$2"
              pl="$3"
              gap="$1"
              rounded="$full"
              boxShadow="none"
              onPress={() => open("category")}
            >
              <Button.Text fontSize="$sm">{t("label.category")}</Button.Text>
              <Button.Icon>
                <Icons.chevronDown size="$4" color="$mutedColor" />
              </Button.Icon>
            </Button>
            <Button
              variant="secondary"
              h="$8"
              pr="$2"
              pl="$3"
              gap="$1"
              rounded="$full"
              boxShadow="none"
              onPress={() => open("color")}
            >
              <Button.Text fontSize="$sm">{t("label.color")}</Button.Text>
              <Button.Icon>
                <Icons.chevronDown size="$4" color="$mutedColor" />
              </Button.Icon>
            </Button>
          </XStack>
        </YStack>
        <FlashList
          numColumns={2}
          data={data}
          estimatedItemSize={236}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          renderItem={({ item }) => (
            <View p="$1.5">
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
      <GenderSelectSheet
        {...getSheetProps("gender")}
        gender={gender}
        onGenderChange={setGender}
      />
      <CategorySelectSheet
        {...getSheetProps("category")}
        category={category}
        onCategoryChange={setCategory}
      />
      <ColorPickerSheet
        {...getSheetProps("color")}
        color={color}
        onColorChange={setColor}
      />
    </>
  );
};
export default SearchPage;
