import { createId } from "@paralleldrive/cuid2";
import { FlashList } from "@shopify/flash-list";
import { useCursorInfiniteScrollQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Link, useRouter } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useMMKVString } from "react-native-mmkv";
import Reanimated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import * as R from "remeda";
import { getFontSize, Spinner, Text, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/Input";
import { Skeleton } from "@/components/Skeleton";
import { supabase } from "@/lib/client";
import { storage } from "@/lib/storage";
import type { History } from "@/types";

interface RightActionProps {
  drag: SharedValue<number>;
  onDelete: () => void;
}

const RightAction = memo(({ drag, onDelete }: RightActionProps) => {
  const { t } = useTranslation("discover");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 16 * 4 }],
    };
  });

  return (
    <Reanimated.View style={animatedStyle}>
      <TouchableOpacity onPress={onDelete} activeOpacity={0.6}>
        <View
          w="$16"
          h="100%"
          items="center"
          justify="center"
          bg="$destructiveBackground"
        >
          <Text color="$destructiveColor" fontWeight="$medium">
            {t("delete")}
          </Text>
        </View>
      </TouchableOpacity>
    </Reanimated.View>
  );
});

const SearchPage = memo(() => {
  const { t } = useTranslation("discover");
  const router = useRouter();
  const [history, setHistory] = useMMKVString("history", storage);
  const [query, setQuery] = useState("");

  const { data, loadMore, isLoading, isValidating, mutate } =
    useCursorInfiniteScrollQuery(
      () =>
        supabase
          .from("t_clothes")
          .select("id,name")
          .ilike("name", `%${query}%`)
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .limit(10),
      { orderBy: "id", uqOrderBy: "id" },
    );

  const onSearch = useCallback(
    (text: string) => {
      setHistory((prev) => {
        if (!prev) {
          return "[]";
        }

        const history = JSON.parse(prev) as History[];
        const next = [
          { id: createId(), text, createdAt: Date.now() },
          ...history,
        ].slice(0, 30);

        return JSON.stringify(next);
      });
    },
    [setHistory],
  );

  const onDelete = useCallback(
    (id: string) => {
      setHistory((prev) => {
        if (!prev) {
          return "[]";
        }

        const history = JSON.parse(prev) as History[];
        const next = history.filter((item) => id !== item.id);

        return JSON.stringify(next);
      });
    },
    [setHistory],
  );

  const isRefreshing = !isLoading && isValidating;

  const debouncer = useMemo(
    () => R.funnel(() => mutate(), { minQuietPeriodMs: 2000 }),
    [mutate],
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} pt="$4" gap="$8">
        <XStack px="$6" items="center" gap="$2">
          <Button variant="ghost" w="$9" h="$9" circular onPress={router.back}>
            <Button.Icon>
              <Icons.chevronLeft size="$6" />
            </Button.Icon>
          </Button>
          <XStack position="relative" items="center" shrink={1}>
            <Input
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                debouncer.call();
              }}
              returnKeyType="search"
              autoFocus
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
          <Link href="/discover/filter" asChild>
            <Button variant="ghost" w="$9" h="$9" circular>
              <Button.Icon>
                <Icons.slidersHorizontal size="$5" />
              </Button.Icon>
            </Button>
          </Link>
        </XStack>
        <YStack flex={1}>
          {isLoading ? (
            <FlashList
              data={Array.from({ length: 6 })}
              estimatedItemSize={64}
              renderItem={() => (
                <XStack
                  w="100%"
                  h="$14"
                  px="$8"
                  items="center"
                  justify="space-between"
                >
                  <Skeleton w="$32" h={getFontSize("$lg")} />
                  <Skeleton w="$5" h="$5" />
                </XStack>
              )}
            />
          ) : query ? (
            <FlashList
              data={data}
              estimatedItemSize={64}
              onEndReached={loadMore}
              ListEmptyComponent={() =>
                !isRefreshing && (
                  <View pt="$4">
                    <Text text="center" color="$mutedColor">
                      {t("empty_placeholder")}
                    </Text>
                  </View>
                )
              }
              ListFooterComponent={() =>
                isRefreshing && (
                  <View pt="$4" justify="center">
                    <Spinner color="$mutedColor" />
                  </View>
                )
              }
              renderItem={({ item }) => (
                <Link href={`/discover/${item.id}`} asChild>
                  <Button
                    variant="ghost"
                    h="$14"
                    px="$8"
                    onPress={() => {
                      if (item.name) {
                        onSearch(item.name);
                      }
                    }}
                  >
                    <XStack w="100%" items="center" justify="space-between">
                      <XStack items="center" gap="$3">
                        <Button.Icon>
                          <View p="$2" rounded="$full" bg="$mutedBackground">
                            <Icons.search size="$4" />
                          </View>
                        </Button.Icon>
                        <Text fontSize="$lg">{item.name}</Text>
                      </XStack>
                      <Button.Icon>
                        <Icons.chevronRight size="$5" color="$mutedColor" />
                      </Button.Icon>
                    </XStack>
                  </Button>
                </Link>
              )}
            />
          ) : (
            <YStack flex={1} gap="$4">
              <XStack px="$8" items="center" justify="space-between">
                <Text fontWeight="$bold">{t("history")}</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setHistory("[]")}
                >
                  <Text color="$mutedColor">{t("clear")}</Text>
                </TouchableOpacity>
              </XStack>
              <FlashList
                data={JSON.parse(history || "[]") as History[]}
                estimatedItemSize={64}
                ListEmptyComponent={() =>
                  !isRefreshing && (
                    <View pt="$4">
                      <Text text="center" color="$mutedColor">
                        {t("empty_placeholder")}
                      </Text>
                    </View>
                  )
                }
                renderItem={({ item }) => (
                  <Swipeable
                    friction={2}
                    renderRightActions={(_prog, drag) => (
                      <RightAction
                        drag={drag}
                        onDelete={() => onDelete(item.id)}
                      />
                    )}
                  >
                    <Button variant="ghost" h="$14" px="$8">
                      <XStack w="100%" items="center" justify="space-between">
                        <XStack items="center" gap="$3">
                          <Button.Icon>
                            <View p="$2" rounded="$full" bg="$mutedBackground">
                              <Icons.clock size="$4" />
                            </View>
                          </Button.Icon>
                          <Text fontSize="$lg">{item.text}</Text>
                        </XStack>
                        <Button.Icon>
                          <Icons.chevronRight size="$5" color="$mutedColor" />
                        </Button.Icon>
                      </XStack>
                    </Button>
                  </Swipeable>
                )}
              />
            </YStack>
          )}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
});

export default SearchPage;
