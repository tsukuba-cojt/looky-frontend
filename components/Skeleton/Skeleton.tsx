import { memo } from "react";
import { View, type ViewProps } from "tamagui";

export const Skeleton = memo((props: ViewProps) => {
  return (
    <View
      animation="pulse"
      rounded="$md"
      enterStyle={{
        opacity: 0.5,
      }}
      bg="$accentBackground"
      {...props}
    />
  );
});
