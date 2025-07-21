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
import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import * as R from "remeda";
import { toast } from "sonner-native";
import { Spinner, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { CategorySelectSheet } from "@/components/CategorySelectSheet";
import { ColorPickerSheet } from "@/components/ColorPickerSheet/ColorPickerSheet";
import { GenderSelectSheet } from "@/components/GenderSelectSheet";
import { Heart } from "@/components/Heart";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/Input";
import { Skeleton } from "@/components/Skeleton";
import { useSheet } from "@/hooks/useSheet";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";
import type { Category, Color, Gender } from "@/types";

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
      `${id}.jpg`,
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
  const [gender, setGender] = useState<Gender>();
  const [category, setCategory] = useState<Category>();
  const [color, setColor] = useState<Color>();

  const { open, getSheetProps } = useSheet();

  const { data, loadMore, isLoading, isValidating, mutate } =
    useCursorInfiniteScrollQuery(
      () =>
        supabase
          .from("t_clothes")
          .select(`
            id,
            like: t_like (count)
          `)
          .eq("like.user_id", session?.user.id ?? "")
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .limit(12),
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
      onError: () => {
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
          <XStack gap="$2">
            <Button
              variant="outline"
              h="auto"
              px="$3"
              py="$1.5"
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
              h="auto"
              px="$3"
              py="$1.5"
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
              h="auto"
              px="$3"
              py="$1.5"
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
