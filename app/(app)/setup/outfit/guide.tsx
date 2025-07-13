import { useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, useWindowDimensions } from "react-native";
import { SlidingDot } from "react-native-animated-pagination-dots";
import PagerView, {
  type PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { H1, Text, useTheme, YStack } from "tamagui";
import { Button } from "@/components/Button";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const icons = [
  require("../../../../assets/images/guide3.png"),
  require("../../../../assets/images/guide4.png"),
  require("../../../../assets/images/guide5.png"),
];

const GuidePage = memo(() => {
  const { t } = useTranslation("setup");
  const router = useRouter();
  const { width } = useWindowDimensions();
  const ref = useRef<PagerView>(null);
  const theme = useTheme();
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;
  const [permission, requestPermission] = useCameraPermissions();

  const data = useMemo(
    () => [
      {
        key: "1",
        title: t("outfit.guide.tab1.title"),
        description: t("outfit.guide.tab1.description"),
        icon: require("../../../../assets/images/guide1.png"),
      },
      {
        key: "2",
        title: t("outfit.guide.tab2.title"),
        description: t("outfit.guide.tab2.description"),
        icon: require("../../../../assets/images/guide2.png"),
      },
      {
        key: "3",
        title: t("outfit.guide.tab3.title"),
        description: t("outfit.guide.tab3.description"),
        icon: icons[0],
      },
    ],
    [t],
  );

  const inputRange = useMemo(() => [0, data.length], [data]);
  const scrollX = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, data.length * width],
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prev) => (prev + 1) % icons.length);
    }, 2000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      setProgress(0);
    };
  }, []);

  const onPageScroll = useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>(
        [
          {
            nativeEvent: {
              offset: scrollOffsetAnimatedValue,
              position: positionAnimatedValue,
            },
          },
        ],
        { useNativeDriver: false },
      ),
    [scrollOffsetAnimatedValue, positionAnimatedValue],
  );

  const onNextPage = useCallback(async () => {
    if (currentIndex + 1 < data.length) {
      ref.current?.setPage(currentIndex + 1);
    } else {
      if (permission?.granted) {
        router.push({
          pathname: "/camera",
          params: {
            from: "/setup/outfit/gallery",
          },
        });
      } else {
        const { status } = await requestPermission();

        if (status === "granted") {
          router.push({
            pathname: "/camera",
            params: {
              from: "/setup/outfit/gallery",
            },
          });
        } else {
          toast.error(t("outfit.guide.error"));
        }
      }
    }
  }, [
    currentIndex,
    data,
    permission,
    requestPermission,
    router.push,
    router,
    t,
  ]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
      <AnimatedPagerView
        initialPage={0}
        ref={ref}
        style={{ flex: 1 }}
        onPageScroll={onPageScroll}
        onPageSelected={(e) => {
          setCurrentIndex(e.nativeEvent.position);
        }}
      >
        {data.map(({ key, title, description, icon }, index) => {
          return (
            <YStack key={key} flex={1} items="center" pt="$12" gap="$12">
              <YStack gap="$6">
                <H1 text="center" fontSize="$2xl" fontWeight="$bold">
                  {t("outfit.guide.tips")}
                </H1>
                <Image
                  style={{ width: 300, height: 300 }}
                  source={index === 2 ? icons[progress] : icon}
                  transition={200}
                />
              </YStack>
              <YStack gap="$6">
                <H1 text="center" fontSize="$2xl" fontWeight="$bold">
                  {title}
                </H1>
                <Text text="center" color="$mutedColor">
                  {description}
                </Text>
              </YStack>
            </YStack>
          );
        })}
      </AnimatedPagerView>

      <YStack position="absolute" b="$32" w="100%">
        <SlidingDot
          data={data}
          //@ts-expect-error
          scrollX={scrollX}
          dotSize={8}
          marginHorizontal={4}
          dotStyle={{
            backgroundColor: theme.mutedColor.val,
            opacity: 0.2,
          }}
          slidingIndicatorStyle={{
            backgroundColor: theme.primaryBackground.val,
          }}
        />
      </YStack>

      <YStack w="100%" gap="$3" px="$8">
        <Button variant="primary" onPress={onNextPage}>
          <Button.Text>
            {currentIndex === data.length - 1
              ? t("outfit.guide.get_started")
              : t("outfit.guide.next")}
          </Button.Text>
        </Button>
        <Link
          href={{
            pathname: "/camera",
            params: {
              from: "/setup/outfit/gallery",
            },
          }}
          asChild
        >
          <Button variant="ghost">
            <Button.Text>{t("outfit.guide.skip")}</Button.Text>
          </Button>
        </Link>
      </YStack>
    </SafeAreaView>
  );
});

export default GuidePage;
