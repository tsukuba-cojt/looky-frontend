import { useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
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
        title: t("body.guide.tab1.title"),
        description: t("body.guide.tab1.description"),
        icon: require("../../../../assets/images/dummy.png"),
      },
      {
        key: "2",
        title: t("body.guide.tab2.title"),
        description: t("body.guide.tab2.description"),
        icon: require("../../../../assets/images/dummy.png"),
      },
      {
        key: "3",
        title: t("body.guide.tab3.title"),
        description: t("body.guide.tab3.description"),
        icon: require("../../../../assets/images/dummy.png"),
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
            from: "/setup/confirm",
          },
        });
      } else {
        const { status } = await requestPermission();

        if (status === "granted") {
          router.push({
            pathname: "/camera",
            params: {
              from: "/setup/confirm",
            },
          });
        } else {
          toast.error(t("body.guide.error"));
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
                  {t("body.guide.tips")}
                </H1>
                <View
                  w={300}
                  h={300}
                  bg="$primaryBackground"
                  rounded="$full"
                  overflow="hidden"
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "150%",
                      transform: [{ translateY: 60 }],
                    }}
                    source={icon}
                    contentFit="contain"
                    transition={200}
                  />
                </View>
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
        />
      </YStack>

      <YStack w="100%" gap="$4" px="$8">
        <Button variant="primary" onPress={onNextPage}>
          <Button.Text>
            {currentIndex === data.length - 1
              ? t("body.guide.get_started")
              : t("body.guide.next")}
          </Button.Text>
        </Button>
        <Button
          variant="link"
          onPress={() =>
            router.push({
              pathname: "/camera",
              params: {
                from: "/setup/confirm",
              },
            })
          }
        >
          <Button.Text>{t("body.guide.skip")}</Button.Text>
        </Button>
      </YStack>
    </SafeAreaView>
  );
};

export default GuidePage;
