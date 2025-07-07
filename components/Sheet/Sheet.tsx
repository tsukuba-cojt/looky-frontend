import { styled, Sheet as TamaguiSheet, withStaticProperties } from "tamagui";

const SheetOverlay = styled(TamaguiSheet.Overlay, {
  name: "SheetOverlay",
  bg: "black",
  opacity: 0.5,
  enterStyle: { opacity: 0 },
  exitStyle: { opacity: 0 },
});

const SheetHandle = styled(TamaguiSheet.Handle, {
  name: "SheetHandle",
  h: "$1",
  mx: "40%",
});

const SheetFrame = styled(TamaguiSheet.Frame, {
  name: "SheetFrame",
  borderTopLeftRadius: "$4xl",
  borderTopRightRadius: "$4xl",
});

export const Sheet = withStaticProperties(TamaguiSheet, {
  Overlay: SheetOverlay,
  Handle: SheetHandle,
  Frame: SheetFrame,
});
