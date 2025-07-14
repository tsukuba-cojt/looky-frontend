import { FlashList } from "@shopify/flash-list";
import { useCursorInfiniteScrollQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { H1, Spinner, Text, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import { categories } from "@/constants";
import { useDownload } from "@/hooks/useDownload";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";
import type { Category, UserVton, Vton } from "@/types";

type Item = Pick<UserVton, "id"> & {
  vton: Pick<Vton, "tops_id" | "object_key"> | null;
};

const OutfitPage = memo(() => {
  const { t } = useTranslation(["common", "collections"]);
  const session = useSessionStore((state) => state.session);
  const [category, setCategory] = useState<Category>("tops");
  const [items, setItems] = useState<Item[]>([]);

  const { loadMore, isLoading, isValidating } = useCursorInfiniteScrollQuery(
    () =>
      supabase
        .from("t_user_vton")
        .select(`
          id,
          vton: t_vton (tops_id,object_key)
        `)
        .eq("user_id", session?.user.id ?? "")
        .eq("feedback", "like")
        .order("created_at", { ascending: true })
        .order("id", { ascending: true })
        .limit(12),
    {
      orderBy: "id",
      uqOrderBy: "id",
      onSuccess: async (data) => {
        const page = data.at(-1) ?? [];

        const next = await Promise.all(
          page.map(async (item) => {
            if (!item.vton) {
              return item;
            }

            const url = await download({
              bucketName: "looky-vton-images",
              objectKey: item.vton.object_key,
            });

            return {
              ...item,
              vton: { ...item.vton, object_key: url as string },
            };
          }),
        );

        setItems((prev) => [...prev, ...next]);
      },
    },
  );

  const { trigger: download } = useDownload();

  const isRefreshing = !isLoading && isValidating;

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
          data={items}
          onEndReached={loadMore}
          estimatedItemSize={240}
          overrideProps={{
            contentContainerStyle: { flexGrow: 1, paddingHorizontal: 24 },
          }}
          ListFooterComponent={() =>
            isRefreshing && (
              <View pt="$4" justify="center">
                <Spinner color="$mutedColor" />
              </View>
            )
          }
          ListEmptyComponent={() => (
            <YStack flex={1} pt="$20" items="center" gap="$6">
              <View w={200} h={200} rounded="$full" bg="$mutedBackground" />
              <YStack items="center" gap="$4">
                <H1 fontWeight="$bold" fontSize="$xl">
                  {t("collections:outfit.empty.title")}
                </H1>
                <Text
                  text="center"
                  fontSize="$sm"
                  lineHeight="$sm"
                  color="$mutedColor"
                >
                  {t("collections:outfit.empty.description")}
                </Text>
              </YStack>
            </YStack>
          )}
          renderItem={({ item, index }) => (
            <View
              pt={index > 1 ? 16 : 0}
              pl={index % 2 === 1 ? 8 : 0}
              pr={index % 2 === 0 ? 8 : 0}
            >
              <Link
                href={{
                  pathname: "/details/[id]",
                  params: { id: item.vton?.tops_id },
                }}
                asChild
              >
                <TouchableOpacity activeOpacity={0.6}>
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
                      source={item.vton?.object_key}
                      transition={200}
                    />
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        />
      )}
    </YStack>
  );
});

export default OutfitPage;
