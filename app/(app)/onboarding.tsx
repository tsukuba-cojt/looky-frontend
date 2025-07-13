import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, useWindowDimensions } from "react-native";
import { SlidingDot } from "react-native-animated-pagination-dots";
import PagerView, {
  type PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { H1, Text, useTheme, YStack } from "tamagui";
import { Button } from "@/components/Button";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const OnboardingPage = () => {
  const { t } = useTranslation("onboarding");
  const router = useRouter();
  const { width } = useWindowDimensions();
  const ref = useRef<PagerView>(null);
  const theme = useTheme();
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;

  const data = useMemo(
    () => [
      {
        key: "1",
        title: t("tab1.title"),
        description: t("tab1.description"),
        icon: require("../../assets/images/onboarding1.png"),
      },
      {
        key: "2",
        title: t("tab2.title"),
        description: t("tab2.description"),
        icon: require("../../assets/images/onboarding2.png"),
      },
      {
        key: "3",
        title: t("tab3.title"),
        description: t("tab3.description"),
        icon: require("../../assets/images/onboarding3.png"),
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

  const onNextPage = useCallback(() => {
    if (currentIndex + 1 < data.length) {
      ref.current?.setPage(currentIndex + 1);
    } else {
      router.push("/setup");
    }
  }, [data, router, currentIndex]);

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
        {data.map(({ key, title, description, icon }) => {
          return (
            <YStack key={key} flex={1} items="center" pt="$24" gap="$12">
              <Image
                style={{ width: 300, height: 300 }}
                source={icon}
                transition={200}
              />
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

      <YStack w="100%" gap="$4" px="$8">
        <Button variant="primary" onPress={onNextPage}>
          <Button.Text>
            {currentIndex === data.length - 1 ? t("get_started") : t("next")}
          </Button.Text>
        </Button>
        <Link href="/setup" asChild>
          <Button variant="ghost">
            <Button.Text>{t("skip")}</Button.Text>
          </Button>
        </Link>
      </YStack>
    </SafeAreaView>
  );
};

export default OnboardingPage;
