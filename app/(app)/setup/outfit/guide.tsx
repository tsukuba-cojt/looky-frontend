import { useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, SafeAreaView, useWindowDimensions } from "react-native";
import { SlidingDot } from "react-native-animated-pagination-dots";
import PagerView, {
  type PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import { toast } from "sonner-native";
import { H1, Text, useTheme, YStack } from "tamagui";
import { Button } from "@/components/Button";

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const GuidePage = () => {
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
        icon: require("../../../../assets/images/guide3.png"),
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
  };

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
            <YStack key={key} flex={1} items="center" pt={48} gap="$12">
              <YStack gap="$6">
                <H1 text="center" fontSize="$2xl" fontWeight="$bold">
                  {t("outfit.guide.tips")}
                </H1>
                <Image
                  style={{ width: 300, height: 300 }}
                  source={icon}
                  transition={200}
                />
              </YStack>
              <YStack gap="$6">
                <H1 fontSize="$2xl" fontWeight="$bold">
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
};

export default GuidePage;
