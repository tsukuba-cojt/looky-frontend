import { useIsFocused } from "@react-navigation/native";
import { RotateCcw, ThumbsDown, ThumbsUp } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import {
  createRef,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { Portal, View, XStack } from "tamagui";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import {
  type SwipableCardRef,
  SwipeableCard,
} from "@/components/SwipeableCard";

const data = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/1200/800?random=${i + 1}`,
}));

interface SwipableCardItemProps {
  url: string;
}

const SwipableCardItem = ({ url }: SwipableCardItemProps) => {
  return (
    <View
      overflow="hidden"
      rounded="$radius.3xl"
      position="relative"
      bg="$background"
      boxShadow="$sm"
    >
      <View position="absolute" inset={0} bg="$background" />
      <Skeleton position="absolute" inset={0} />
      <Image
        style={{ width: "100%", height: "100%" }}
        source={url}
        contentFit="cover"
        transition={200}
      />
    </View>
  );
};

const TryOnPage = () => {
  const ref = useRef<SwipableCardRef>(null);
  const onEndReachedThreadhold = 0.4;
  const activeIndex = useSharedValue(0);
  const length = useRef(data.length);
  const focused = useIsFocused();

  useEffect(() => {
    length.current = data.length;
  }, []);

  const refs = useMemo(() => {
    const tmp: RefObject<SwipableCardRef | null>[] = [];
    for (let i = 0; i < data.length; i++) {
      tmp.push(createRef<SwipableCardRef>());
    }
    return tmp;
  }, []);

  const worklet = useCallback(() => {
    "worklet";
    if (activeIndex.value < length.current) {
      activeIndex.value++;
    }
  }, [activeIndex]);

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

  useImperativeHandle(ref, () => {
    return {
      swipeLeft,
      swipeRight,
      swipeBack,
      swipeTop,
      swipeBottom,
    };
  }, [swipeLeft, swipeRight, swipeBack, swipeTop, swipeBottom]);

  const onEndReached = useCallback(() => {}, []);

  useAnimatedReaction(
    () =>
      activeIndex.value >=
      length.current - onEndReachedThreadhold * length.current,
    (isEndReached: boolean) => {
      if (isEndReached && onEndReached) {
        runOnJS(onEndReached)();
      }
    },
    [data],
  );

  return (
    <Portal opacity={focused ? 1 : 0}>
      <View flex={1} items="center" justify="center" pt="$6" px="$6" gap="$6">
        <View aspectRatio={3 / 4} w="100%">
          {data
            .map((item, index) => {
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
                  onSwipeRight={() => {
                    console.log("right");
                  }}
                  onSwipeLeft={() => {
                    console.log("left");
                  }}
                  onSwipeTop={() => {
                    console.log("top");
                  }}
                  onSwipeBottom={() => {
                    console.log("bottom");
                  }}
                >
                  <SwipableCardItem url={item.url} />
                </SwipeableCard>
              );
            })
            .reverse()}
        </View>
        <XStack
          gap="$10"
          borderWidth={1}
          borderColor="$borderColor"
          px="$8"
          py="$4"
          bg="$background"
          rounded="$full"
        >
          <Button
            variant="ghost"
            size="icon"
            w="$6"
            h="$6"
            onPress={swipeRight}
          >
            <Button.Icon>
              <ThumbsUp size="$6" />
            </Button.Icon>
          </Button>
          <Button variant="ghost" size="icon" w="$6" h="$6" onPress={swipeLeft}>
            <Button.Icon>
              <ThumbsDown size="$6" />
            </Button.Icon>
          </Button>
          <Button variant="ghost" size="icon" w="$6" h="$6" onPress={swipeBack}>
            <Button.Icon>
              <RotateCcw size="$6" />
            </Button.Icon>
          </Button>
        </XStack>
      </View>
    </Portal>
  );
};

export default TryOnPage;
