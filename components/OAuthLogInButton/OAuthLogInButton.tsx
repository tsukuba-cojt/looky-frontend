import { memo } from "react";
import { View } from "tamagui";
import Apple from "@/assets/images/apple.svg";
import Google from "@/assets/images/google.svg";
import Twitter from "@/assets/images/twitter.svg";
import { Button, type ButtonProps } from "@/components/Button";

interface OAuthLogInButtonProps extends ButtonProps {
  provider: "google" | "apple" | "twitter";
  children: string;
}

const icons = {
  google: Google,
  apple: Apple,
  twitter: Twitter,
} as const;

export const OAuthLogInButton = memo(
  ({ provider, children, ...props }: OAuthLogInButtonProps) => {
    const Icon = icons[provider];

    return (
      <Button variant="outline" rounded="$full" {...props}>
        <View position="absolute" l="$4">
          <Icon width={16} height={16} />
        </View>
        <Button.Text>{children}</Button.Text>
      </Button>
    );
  },
);
