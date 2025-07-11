import * as ImagePicker from "expo-image-picker";
import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner-native";
import { Sheet, type SheetProps, YStack } from "tamagui";
import { Button } from "../Button";
import { Icons } from "../Icons";

interface ImagePickerSheetProps extends SheetProps {
  onImagePicked: (uri: string) => void;
}

export const ImagePickerSheet = memo(
  ({ onImagePicked, ...props }: ImagePickerSheetProps) => {
    const { t } = useTranslation("common");
    const [position, setPosition] = useState(0);

    const takePhoto = useCallback(async () => {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();

      if (!granted) {
        toast.error(t("image_picker_sheet.error"));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        aspect: [4, 3],
      });

      if (!result.canceled) {
        onImagePicked(result.assets[0].uri);
      }
    }, [onImagePicked, t]);

    const pickImage = useCallback(async () => {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!granted) {
        toast.error(t("image_picker_sheet.error"));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        onImagePicked(result.assets[0].uri);
      }
    }, [onImagePicked, t]);

    return (
      <Sheet
        modal
        snapPoints={[28]}
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
          justify="space-between"
          px="$6"
          py="$8"
          borderTopLeftRadius="$4xl"
          borderTopRightRadius="$4xl"
        >
          <YStack gap="$4">
            <Button
              variant="ghost"
              justify="flex-start"
              gap="$3"
              onPress={pickImage}
            >
              <Button.Icon>
                <Icons.image size="$5" />
              </Button.Icon>
              <Button.Text>
                {t("image_picker_sheet.choose_from_library")}
              </Button.Text>
            </Button>
            <Button
              variant="ghost"
              justify="flex-start"
              gap="$3"
              onPress={takePhoto}
            >
              <Button.Icon>
                <Icons.camera size="$5" />
              </Button.Icon>
              <Button.Text>{t("image_picker_sheet.take_a_photo")}</Button.Text>
            </Button>
          </YStack>
          <Button variant="ghost" onPress={() => props.onOpenChange?.(false)}>
            <Button.Text>{t("image_picker_sheet.cancel")}</Button.Text>
          </Button>
        </Sheet.Frame>
      </Sheet>
    );
  },
);
