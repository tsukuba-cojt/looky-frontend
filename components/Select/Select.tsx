import { styled, Select as TamaguiSelect } from "tamagui";

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

const Select = TamaguiSelect;
Select.Trigger = SelectTrigger;

export { Select };
