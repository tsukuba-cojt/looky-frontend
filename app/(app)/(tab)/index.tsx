import { useIsFocused } from "@react-navigation/native";
import {
  useInsertMutation,
  useQuery,
  useSubscription,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { Link } from "expo-router";
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
import { TouchableOpacity } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { toast } from "sonner-native";
import { AnimatePresence, Portal, View, XStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { Skeleton } from "@/components/Skeleton";
import {
  type SwipableCardRef,
  SwipeableCard,
} from "@/components/SwipeableCard";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";
import type { Vton } from "@/types";

interface SwipableCardItemProps {
  id: number;
  url: string;
}

const SwipableCardItem = memo(({ id, url }: SwipableCardItemProps) => {
  return (
    <View position="relative" overflow="hidden" rounded="$3xl" boxShadow="$sm">
      <View position="absolute" inset={0} bg="$mutedBackground" />
      <Skeleton position="absolute" inset={0} />
      <Link
        href={{
          pathname: "/details/[id]",
          params: { id },
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
});

const TryOnPage = memo(() => {
  const { t } = useTranslation("try_on");
  const session = useSessionStore((state) => state.session);
  const [items, setItems] = useState<
    { id: number; vton: Pick<Vton, "object_key" | "tops_id"> }[]
  >([]);

  const { mutate } = useQuery(
    supabase
      .from("t_user_vton")
      .select(`
          id,
          vton: t_vton (object_key,tops_id)
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
          const ids = new Set(prev.map((item) => item.id));
          const next = data
            .filter((item) => !ids.has(item.id))
            .map((item) => ({
              id: item.id,
              vton: item.vton as NonNullable<typeof item.vton>,
            }));

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
        }
      },
    },
  );

  const ref = useRef<SwipableCardRef>(null);
  const activeIndex = useSharedValue(0);
  const focused = useIsFocused();

  const length = useMemo(() => items.length, [items]);

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
    const prevIndex = activeIndex.value - 1;

    if (prevIndex < 0 || !refs[prevIndex]) {
      return;
    }

    if (refs[prevIndex]) {
      refs[prevIndex].current?.swipeBack();
      activeIndex.value = prevIndex;
    }
  }, [activeIndex, refs]);

  const onSwipeRight = useCallback(
    async (id: number) => {
      await updateFeedback({ id, feedback: "like" });
      await insertTask([
        {
          user_id: session?.user.id ?? "",
          status: "pending",
        },
      ]);
    },
    [insertTask, session, updateFeedback],
  );

  const onSwipeTop = useCallback(
    async (id: number) => {
      await updateFeedback({ id, feedback: "love" });
      await insertTask([
        {
          user_id: session?.user.id ?? "",
          status: "pending",
        },
      ]);
    },
    [insertTask, session, updateFeedback],
  );

  const onSwipeLeft = useCallback(
    async (id: number) => {
      await updateFeedback({ id, feedback: "nope" });
      await insertTask([
        {
          user_id: session?.user.id ?? "",
          status: "pending",
        },
      ]);
    },
    [insertTask, session, updateFeedback],
  );

  const onSwipeBottom = useCallback(
    async (id: number) => {
      await updateFeedback({ id, feedback: "hate" });
      await insertTask([
        {
          user_id: session?.user.id ?? "",
          status: "pending",
        },
      ]);
    },
    [insertTask, session, updateFeedback],
  );

  const onSwipeBack = useCallback(
    async (id: number) => {
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

  return (
    <AnimatePresence>
      <Portal
        opacity={focused ? 1 : 0}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      >
        <View flex={1} items="center" justify="center" pt="$6" px="$6" gap="$6">
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
                  <SwipableCardItem
                    id={item.vton.tops_id}
                    url={`https://picsum.photos/1200/900?id=${item.id}`}
                  />
                </SwipeableCard>
              );
            })}
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
