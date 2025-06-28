import {
  forwardRef,
  memo,
  type PropsWithChildren,
  useCallback,
  useImperativeHandle,
} from "react";
import {
  type StyleProp,
  useWindowDimensions,
  type ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Portal } from "tamagui";

export type SwipableCardRef =
  | {
      swipeRight: () => void;
      swipeLeft: () => void;
      swipeBack: () => void;
      swipeTop: () => void;
      swipeBottom: () => void;
    }
  | undefined;

export type SwipableCardProps = {
  index: number;
  activeIndex: SharedValue<number>;
  onSwipeRight?: (index: number) => void;
  onSwipeLeft?: (index: number) => void;
  onSwipeTop?: (index: number) => void;
  onSwipeBottom?: (index: number) => void;
  cardStyle?: StyleProp<ViewStyle>;
};

export const SwipeableCard = memo(
  forwardRef<SwipableCardRef, PropsWithChildren<SwipableCardProps>>(
    (
      {
        index,
        activeIndex,
        onSwipeLeft,
        onSwipeRight,
        onSwipeTop,
        onSwipeBottom,
        cardStyle,
        children,
      },
      ref,
    ) => {
      const userConfig = {
        damping: 20,
        stiffness: 50,
        mass: 1,
        overshootClamping: true,
        restDisplacementThreshold: 0.0001,
        restSpeedThreshold: 0.0001,
      };

      const translateX = useSharedValue(0);
      const translateY = useSharedValue(0);

      const { width, height } = useWindowDimensions();
      const maxTranslateX = width * 1.5;
      const maxTranslateY = height * 1.5;

      const swipeRight = useCallback(() => {
        onSwipeRight?.(index);
        translateX.value = withSpring(maxTranslateX, userConfig);
        activeIndex.value++;
      }, [index, activeIndex, maxTranslateX, onSwipeRight, translateX]);

      const swipeLeft = useCallback(() => {
        onSwipeLeft?.(index);
        translateX.value = withSpring(-maxTranslateX, userConfig);
        activeIndex.value++;
      }, [index, activeIndex, maxTranslateX, onSwipeLeft, translateX]);

      const swipeTop = useCallback(() => {
        onSwipeTop?.(index);
        translateY.value = withSpring(-maxTranslateY, userConfig);
        activeIndex.value++;
      }, [index, activeIndex, maxTranslateY, onSwipeTop, translateY]);

      const swipeBottom = useCallback(() => {
        onSwipeBottom?.(index);
        translateY.value = withSpring(maxTranslateY, userConfig);
        activeIndex.value++;
      }, [index, activeIndex, maxTranslateY, onSwipeBottom, translateY]);

      const swipeBack = useCallback(() => {
        cancelAnimation(translateX);
        cancelAnimation(translateY);
        translateX.value = withSpring(0, userConfig);
        translateY.value = withSpring(0, userConfig);
      }, [translateX, translateY]);

      useImperativeHandle(ref, () => {
        return {
          swipeLeft,
          swipeRight,
          swipeBack,
          swipeTop,
          swipeBottom,
        };
      }, [swipeLeft, swipeRight, swipeBack, swipeTop, swipeBottom]);

      const rotateX = useDerivedValue(() => {
        return interpolate(
          translateX.value,
          [-width / 3, 0, width / 3],
          [-Math.PI / 20, 0, Math.PI / 20],
          "clamp",
        );
      }, []);

      const panGesture = Gesture.Pan()
        .onUpdate((event) => {
          const currentIndex = Math.floor(activeIndex.value);
          if (currentIndex !== index) return;

          translateX.value = event.translationX;
          translateY.value = event.translationY;
        })
        .onFinalize((event) => {
          const currentIndex = Math.floor(activeIndex.value);
          if (currentIndex !== index) return;

          const thresholdX = width / 3;
          const thresholdY = height / 3;

          if (Math.abs(event.translationY) > thresholdY) {
            if (event.translationY < 0) {
              runOnJS(swipeTop)();
            } else {
              runOnJS(swipeBottom)();
            }
            return;
          }

          if (Math.abs(event.translationX) > thresholdX) {
            if (event.translationX > 0) {
              runOnJS(swipeRight)();
            } else {
              runOnJS(swipeLeft)();
            }
            return;
          }

          translateX.value = withSpring(0, userConfig);
          translateY.value = withSpring(0, userConfig);
        });

      const animatedStyles = useAnimatedStyle(() => {
        const currentIndex = Math.floor(activeIndex.value);
        const diff = index - currentIndex;

        const opacity = withTiming(
          index < currentIndex + 2 && index >= currentIndex - 1 && diff < 2
            ? 1
            : 0,
        );
        const scale = withTiming(1 - 0.07 * diff);

        return {
          opacity,
          position: "absolute",
          zIndex: -index,
          transform: [
            { rotate: `${rotateX.value}rad` },
            { scale },
            {
              translateX: translateX.value,
            },
            {
              translateY: translateY.value,
            },
          ],
        };
      });

      return (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[cardStyle, animatedStyles]}>
            {children}
          </Animated.View>
        </GestureDetector>
      );
    },
  ),
);
