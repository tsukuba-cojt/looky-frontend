import {
  ImageManipulator,
  SaveFormat,
} from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, useWindowDimensions } from "react-native";
import {
  Gesture,
  GestureDetector,
  type GestureUpdateEvent,
  type PanGestureHandlerEventPayload,
  type PinchGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spinner, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const CropPage = memo(() => {
  const { t } = useTranslation("crop");
  const router = useRouter();
  const { uri, from } = useLocalSearchParams<{ uri: string; from: string }>();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startTranslateX = useSharedValue(0);
  const startTranslateY = useSharedValue(0);

  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const size = useSharedValue<{
    width: number;
    height: number;
  } | null>(null);

  const diameter = useMemo(() => width * 0.9, [width]);
  const radius = useMemo(() => diameter / 2, [diameter]);

  useEffect(() => {
    setIsLoading(true);
    Image.getSize(uri, (width, height) => {
      if (height > width) {
        size.value = {
          width: diameter,
          height: height * (diameter / width),
        };
      } else {
        size.value = {
          width: width * (diameter / height),
          height: diameter,
        };
      }

      translateX.value = withTiming(0, { duration: 50 });
      translateY.value = withTiming(0, { duration: 50 });

      scale.value = withTiming(1, { duration: 50 });

      setIsLoading(false);
    });
  }, [uri, translateX, translateY, scale, size, diameter]);

  const worklet = useCallback(() => {
    "worklet";
    if (!size.value) {
      return;
    }

    const offsetX = Math.max(
      (size.value.width * scale.value - diameter) / 2,
      0,
    );
    const offsetY = Math.max(
      (size.value.height * scale.value - diameter) / 2,
      0,
    );

    translateX.value = Math.min(Math.max(translateX.value, -offsetX), offsetX);
    translateY.value = Math.min(Math.max(translateY.value, -offsetY), offsetY);
  }, [diameter, scale, size, translateX, translateY]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startTranslateX.value = translateX.value;
      startTranslateY.value = translateY.value;
    })
    .onUpdate((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      if (!size.value) {
        return;
      }

      translateX.value = startTranslateX.value + event.translationX;
      translateY.value = startTranslateY.value + event.translationY;
      worklet();
    })
    .onEnd(() => {
      worklet();
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((event: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
      if (!size.value) {
        return;
      }

      const ratio = Math.max(1, startScale.value * event.scale) / scale.value;

      translateX.value = radius - (radius - translateX.value) * ratio;
      translateY.value = radius - (radius - translateY.value) * ratio;
      scale.value = Math.max(1, startScale.value * event.scale);
      worklet();
    })
    .onEnd(() => {
      worklet();
    });

  const animatedStyles = useAnimatedStyle(() => {
    if (!size.value) {
      return {};
    }

    return {
      width: size.value.width,
      height: size.value.height,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const crop = useCallback(async () => {
    if (!size.value) {
      return {};
    }

    const context = ImageManipulator.manipulate(uri);
    context
      .resize({
        width: size.value.width,
        height: size.value.height,
      })
      .crop({
        originX:
          size.value.width / 2 - (radius + translateX.value) / scale.value,
        originY:
          size.value.height / 2 - (radius + translateY.value) / scale.value,
        width: diameter / scale.value,
        height: diameter / scale.value,
      })
      .resize({
        width: 512,
        height: 512,
      });
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.JPEG,
    });

    router.replace({
      pathname: from,
      params: { uri: result.uri },
    });
  }, [
    uri,
    diameter,
    from,
    radius,
    router,
    scale,
    size,
    translateX,
    translateY,
  ]);

  return (
    <YStack flex={1} bg="black">
      <XStack
        position="absolute"
        t="$0"
        w="100%"
        z="$50"
        items="center"
        justify="space-between"
        h={insets.top + 50}
        pt="$20"
        px="$6"
        pb="$4"
      >
        <Button variant="link" onPress={router.back}>
          <Button.Text color="white">{t("cancel")}</Button.Text>
        </Button>
        <Button h="$7" px="$5" py="$1" rounded="$full" onPress={crop}>
          <Button.Text>{t("done")}</Button.Text>
        </Button>
      </XStack>
      <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
        <Animated.View
          style={{
            position: "absolute",
            top: insets.top + 50,
            left: 0,
            right: 0,
            bottom: insets.bottom + 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatedImage source={{ uri }} style={animatedStyles} />
          <View
            position="absolute"
            t={
              (height - insets.top - insets.bottom - 100) / 2 -
              (radius + Math.max(width, height) * 1.5)
            }
            l={width / 2 - (radius + Math.max(width, height) * 1.5)}
            w={diameter + 2 * Math.max(width, height) * 1.5}
            h={diameter + 2 * Math.max(width, height) * 1.5}
            rounded={radius + Math.max(width, height) * 1.5}
            borderColor="rgba(0, 0, 0, 0.7)"
            borderWidth={Math.max(width, height) * 1.5}
            pointerEvents="none"
          />
          <View
            position="absolute"
            t={(height - insets.top - insets.bottom - 100) / 2 - radius}
            l={width / 2 - radius}
            w={diameter}
            h={diameter}
            rounded={radius}
            borderColor="white"
            borderWidth={2}
            pointerEvents="none"
          />
        </Animated.View>
      </GestureDetector>
      {isLoading && (
        <View
          position="absolute"
          inset={0}
          items="center"
          justify="center"
          bg="black"
          opacity={0.6}
        >
          <Spinner color="white" />
        </View>
      )}
    </YStack>
  );
});

export default CropPage;
