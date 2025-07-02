import { createId } from "@paralleldrive/cuid2";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Label, Sheet, type SheetProps, XStack } from "tamagui";
import type { Category } from "@/types";
import { Button } from "../Button";
import { RadioGroup } from "../RadioGroup";

interface CategorySelectSheetProps extends SheetProps {
  category: Category | undefined;
  onCategoryChange: (category: Category) => void;
}

const categories = ["tops", "bottoms", "outwear", "dresses"];

export const CategorySelectSheet = ({
  category,
  onCategoryChange,
  ...props
}: CategorySelectSheetProps) => {
  const { t } = useTranslation("discover");
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
          value={category}
          onValueChange={(category) => onCategoryChange(category as Category)}
          px="$2"
          gap="$4"
        >
          {categories.map((category, index) => {
            const id = createId();

            return (
              <XStack key={index.toString()} gap="$2">
                <RadioGroup.Item id={id} value={category}>
                  <RadioGroup.Indicator />
                </RadioGroup.Item>
                <Label flex={1} htmlFor={id} fontWeight="$medium">
                  {t(`category.${category}`)}
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
