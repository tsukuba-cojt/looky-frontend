import {
  createStyledContext,
  type GetProps,
  styled,
  ButtonFrame as TamaguiButtonFrame,
  ButtonIcon as TamaguiButtonIcon,
  ButtonText as TamaguiButtonText,
  withStaticProperties,
} from "tamagui";

type ButtonVariant =
  | "default"
  | "primary"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

type ButtonSize = "default" | "sm" | "lg" | "icon";

export const ButtonContext = createStyledContext({
  size: "default" as ButtonVariant,
  variant: "default" as ButtonSize,
});

const ButtonFrame = styled(TamaguiButtonFrame, {
  name: "Button",
  context: ButtonContext,
  w: "auto",
  borderWidth: 0,
  rounded: "$md",

  variants: {
    disabled: {
      true: {
        opacity: 0.5,
        pointerEvents: "none",
      },
    },

    size: {
      default: {
        h: "$9",
        px: "$4",
        py: "$2",
      },
      sm: {
        h: "$9",
        px: "$3",
      },
      lg: {
        h: "$10",
        px: "$8",
      },
      icon: {
        h: "$9",
        w: "$9",
      },
    },

    variant: {
      default: {
        bg: "$background",
        boxShadow: "$shadow.sm",

        hoverStyle: {
          bg: "$backgroundHover",
        },

        pressStyle: {
          bg: "$backgroundPress",
        },

        focusVisibleStyle: {
          bg: "$backgroundFocus",
        },
      },
      primary: {
        bg: "$primaryBackground",
        boxShadow: "$shadow.sm",

        hoverStyle: {
          bg: "$primaryBackgroundHover",
        },

        pressStyle: {
          bg: "$primaryBackgroundPress",
        },

        focusVisibleStyle: {
          bg: "$primaryBackgroundFocus",
        },
      },
      destructive: {
        bg: "$destructiveBackground",
        boxShadow: "$shadow.sm",

        hoverStyle: {
          bg: "$destructiveBackgroundHover",
        },

        pressStyle: {
          bg: "$destructiveBackgroundPress",
        },

        focusVisibleStyle: {
          bg: "$destructiveBackgroundFocus",
        },
      },
      outline: {
        bg: "transparent",
        borderWidth: 1,
        borderColor: "$borderColor",
        boxShadow: "$shadow.sm",

        hoverStyle: {
          bg: "$accentBackgroundHover",
          opacity: 0.9,
        },

        pressStyle: {
          bg: "$accentBackgroundPress",
          opacity: 0.9,
        },

        focusVisibleStyle: {
          bg: "$accentBackgroundFocus",
          opacity: 0.9,
        },
      },
      secondary: {
        bg: "$secondaryBackground",

        boxShadow: "$shadow.sm",

        hoverStyle: {
          bg: "$secondaryBackgroundHover",
        },

        pressStyle: {
          bg: "$secondaryBackgroundPress",
        },

        focusVisibleStyle: {
          bg: "$secondaryBackgroundFocus",
        },
      },
      ghost: {
        bg: "$backgroundTransparent",

        hoverStyle: {
          bg: "$accentBackgroundHover",
        },

        pressStyle: {
          bg: "$accentBackgroundPress",
        },

        focusVisibleStyle: {
          bg: "$accentBackgroundFocus",
        },
      },
      link: {
        bg: "$backgroundTransparent",

        hoverStyle: {
          bg: "$backgroundTransparent",
        },

        pressStyle: {
          bg: "$backgroundTransparent",
        },

        focusVisibleStyle: {
          bg: "$backgroundTransparent",
        },
      },
    },
  } as const,

  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export type ButtonProps = GetProps<typeof ButtonFrame>;

const ButtonText = styled(TamaguiButtonText, {
  name: "ButtonText",
  context: ButtonContext,
  select: "none",
  fontWeight: "$medium",

  variants: {
    size: {
      default: {
        fontSize: "$md",
      },
      sm: {
        fontSize: "$xs",
      },
      lg: {
        fontSize: "$md",
      },
      icon: {
        fontSize: "$md",
      },
    },

    variant: {
      default: {
        color: "$color",
      },
      primary: {
        color: "$primaryColor",
      },
      destructive: {
        color: "$destructiveColor",
      },
      outline: {
        hoverStyle: {
          color: "$accentColor",
        },

        pressStyle: {
          color: "$accentColor",
        },

        focusVisibleStyle: {
          color: "$accentColor",
        },
      },
      secondary: {
        color: "$secondaryColor",
      },
      ghost: {
        color: "$accentColor",
      },
      link: {
        color: "$color",
      },
    },
  } as const,

  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export const Button = withStaticProperties(ButtonFrame, {
  Props: ButtonContext.Provider,
  Text: ButtonText,
  Icon: TamaguiButtonIcon,
});
