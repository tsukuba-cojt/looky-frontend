import {
  styled,
  RadioGroup as TamaguiRadioGroup,
  withStaticProperties,
} from "tamagui";

const RadioGroupItem = styled(TamaguiRadioGroup.Item, {
  size: "$8",
});

const RadioGroupIndicator = styled(TamaguiRadioGroup.Indicator, {
  w: "66%",
  h: "66%",
  bg: "$primaryBackground",
});

export const RadioGroup = withStaticProperties(TamaguiRadioGroup, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
});
