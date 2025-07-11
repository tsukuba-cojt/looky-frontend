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
  category: Category | undefined;
  onCategoryChange: (category: Category) => void;
}

export const CategorySelectSheet = memo(
  ({ category, onCategoryChange, ...props }: CategorySelectSheetProps) => {
    const { t } = useTranslation("common");
    const [position, setPosition] = useState(0);

    return (
      <Sheet
        modal
        snapPoints={[30]}
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
            onValueChange={(category) => onCategoryChange(category as Category)}
            px="$2"
            gap="$4"
          >
            {categories.map((item, index) => {
              const id = createId();

              return (
                <XStack key={index.toString()} items="center" gap="$2">
                  <RadioGroup.Item id={id} value={item}>
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                  <Label flex={1} htmlFor={id} fontWeight="$medium">
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
