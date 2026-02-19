import { FlashList } from "@shopify/flash-list";
import {
  useCursorInfiniteScrollQuery,
  useDeleteMutation,
  useInsertMutation,
  useRevalidateTables,
} from "@supabase-cache-helpers/postgrest-swr";
import { useFileUrl } from "@supabase-cache-helpers/storage-swr";
import * as Crypto from "expo-crypto";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import * as R from "remeda";
import { toast } from "sonner-native";
import { H1, Spinner, Text, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Heart } from "@/components/Heart";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/Input";
import { Skeleton } from "@/components/Skeleton";
import { supabase } from "@/lib/client";
import { useSearchQueryStore } from "@/stores/useSearchQueryStore";
import { useSessionStore } from "@/stores/useSessionStore";

interface ClothesItemProps {
  id: number;
  isLiked: boolean;
  insertLike: () => Promise<void>;
  deleteLike: () => Promise<void>;
}

const ClothesItem = memo(
  ({ id, isLiked, insertLike, deleteLike }: ClothesItemProps) => {
    const { data: url } = useFileUrl(
      supabase.storage.from("clothes"),
      `${id}.png`,
      "public",
      {
        ensureExistence: true,
      },
    );

    const toggleLike = useCallback(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (isLiked) {
        await deleteLike();
      } else {
        await insertLike();
      }
    }, [isLiked, insertLike, deleteLike]);

    return (
      <Link
        href={{
          pathname: "/details/[id]",
          params: { id },
        }}
        asChild
      >
        <TouchableOpacity activeOpacity={0.6}>
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
              source={url}
              transition={200}
            />
            <View position="absolute" b={8} r={8}>
              <TouchableOpacity activeOpacity={0.6} onPress={toggleLike}>
                <View
                  position="relative"
                  w="$8"
                  h="$8"
                  items="center"
                  justify="center"
                  bg="black"
                  rounded="$full"
                  opacity={0.8}
                  boxShadow="$shadow.xl"
                >
                  <Heart color="white" active={isLiked} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  },
);

const DiscoverPage = memo(() => {
  const { t } = useTranslation("discover");
  const session = useSessionStore((state) => state.session);
  const query = useSearchQueryStore((state) => state.query);

  const { data, loadMore, isLoading, isValidating, mutate } =
    useCursorInfiniteScrollQuery(
      () => {
        let builder = supabase
          .from("t_clothes")
          .select(`
          id,
          like: t_like (count)
        `)
          .eq("like.user_id", session?.user.id ?? "")
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .limit(12);

        if (query.category) {
          builder = builder.eq("category", query.category);
        }
        if (query.subcategory) {
          builder = builder.eq("subcategory", query.subcategory);
        }
        if (query.gender) {
          builder = builder.eq(
            "gender",
            query.gender === "other" ? "unisex" : query.gender,
          );
        }
        if (query.color) {
          builder = builder.eq("color", query.color);
        }
        return builder;
      },
      {
        orderBy: "id",
        uqOrderBy: "id",
      },
    );

  const revalidateTables = useRevalidateTables([
    { schema: "public", table: "t_clothes" },
    { schema: "public", table: "t_like" },
  ]);

  const { trigger: insertLike } = useInsertMutation(
    supabase.from("t_like"),
    ["id"],
    "*",
    {
      onSuccess: async (data) => {
        // @ts-expect-error
        await mutate((prev) => {
          if (!prev) {
            return;
          }

          const next = R.pipe(
            prev,
            R.flat(),
            R.map((clothes) =>
              clothes.id === data?.[0].clothes_id
                ? {
                    ...clothes,
                    like: [{ count: 1 }],
                  }
                : clothes,
            ),
          );

          return next;
        });

        await revalidateTables();
      },
      onError: (error) => {
        console.error(error);
        toast.error(t("error"));
      },
    },
  );

  const { trigger: deleteLike } = useDeleteMutation(
    supabase.from("t_like"),
    ["clothes_id", "user_id"],
    "*",
    {
      onSuccess: async (data) => {
        // @ts-expect-error
        await mutate((prev) => {
          if (!prev) {
            return;
          }

          const next = R.pipe(
            prev,
            R.flat(),
            R.map((clothes) =>
              clothes.id === data?.clothes_id
                ? {
                    ...clothes,
                    like: [{ count: 0 }],
                  }
                : clothes,
            ),
          );

          return next;
        });

        await revalidateTables();
      },
      onError: () => {
        toast.error(t("error"));
      },
    },
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
                <View w={200} h={200} rounded="$full" bg="$mutedBackground">
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    source={require("../../../../assets/images/empty.png")}
                    transition={200}
                  />
                </View>
                <YStack items="center" gap="$4">
                  <H1 fontWeight="$bold" fontSize="$xl">
                    {t("empty.title")}
                  </H1>
                  <Text
                    text="center"
                    fontSize="$sm"
                    lineHeight="$sm"
                    color="$mutedColor"
                  >
                    {t("empty.description")}
                  </Text>
                </YStack>
              </YStack>
            )}
            renderItem={({ item, index }) => {
              const isLiked = item.like?.[0]?.count > 0;

              return (
                <View
                  pt={index > 1 ? 16 : 0}
                  pl={index % 2 === 1 ? 8 : 0}
                  pr={index % 2 === 0 ? 8 : 0}
                >
                  <ClothesItem
                    id={item.id}
                    isLiked={isLiked}
                    insertLike={async () => {
                      await insertLike([
                        {
                          id: Crypto.randomUUID(),
                          clothes_id: item.id,
                          user_id: session?.user.id ?? "",
                        },
                      ]);
                    }}
                    deleteLike={async () => {
                      await deleteLike({
                        clothes_id: item.id,
                        user_id: session?.user.id ?? "",
                      });
                    }}
                  />
                </View>
              );
            }}
          />
        )}
      </YStack>
    </>
  );
});

export default DiscoverPage;
