import { useCallback, useReducer } from "react";

type SheetAction<T> = { type: "open"; payload: T } | { type: "close" };

const reducer = (
  state: string | null,
  action: SheetAction<string>,
): string | null => {
  switch (action.type) {
    case "open":
      return action.payload;
    case "close":
      return null;
    default:
      return state;
  }
};

export const useSheet = () => {
  const [state, dispatch] = useReducer(reducer, null);

  const open = useCallback(
    (type: string) => dispatch({ type: "open", payload: type }),
    [],
  );
  const close = useCallback(() => dispatch({ type: "close" }), []);

  const getSheetProps = useCallback(
    (type: string) => {
      const isOpen = state === type;
      return {
        open: isOpen,
        onOpenChange: (open: boolean) => {
          if (!open) {
            close();
          }
        },
      };
    },
    [state, close],
  );

  return { state, open, close, getSheetProps };
};
