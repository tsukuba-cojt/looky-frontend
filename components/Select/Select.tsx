import { styled, Select as TamaguiSelect, withStaticProperties } from "tamagui";

const SelectTrigger = styled(TamaguiSelect.Trigger, {
  name: "SelectTrigger",
  w: "100%",
  h: "$9",
  rounded: "$md",
  px: "$3",
  py: "$2",
  fontSize: "$sm",
  boxShadow: "$shadow.sm",
});

export const Select = withStaticProperties(TamaguiSelect, {
  Trigger: SelectTrigger,
});
