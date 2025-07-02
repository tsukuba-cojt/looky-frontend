import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { Sheet, type SheetProps, Text, View, YStack } from "tamagui";
import type { Color } from "@/types";
import { Button } from "../Button";
import { Icons } from "../Icons";

interface ColorPickerSheetProps extends SheetProps {
  color: Color | undefined;
  onColorChange: (color: Color) => void;
}

const colors = {
  red: "#E53935",
  pink: "#D81B60",
  purple: "#8E24AA",
  indigo: "#3949AB",
  blue: "#1E88E5",
  cyan: "#00ACC1",
  teal: "#00897B",
  green: "#43A047",
  lime: "#C0CA33",
  yellow: "#FDD835",
  amber: "#FFB300",
  orange: "#FB8C00",
  brown: "#6D4C41",
  gray: "#757575",
  black: "#000000",
  white: "#FFFFFF",
} as const;

export const ColorPickerSheet = ({
  color,
  onColorChange,
  ...props
}: ColorPickerSheetProps) => {
  const { t } = useTranslation("discover");
  const [position, setPosition] = useState(0);

  return (
    <Sheet
      modal
      snapPoints={[42]}
      position={position}
      onPositionChange={setPosition}
      dismissOnSnapToBottom
      animation="quick"
      {...props}
    >
      <Sheet.Overlay
        bg="black"
        opacity={0.5}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle h="$1" mx="40%" />
      <Sheet.Frame
        flex={1}
        gap="$4"
        py="$8"
        borderTopLeftRadius="$4xl"
        borderTopRightRadius="$4xl"
      >
        <Sheet.ScrollView>
          <FlashList
            contentContainerStyle={{ paddingHorizontal: 16 }}
            scrollEnabled={false}
            numColumns={4}
            estimatedItemSize={34}
            data={Object.entries(colors)}
            renderItem={({ item: [key, value] }) => (
              <View flex={1} p="$2" items="center">
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => onColorChange(key as Color)}
                >
                  <YStack w="$16" gap="$1" items="center">
                    <View
                      w="$10"
                      h="$10"
                      items="center"
                      justify="center"
                      rounded="$full"
                      borderColor="$borderColor"
                      borderWidth={key === "white" ? 1 : 0}
                      bg={value}
                    >
                      {color === key && (
                        <Icons.check
                          size="$5"
                          color={key === "white" ? "black" : "white"}
                        />
                      )}
                    </View>
                    <Text fontSize="$sm">{t(`color.${key}`)}</Text>
                  </YStack>
                </TouchableOpacity>
              </View>
            )}
          />
        </Sheet.ScrollView>
        <Button
          variant="ghost"
          mx="$6"
          onPress={() => props.onOpenChange?.(false)}
        >
          <Button.Text>{t("close")}</Button.Text>
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
};
