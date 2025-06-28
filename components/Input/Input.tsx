import { styled, InputFrame as TamaguiInputFrame } from "tamagui";

export const Input = styled(TamaguiInputFrame, {
  name: "Input",
  w: "100%",
  h: "$9",
  rounded: "$md",
  px: "$3",
  py: "$2",
  fontSize: "$sm",
  boxShadow: "$shadow.sm",
  selectionColor: "$color",
});
