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

const SelectGroup = styled(TamaguiSelect.Group, {
  name: "SelectGroup",
  gap: "$1",
});

const SelectItem = styled(TamaguiSelect.Item, {
  name: "SelectItem",
  rounded: "$sm",
  px: "$3",
  py: "$2",
});

export const Select = withStaticProperties(TamaguiSelect, {
  Trigger: SelectTrigger,
  Group: SelectGroup,
  Item: SelectItem,
});
