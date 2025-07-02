import { useReducer } from "react";

type SheetAction<T> = { type: "OPEN"; payload: T } | { type: "CLOSE" };

const reducer = (
  state: string | null,
  action: SheetAction<string>,
): string | null => {
  switch (action.type) {
    case "OPEN":
      return action.payload;
    case "CLOSE":
      return null;
    default:
      return state;
  }
};

export const useSheet = () => {
  const [state, dispatch] = useReducer(reducer, null);

  const open = (type: string) => dispatch({ type: "OPEN", payload: type });
  const close = () => dispatch({ type: "CLOSE" });

  const getSheetProps = (type: string) => {
    const isOpen = state === type;
    return {
      open: isOpen,
      onOpenChange: (open: boolean) => {
        if (!open) {
          close();
        }
      },
    };
  };

  return { state, open, close, getSheetProps };
};
