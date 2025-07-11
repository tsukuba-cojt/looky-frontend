import type { TabTriggerSlotProps } from "expo-router/ui";
import { forwardRef, memo, type PropsWithChildren } from "react";
import { Pressable, type View } from "react-native";
import { Text, YStack } from "tamagui";
import { Icons } from "../Icons";

interface TabButtonProps extends PropsWithChildren, TabTriggerSlotProps {
  label: string;
  icon: keyof typeof Icons;
}

export const TabButton = memo(
  forwardRef<View, TabButtonProps>(({ label, icon, ...props }, ref) => {
    const Icon = Icons[icon];

    return (
      <Pressable ref={ref} {...props}>
        <YStack gap="$1" items="center">
          <Icon
            size="$6"
            color={props.isFocused ? "$primaryBackground" : "$color"}
            opacity={props.isFocused ? 1 : 0.6}
          />
          <Text
            fontSize="$sm"
            color={props.isFocused ? "$primaryBackground" : "$color"}
            opacity={props.isFocused ? 1 : 0.6}
          >
            {label}
          </Text>
        </YStack>
      </Pressable>
    );
  }),
);
