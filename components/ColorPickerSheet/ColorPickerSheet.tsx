import { FlashList } from "@shopify/flash-list";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { type SheetProps, Text, View, YStack } from "tamagui";
import { colors } from "@/constants";
import type { Color } from "@/types";
import { Button } from "../Button";
import { Icons } from "../Icons";
import { Sheet } from "../Sheet";

interface ColorPickerSheetProps extends SheetProps {
  color: Color | undefined;
  onColorChange: (color: Color) => void;
}

export const ColorPickerSheet = memo(
  ({ color, onColorChange, ...props }: ColorPickerSheetProps) => {
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
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame flex={1} gap="$4" py="$8">
          <Sheet.ScrollView>
            <FlashList
              contentContainerStyle={{ paddingHorizontal: 12 }}
              scrollEnabled={false}
              numColumns={4}
              data={Object.entries(colors)}
              renderItem={({ item: [key, value] }) => (
                <View flex={1} p="$3" items="center">
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
  },
);
