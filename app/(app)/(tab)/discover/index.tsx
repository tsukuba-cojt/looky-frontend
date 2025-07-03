import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
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

const DiscoverPage = () => {
  const { t } = useTranslation("discover");
  const [gender, setGender] = useState<Gender>();
  const [category, setCategory] = useState<Category>();
  const [color, setColor] = useState<Color>();

  const { open, getSheetProps } = useSheet();

  return (
    <>
      <YStack flex={1} pt="$4" gap="$4">
        <YStack gap="$4" px="$8">
          <XStack items="center" gap="$2">
            <XStack position="relative" items="center" shrink={1}>
              <Link href="/discover/search" asChild>
                <Input
                  readOnly
                  placeholder={t("placeholder")}
                  rounded="$full"
                  borderWidth={0}
                  pl="$9"
                  boxShadow="none"
                  bg="$mutedBackground"
                />
              </Link>
              <Icons.search
                position="absolute"
                l="$3"
                size="$4"
                color="$mutedColor"
              />
            </XStack>
            <Link href="/discover/filter" asChild>
              <Button variant="ghost" size="icon" w="$9" h="$9" circular>
                <Button.Icon>
                  <Icons.slidersHorizontal size="$5" />
                </Button.Icon>
              </Button>
            </Link>
          </XStack>
          <XStack gap="$2">
            <Button
              variant="outline"
              h="$8"
              pr="$2"
              pl="$3"
              gap="$1"
              rounded="$full"
              boxShadow="none"
              onPress={() => open("gender")}
            >
              <Button.Text fontSize="$sm">{t("genders")}</Button.Text>
              <Button.Icon>
                <Icons.chevronDown size="$4" color="$mutedColor" />
              </Button.Icon>
            </Button>
            <Button
              variant="outline"
              h="$8"
              pr="$2"
              pl="$3"
              gap="$1"
              rounded="$full"
              boxShadow="none"
              onPress={() => open("category")}
            >
              <Button.Text fontSize="$sm">{t("categories")}</Button.Text>
              <Button.Icon>
                <Icons.chevronDown size="$4" color="$mutedColor" />
              </Button.Icon>
            </Button>
            <Button
              variant="outline"
              h="$8"
              pr="$2"
              pl="$3"
              gap="$1"
              rounded="$full"
              boxShadow="none"
              onPress={() => open("color")}
            >
              <Button.Text fontSize="$sm">{t("colors")}</Button.Text>
              <Button.Icon>
                <Icons.chevronDown size="$4" color="$mutedColor" />
              </Button.Icon>
            </Button>
          </XStack>
        </YStack>
        <FlashList
          numColumns={2}
          data={data}
          estimatedItemSize={240}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/details/[id]",
                params: { id: item.id },
              }}
              asChild
            >
              <TouchableOpacity activeOpacity={0.6}>
                <View p="$1.5">
                  <View
                    position="relative"
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
                    <View position="absolute" b={8} r={8}>
                      <TouchableOpacity activeOpacity={0.6}>
                        <View
                          p="$2"
                          items="center"
                          justify="center"
                          bg="black"
                          rounded="$full"
                          opacity={0.8}
                          boxShadow="$shadow.xl"
                        >
                          <Icons.heart size="$4" color="white" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
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
export default DiscoverPage;
