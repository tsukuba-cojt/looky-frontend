import { View, type ViewProps } from "tamagui";

export const Skeleton = (props: ViewProps) => {
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
};
