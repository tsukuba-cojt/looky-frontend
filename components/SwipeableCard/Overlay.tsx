import type { PropsWithChildren } from "react";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface OverlayProps extends PropsWithChildren {
  inputRange: number[];
  outputRange: number[];
  opacity: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
}

const Overlay = ({
  inputRange,
  outputRange,
  opacity,
  style,
  children,
}: OverlayProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(opacity.value, inputRange, outputRange, "clamp"),
      zIndex: 1,
    };
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, animatedStyle, style]}
      pointerEvents="none"
    >
      {children}
    </Animated.View>
  );
};

export default Overlay;
