import { createId } from "@paralleldrive/cuid2";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Label, type SheetProps, XStack } from "tamagui";
import { genders } from "@/constants";
import type { Gender } from "@/types";
import { Button } from "../Button";
import { RadioGroup } from "../RadioGroup";
import { Sheet } from "../Sheet";

interface GenderSelectSheetProps extends SheetProps {
  gender: Gender | undefined;
  onGenderChange: (gender: Gender) => void;
}

export const GenderSelectSheet = ({
  gender,
  onGenderChange,
  ...props
}: GenderSelectSheetProps) => {
  const { t } = useTranslation("common");
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
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame flex={1} justify="space-between" px="$6" py="$8">
        <RadioGroup
          value={gender}
          onValueChange={(gender) => onGenderChange(gender as Gender)}
          px="$2"
          gap="$4"
        >
          {genders.map((item, index) => {
            const id = createId();

            return (
              <XStack key={index.toString()} items="center" gap="$2">
                <RadioGroup.Item id={id} value={item}>
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label flex={1} htmlFor={id} fontWeight="$medium">
                  {t(`gender.${item}`)}
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
