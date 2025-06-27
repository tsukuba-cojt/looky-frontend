import { View, type ViewProps } from "tamagui";

export const Skeleton = (props: ViewProps) => {
  return (
    <View
      animation="pulse"
      rounded="$radius.md"
      enterStyle={{
        opacity: 0.5,
      }}
      exitStyle={{
        opacity: 0.5,
      }}
      bg="$accentBackground"
      {...props}
    />
  );
};
