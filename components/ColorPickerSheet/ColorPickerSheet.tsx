import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { Sheet, type SheetProps, Text, View, YStack } from "tamagui";
import { colors } from "@/constants";
import type { Color } from "@/types";
import { Button } from "../Button";
import { Icons } from "../Icons";

interface ColorPickerSheetProps extends SheetProps {
  color: Color | undefined;
  onColorChange: (color: Color) => void;
}

export const ColorPickerSheet = ({
  color,
  onColorChange,
  ...props
}: ColorPickerSheetProps) => {
  const { t } = useTranslation("common");
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
            estimatedItemSize={32}
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
