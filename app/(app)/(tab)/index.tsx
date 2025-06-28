import { useIsFocused } from "@react-navigation/native";
import { RotateCcw, ThumbsDown, ThumbsUp } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  createRef,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
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
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View
      overflow="hidden"
      rounded="$radius.3xl"
      position="relative"
      bg="$background"
      boxShadow="$sm"
    >
      <Image
        style={{ width: "100%", height: "100%" }}
        source={url}
        contentFit="cover"
        transition={200}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading ? (
        <>
          <View position="absolute" inset={0} bg="$background" z="$20" />
          <Skeleton position="absolute" inset={0} z="$20" />
        </>
      ) : (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          locations={[0, 1]}
          start={{ x: 0, y: 0.6 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: "absolute",
            inset: 0,
          }}
          pointerEvents="none"
        />
      )}
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

  const onEndReacted = useCallback(() => {}, []);

  useAnimatedReaction(
    () =>
      activeIndex.value >=
      length.current - onEndReachedThreadhold * length.current,
    (isEndReaced: boolean) => {
      if (isEndReaced && onEndReacted) {
        runOnJS(onEndReacted)();
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
        <XStack gap="$8">
          <Button variant="outline" size="icon" h="$14" w="$14" rounded="$full">
            <ThumbsUp size="$6" />
          </Button>
          <Button variant="outline" size="icon" h="$14" w="$14" rounded="$full">
            <ThumbsDown size="$6" />
          </Button>
          <Button variant="outline" size="icon" h="$14" w="$14" rounded="$full">
            <RotateCcw size="$6" />
          </Button>
        </XStack>
      </View>
    </Portal>
  );
};

export default TryOnPage;
