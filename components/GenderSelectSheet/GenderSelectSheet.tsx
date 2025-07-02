import { createId } from "@paralleldrive/cuid2";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Label, Sheet, type SheetProps, XStack } from "tamagui";
import type { Gender } from "@/types";
import { Button } from "../Button";
import { RadioGroup } from "../RadioGroup";

interface GenderSelectSheetProps extends SheetProps {
  gender: Gender | undefined;
  onGenderChange: (gender: Gender) => void;
}

const genders = ["man", "woman", "other"];

export const GenderSelectSheet = ({
  gender,
  onGenderChange,
  ...props
}: GenderSelectSheetProps) => {
  const { t } = useTranslation("discover");
  const [position, setPosition] = useState(0);

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
        <RadioGroup
          value={gender}
          onValueChange={(gender) => onGenderChange(gender as Gender)}
          px="$2"
          gap="$4"
        >
          {genders.map((gender, index) => {
            const id = createId();

            return (
              <XStack key={index.toString()} gap="$2">
                <RadioGroup.Item id={id} value={gender}>
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label flex={1} htmlFor={id} fontWeight="$medium">
                  {t(`gender.${gender}`)}
                </Label>
              </XStack>
            );
          })}
        </RadioGroup>
        <Button variant="ghost" onPress={() => props.onOpenChange?.(false)}>
          <Button.Text>{t("close")}</Button.Text>
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
};
