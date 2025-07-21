import {
  useInsertMutation,
  useQuery,
  useSubscription,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { useFileUrl } from "@supabase-cache-helpers/storage-swr";
import * as Crypto from "expo-crypto";
import { Image } from "expo-image";
import { Link, useFocusEffect } from "expo-router";
import LottieView from "lottie-react-native";
import {
  createRef,
  memo,
  type RefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import * as R from "remeda";
import { toast } from "sonner-native";
import {
  AnimatePresence,
  H1,
  Portal,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { Skeleton } from "@/components/Skeleton";
import {
  type SwipableCardRef,
  SwipeableCard,
} from "@/components/SwipeableCard";
import { supabase } from "@/lib/client";
import { wait } from "@/lib/utilts";
import { useSessionStore } from "@/stores/useSessionStore";
import type { Vton } from "@/types";

interface SwipableCardItemProps {
  vton: Pick<Vton, "id" | "tops_id" | "bottoms_id" | "dress_id">;
}

const SwipableCardItem = ({ vton }: SwipableCardItemProps) => {
  const session = useSessionStore((state) => state.session);

  const { data: url } = useFileUrl(
    supabase.storage.from("vton"),
    `${session?.user.id}/${vton.id}.jpg`,
    "private",
    {
      ensureExistence: true,
      expiresIn: 3600,
    },
  );

  return (
    <View position="relative" overflow="hidden" rounded="$3xl" boxShadow="$sm">
      <View position="absolute" inset={0} bg="$mutedBackground" />
      <Skeleton position="absolute" inset={0} />
      <Link
        href={{
          pathname: "/details/[id]",
          params: { id: vton.tops_id || vton.bottoms_id || vton.dress_id },
        }}
        asChild
      >
        <TouchableOpacity activeOpacity={0.6}>
          <Image
            style={{ width: "100%", height: "100%" }}
            source={url}
            transition={200}
          />
        </TouchableOpacity>
      </Link>
    </View>
  );
};

type Item = {
  id: string;
  vton: Pick<Vton, "id" | "tops_id" | "bottoms_id" | "dress_id">;
};

const TryOnPage = memo(() => {
  const { t } = useTranslation("try_on");
  const { height } = useWindowDimensions();
  const session = useSessionStore((state) => state.session);
  const [items, setItems] = useState<Item[]>([]);
  const [isVisible, setIsVisble] = useState(false);

  const { mutate } = useQuery(
    supabase
      .from("t_user_vton")
      .select(`
          id,
          vton: t_vton (id,tops_id,bottoms_id,dress_id)
        `)
      .eq("user_id", session?.user.id ?? "")
      .is("feedback", null)
      .order("created_at", { ascending: true })
      .limit(3),
    {
      onSuccess: ({ data }) => {
        if (!data) {
          return;
        }

        setItems((prev) => {
          const next = R.pipe(
            R.differenceWith(data, prev, (a, b) => a.id === b.id),
            R.map((item) => ({
              id: item.id,
              vton: item.vton,
            })),
          );

          return [...prev, ...next];
        });
      },
    },
  );

  const { trigger: insertTask } = useInsertMutation(
    supabase.from("t_task"),
    ["id"],
    "*",
    {
      onError: () => {
        toast.error(t("error"));
      },
    },
  );

  const { trigger: updateFeedback } = useUpdateMutation(
    supabase.from("t_user_vton"),
    ["id"],
    "*",
    {
      onError: () => {
        toast.error(t("error"));
      },
    },
  );

  useSubscription(
    supabase,
    "task",
    {
      event: "*",
      table: "t_task",
      schema: "public",
      filter: `user_id=eq.${session?.user.id}`,
    },
    ["id"],
    {
      callback: async (payload) => {
        if (payload.eventType === "UPDATE") {
          if (payload.new.status === "success") {
            await mutate();
          }

          if (payload.new.status === "error") {
          }
        }
      },
    },
  );

  const ref = useRef<SwipableCardRef>(null);
  const animation = useRef<LottieView>(null);
  const activeIndex = useSharedValue(0);

  const length = useMemo(() => items.length + 1, [items]);

  const refs = useMemo(() => {
    const tmp: RefObject<SwipableCardRef | null>[] = [];
    for (let i = 0; i < length; i++) {
      tmp.push(createRef<SwipableCardRef>());
    }
    return tmp;
  }, [length]);

  const worklet = useCallback(() => {
    "worklet";

    if (activeIndex.value < length) {
      activeIndex.value++;
    }
  }, [activeIndex, length]);

  const swipeRight = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex].current?.swipeRight();
    worklet();
  }, [refs, worklet, activeIndex]);

  const swipeTop = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex].current?.swipeTop();
    worklet();
  }, [refs, worklet, activeIndex]);

  const swipeLeft = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex].current?.swipeLeft();
    worklet();
  }, [refs, worklet, activeIndex]);

  const swipeBottom = useCallback(() => {
    const currentIndex = Math.floor(activeIndex.value);
    if (!refs[currentIndex]) {
      return;
    }
    refs[currentIndex].current?.swipeBottom();
    worklet();
  }, [refs, worklet, activeIndex]);

  const swipeBack = useCallback(() => {
    if (activeIndex.value < 1) {
      return;
    }

    if (refs[activeIndex.value - 1]) {
      refs[activeIndex.value - 1].current?.swipeBack();
      activeIndex.value = activeIndex.value - 1;
    }
  }, [activeIndex, refs]);

  const onSwipeRight = useCallback(
    async (id: string) => {
      await updateFeedback({ id, feedback: "like" });
      await insertTask([
        {
          id: Crypto.randomUUID(),
          user_id: session?.user.id ?? "",
          status: "pending",
          part: "Upper-body",
        },
      ]);
    },
    [insertTask, session, updateFeedback],
  );

  const onSwipeTop = useCallback(
    async (id: string) => {
      await updateFeedback({ id, feedback: "love" });
      await insertTask([
        {
          id: Crypto.randomUUID(),
          user_id: session?.user.id ?? "",
          status: "pending",
          part: "Upper-body",
        },
      ]);
    },
    [insertTask, session, updateFeedback],
  );

  const onSwipeLeft = useCallback(
    async (id: string) => {
      await updateFeedback({ id, feedback: "nope" });
      await insertTask([
        {
          id: Crypto.randomUUID(),
          user_id: session?.user.id ?? "",
          status: "pending",
          part: "Upper-body",
        },
      ]);
    },
    [insertTask, session, updateFeedback],
  );

  const onSwipeBottom = useCallback(
    async (id: string) => {
      await updateFeedback({ id, feedback: "hate" });
      await insertTask([
        {
          id: Crypto.randomUUID(),
          user_id: session?.user.id ?? "",
          status: "pending",
          part: "Upper-body",
        },
      ]);
    },
    [insertTask, session, updateFeedback],
  );

  const onSwipeBack = useCallback(
    async (id: string) => {
      await updateFeedback({ id, feedback: null });
    },
    [updateFeedback],
  );

  useImperativeHandle(ref, () => {
    return {
      swipeLeft,
      swipeRight,
      swipeBack,
      swipeTop,
      swipeBottom,
    };
  }, [swipeLeft, swipeRight, swipeBack, swipeTop, swipeBottom]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await wait(0.2);
        setIsVisble(true);
      })();

      return () => {
        setIsVisble(false);
      };
    }, []),
  );

  return (
    <AnimatePresence>
      <Portal
        y={isVisible ? 0 : height}
        animation="quick"
        animateOnly={["opacity"]}
        opacity={isVisible ? 1 : 0}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      >
        <View
          position="relative"
          flex={1}
          items="center"
          justify="center"
          pt="$6"
          px="$6"
          gap="$6"
        >
          <View aspectRatio={3 / 4} w="100%">
            {items.map((item, index) => {
              return (
                <SwipeableCard
                  key={index.toString()}
                  cardStyle={{
                    width: "100%",
                    height: "100%",
                  }}
                  index={index}
                  activeIndex={activeIndex}
                  ref={refs[index]}
                  onSwipeRight={() => onSwipeRight(item.id)}
                  onSwipeLeft={() => onSwipeLeft(item.id)}
                  onSwipeTop={() => onSwipeTop(item.id)}
                  onSwipeBottom={() => onSwipeBottom(item.id)}
                  onSwipeBack={() => onSwipeBack(item.id)}
                >
                  <SwipableCardItem vton={item.vton} />
                </SwipeableCard>
              );
            })}
            <SwipeableCard
              cardStyle={{
                width: "100%",
                height: "100%",
              }}
              disabled
              index={items.length}
              activeIndex={activeIndex}
              ref={refs[items.length]}
            >
              <YStack
                flex={1}
                items="center"
                justify="center"
                borderWidth={1}
                borderColor="$borderColor"
                rounded="$3xl"
                boxShadow="$sm"
                gap="$6"
              >
                <YStack>
                  <View w={200} h={200} rounded="$full" bg="$mutedBackground">
                    <LottieView
                      autoPlay
                      ref={animation}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      source={require("../../../assets/loading.json")}
                    />
                  </View>
                </YStack>
                <YStack items="center" gap="$4">
                  <H1 fontWeight="$bold" fontSize="$3xl">
                    {t("loading.title")}
                  </H1>
                  <Text text="center" fontSize="$sm" lineHeight="$sm">
                    {t("loading.description")}
                  </Text>
                </YStack>
              </YStack>
            </SwipeableCard>
          </View>
          <XStack
            gap="$6"
            borderWidth={1}
            borderColor="$borderColor"
            px="$6"
            py="$2"
            bg="$background"
            rounded="$full"
          >
            <Button
              variant="ghost"
              size="icon"
              w="$12"
              h="$12"
              circular
              onPress={swipeRight}
            >
              <Button.Icon>
                <Icons.thumbsUp size="$6" />
              </Button.Icon>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              w="$12"
              h="$12"
              circular
              onPress={swipeLeft}
            >
              <Button.Icon>
                <Icons.thumbsDown size="$6" />
              </Button.Icon>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              w="$12"
              h="$12"
              circular
              onPress={swipeBack}
            >
              <Button.Icon>
                <Icons.rotateCcw size="$6" />
              </Button.Icon>
            </Button>
          </XStack>
        </View>
      </Portal>
    </AnimatePresence>
  );
});

export default TryOnPage;
