import { FlashList } from "@shopify/flash-list";
import { useCursorInfiniteScrollQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useFileUrl } from "@supabase-cache-helpers/storage-swr";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { H1, Spinner, Text, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import { categories } from "@/constants";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";
import type { Category, Vton } from "@/types";

interface VtonItemProps {
  vton: Pick<Vton, "id" | "tops_id" | "bottoms_id" | "dresses_id">;
}

const VtonItem = memo(({ vton }: VtonItemProps) => {
  const session = useSessionStore((state) => state.session);

  const { data: url, isLoading } = useFileUrl(
    supabase.storage.from("vton"),
    `${session?.user.id}/${vton.id}.jpg`,
    "private",
    {
      ensureExistence: true,
      expiresIn: 3600,
    },
  );

  if (isLoading) {
    return (
      <Skeleton w="100%" aspectRatio={3 / 4} rounded="$2xl" boxShadow="$sm" />
    );
  }

  return (
    <Link
      href={{
        pathname: "/details/[id]",
        params: { id: vton.tops_id || vton.bottoms_id || vton.dresses_id },
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
            source={url}
            transition={200}
          />
        </View>
      </TouchableOpacity>
    </Link>
  );
});

const VtonPage = memo(() => {
  const { t } = useTranslation(["common", "collections"]);
  const session = useSessionStore((state) => state.session);
  const [category, setCategory] = useState<Category>("tops");

  const { data, loadMore, isLoading, isValidating } =
    useCursorInfiniteScrollQuery(
      () =>
        supabase
          .from("t_user_vton")
          .select(`
          id,
          vton: t_vton (id, tops_id, bottoms_id, dresses_id)
        `)
          .eq("user_id", session?.user.id ?? "")
          .eq("feedback", "like")
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .limit(12),
      {
        orderBy: "id",
        uqOrderBy: "id",
      },
    );

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
          data={data}
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
                  {t("collections:vton.empty.title")}
                </H1>
                <Text
                  text="center"
                  fontSize="$sm"
                  lineHeight="$sm"
                  color="$mutedColor"
                >
                  {t("collections:vton.empty.description")}
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
              <VtonItem vton={item.vton} />
            </View>
          )}
        />
      )}
    </YStack>
  );
});

export default VtonPage;
