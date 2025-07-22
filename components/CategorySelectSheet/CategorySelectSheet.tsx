import { createId } from "@paralleldrive/cuid2";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label, type SheetProps, XStack } from "tamagui";
import { categories } from "@/constants";
import type { Category } from "@/types";
import { Button } from "../Button";
import { RadioGroup } from "../RadioGroup";
import { Sheet } from "../Sheet";

interface CategorySelectSheetProps extends SheetProps {
  category: "all" | Category;
  onCategoryChange: (category: "all" | Category) => void;
}

export const CategorySelectSheet = memo(
  ({ category, onCategoryChange, ...props }: CategorySelectSheetProps) => {
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
        <Sheet.Frame flex={1} px="$6" py="$8" justify="space-between">
          <RadioGroup
            value={category}
            onValueChange={(value) => onCategoryChange(value as Category)}
            px="$2"
            gap="$4"
          >
            {["all", ...categories].map((item) => {
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
                    {t(`category.${item}`)}
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
