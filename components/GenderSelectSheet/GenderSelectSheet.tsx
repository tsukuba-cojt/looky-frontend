import { createId } from "@paralleldrive/cuid2";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label, type SheetProps, XStack } from "tamagui";
import { genders } from "@/constants";
import type { Gender } from "@/types";
import { Button } from "../Button";
import { RadioGroup } from "../RadioGroup";
import { Sheet } from "../Sheet";

interface GenderSelectSheetProps extends SheetProps {
  gender: "all" | Gender;
  onGenderChange: (gender: "all" | Gender) => void;
}

export const GenderSelectSheet = memo(
  ({ gender, onGenderChange, ...props }: GenderSelectSheetProps) => {
    const { t } = useTranslation("common");
    const [position, setPosition] = useState(0);

    return (
      <Sheet
        modal
        snapPoints={[32]}
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
            onValueChange={(value) => onGenderChange(value as Gender)}
            px="$2"
            gap="$4"
          >
            {["all", ...genders].map((item) => {
              const id = createId();

              return (
                <XStack key={id} items="center" gap="$2">
                  <RadioGroup.Item id={id} value={item}>
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Label
                    flex={1}
                    htmlFor={id}
                    fontWeight="$medium"
                    unstyled
                    color="$color"
                  >
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
  },
);
