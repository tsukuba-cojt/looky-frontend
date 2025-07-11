import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "npm:@react-email/components";
import * as React from "npm:react";
import i18n from "../locales/index.ts";
import { Trans } from "npm:react-i18next";

interface MagicLinkEmailProps {
  supabase_url: string;
  email_action_type: string;
  redirect_to: string;
  token_hash: string;
  token: string;
}

export const MagicLinkEmail = ({
  supabase_url,
  token,
}: MagicLinkEmailProps) => {
  return (
    <Html lang="ja">
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                background: "#ffffff",
                foreground: "#09090b",
                primary: {
                  DEFAULT: "#f98f15",
                  foreground: "#fafafa",
                },
                muted: {
                  DEFAULT: "#f4f4f5",
                  foreground: "#71717a",
                },
                border: "#e4e4e7",
              },
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-background px-2 font-sans">
          <Preview>{i18n.t("magic_link.preview")}</Preview>
          <Container className="mx-auto my-5 max-w-md rounded-xl border border-border border-solid p-5 shadow">
            <Section className="mt-4">
              <Img
                src={`${supabase_url}/storage/v1/object/public/assets/icon.png`}
                width="96"
                height="96"
                alt="logo"
                className="mx-auto rounded-full"
              />
            </Section>
            <Heading className="my-6 text-center text-xl text-foreground font-bold">
              {i18n.t("magic_link.title")}
            </Heading>
            <Text className="text-foreground">
              <Trans i18nKey="magic_link.description" />
            </Text>
            <Text className="text-foreground">
              <Trans i18nKey="magic_link.instruction" />
            </Text>
            <Heading className="my-8 text-center text-4xl text-foreground font-bold tracking-widest">
              {token}
            </Heading>
            <Text className="text-xs text-muted-foreground">
              {i18n.t("magic_link.warning1")}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {i18n.t("magic_link.warning2")}
            </Text>
            <Text className="text-xs text-muted-foreground">
              <Trans
                i18nKey="support"
                components={{
                  link: <Link href="mailto:support@yushin.dev" />,
                }}
              />
            </Text>
            <Hr className="my-6 w-full border border-border border-solid" />
            <Text className="text-center text-xs text-muted-foreground">
              <Trans
                i18nKey="footer"
                components={{
                  link: <Link href="looky:///" />,
                }}
                values={{ year: new Date().getFullYear() }}
              />
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MagicLinkEmail;
