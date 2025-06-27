import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, SafeAreaView, useWindowDimensions } from "react-native";
import { SlidingDot } from "react-native-animated-pagination-dots";
import PagerView, {
  type PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import { H1, Text, useTheme, View, YStack } from "tamagui";
import Onboarding1 from "@/assets/images/onboarding1.svg";
import Onboarding2 from "@/assets/images/onboarding2.svg";
import Onboarding3 from "@/assets/images/onboarding3.svg";
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
        image: Onboarding1,
      },
      {
        key: "2",
        title: t("tab2.title"),
        description: t("tab2.description"),
        image: Onboarding2,
      },
      {
        key: "3",
        title: t("tab3.title"),
        description: t("tab3.description"),
        image: Onboarding3,
      },
    ],
    [t],
  );

  const inputRange = [0, data.length];
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

  const onNextPage = () => {
    if (currentIndex + 1 < data.length) {
      ref.current?.setPage(currentIndex + 1);
    } else {
      router.push("/(app)/setup/body");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AnimatedPagerView
        initialPage={0}
        ref={ref}
        style={{ flex: 1 }}
        onPageScroll={onPageScroll}
        onPageSelected={(e) => {
          setCurrentIndex(e.nativeEvent.position);
        }}
      >
        {data.map(({ key, title, description, image }) => {
          const Icon = image;

          return (
            <YStack key={key} flex={1} items="center" pt="$36" gap="$16">
              <Icon width={320} height={320} />
              <YStack gap="$6" items="center" justify="center">
                <H1 fontSize="$2xl" fontWeight="$bold">
                  {title}
                </H1>
                <Text text="center">{description}</Text>
              </YStack>
            </YStack>
          );
        })}
      </AnimatedPagerView>
      <View>
        <YStack position="absolute" b="$10" w="100%" px="$12">
          <SlidingDot
            data={data}
            //@ts-ignore
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
            containerStyle={{
              position: "absolute",
              top: -30,
            }}
          />
          <Button variant="primary" rounded="$radius.full" onPress={onNextPage}>
            <Button.Text>
              {currentIndex === data.length - 1 ? t("get_started") : t("next")}
            </Button.Text>
          </Button>
        </YStack>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingPage;
