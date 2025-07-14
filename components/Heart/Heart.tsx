import { memo } from "react";
import {
  AnimatePresence,
  type GetThemeValueForKey,
  type SizeTokens,
  View,
  type ViewProps,
} from "tamagui";
import { Icons } from "../Icons";

interface HeartProps extends ViewProps {
  size?: SizeTokens;
  color?: GetThemeValueForKey<"color">;
  active: boolean;
}

export const Heart = memo(({ size, color, active, ...props }: HeartProps) => {
  return (
    <>
      <AnimatePresence>
        {!active && (
          <View
            position="absolute"
            w={size ?? "$4"}
            h={size ?? "$4"}
            animation="quick"
            enterStyle={{ opacity: 0, scale: 0 }}
            exitStyle={{ opacity: 0, scale: 0 }}
            {...props}
          >
            <Icons.heart size={size ?? "$4"} color={color} />
          </View>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <View
            w={size ?? "$4"}
            h={size ?? "$4"}
            animation="quick"
            enterStyle={{ opacity: 0, scale: 0 }}
            exitStyle={{ opacity: 0, scale: 0 }}
            {...props}
          >
            <Icons.heart size={size ?? "$4"} color="red" fill="red" />
          </View>
        )}
      </AnimatePresence>
    </>
  );
});
