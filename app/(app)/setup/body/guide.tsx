import { useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, SafeAreaView, useWindowDimensions } from "react-native";
import { SlidingDot } from "react-native-animated-pagination-dots";
import PagerView, {
  type PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import { toast } from "sonner-native";
import { H1, Text, useTheme, View, YStack } from "tamagui";
import { Button } from "@/components/Button";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const GuidePage = () => {
  const { t } = useTranslation("body");
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
        title: t("guide.tab1.title"),
        description: t("guide.tab1.description"),
        icon: "",
      },
      {
        key: "2",
        title: t("guide.tab2.title"),
        description: t("guide.tab2.description"),
        icon: "",
      },
      {
        key: "3",
        title: t("guide.tab3.title"),
        description: t("guide.tab3.description"),
        icons: "",
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

  const onNextPage = async () => {
    if (currentIndex + 1 < data.length) {
      ref.current?.setPage(currentIndex + 1);
    } else {
      if (permission?.granted) {
        router.push("/(app)/camera");
      } else {
        const { status } = await requestPermission();

        if (status === "granted") {
          router.push("/(app)/camera");
        } else {
          toast.error(t("guide.error"));
        }
      }
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
        {data.map(({ key, title, description, icon }) => {
          const _Icon = icon;

          return (
            <YStack key={key} flex={1} items="center" pt="$36" gap="$16">
              <H1 fontSize="$2xl" fontWeight="$bold">
                {title}
              </H1>
              {/* <Icon width={320} height={320} /> */}
              <YStack gap="$6" items="center" justify="center">
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
              {currentIndex === data.length - 1
                ? t("guide.get_started")
                : t("guide.next")}
            </Button.Text>
          </Button>
        </YStack>
      </View>
    </SafeAreaView>
  );
};

export default GuidePage;
