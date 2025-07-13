import { FlashList } from "@shopify/flash-list";
import { useCursorInfiniteScrollQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { Spinner, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { CategorySelectSheet } from "@/components/CategorySelectSheet";
import { ColorPickerSheet } from "@/components/ColorPickerSheet/ColorPickerSheet";
import { GenderSelectSheet } from "@/components/GenderSelectSheet";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/Input";
import { Skeleton } from "@/components/Skeleton";
import { useSheet } from "@/hooks/useSheet";
import { supabase } from "@/lib/client";
import type { Category, Color, Gender } from "@/types";

const DiscoverPage = memo(() => {
  const { t } = useTranslation("discover");
  const [gender, setGender] = useState<Gender>();
  const [category, setCategory] = useState<Category>();
  const [color, setColor] = useState<Color>();

  const { open, getSheetProps } = useSheet();

  const { data, loadMore, isLoading, isValidating } =
    useCursorInfiniteScrollQuery(
      () =>
        supabase
          .from("t_clothes")
          .select("id,object_key")
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .limit(12),
      { orderBy: "created_at", uqOrderBy: "id" },
    );

  const isRefreshing = !isLoading && isValidating;

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
              px="$3"
              gap="$1"
              rounded="$full"
              boxShadow="none"
              onPress={() => open("gender")}
            >
              <Button.Text fontSize="$sm">{t("gender")}</Button.Text>
              <Button.Icon>
                <Icons.chevronDown size="$4" color="$mutedColor" />
              </Button.Icon>
            </Button>
            <Button
              variant="outline"
              h="$8"
              px="$3"
              gap="$1"
              rounded="$full"
              boxShadow="none"
              onPress={() => open("category")}
            >
              <Button.Text fontSize="$sm">{t("category")}</Button.Text>
              <Button.Icon>
                <Icons.chevronDown size="$4" color="$mutedColor" />
              </Button.Icon>
            </Button>
            <Button
              variant="outline"
              h="$8"
              px="$3"
              gap="$1"
              rounded="$full"
              boxShadow="none"
              onPress={() => open("color")}
            >
              <Button.Text fontSize="$sm">{t("color")}</Button.Text>
              <Button.Icon>
                <Icons.chevronDown size="$4" color="$mutedColor" />
              </Button.Icon>
            </Button>
          </XStack>
        </YStack>
        {isLoading ? (
          <FlashList
            numColumns={2}
            data={Array.from({ length: 6 })}
            estimatedItemSize={240}
            contentContainerStyle={{
              paddingHorizontal: 24,
            }}
            renderItem={({ index }) => (
              <View
                pt={index > 1 ? 16 : 0}
                pl={index % 2 === 1 ? 8 : 0}
                pr={index % 2 === 0 ? 8 : 0}
              >
                <Skeleton
                  w="100%"
                  aspectRatio={3 / 4}
                  rounded="$2xl"
                  boxShadow="$sm"
                />
              </View>
            )}
          />
        ) : (
          <FlashList
            numColumns={2}
            data={data}
            estimatedItemSize={240}
            onEndReached={loadMore}
            contentContainerStyle={{
              paddingHorizontal: 24,
            }}
            ListFooterComponent={() =>
              isRefreshing && (
                <View pt="$4" justify="center">
                  <Spinner color="$mutedColor" />
                </View>
              )
            }
            renderItem={({ item, index }) => (
              <Link
                href={{
                  pathname: "/details/[id]",
                  params: { id: item.id },
                }}
                asChild
              >
                <TouchableOpacity activeOpacity={0.6}>
                  <View
                    pt={index > 1 ? 16 : 0}
                    pl={index % 2 === 1 ? 8 : 0}
                    pr={index % 2 === 0 ? 8 : 0}
                  >
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
                        source={`https://looky-clothes-images.s3.ap-northeast-1.amazonaws.com/${item.object_key}`}
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
        )}
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
});

export default DiscoverPage;
