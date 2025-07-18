import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Link, useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Form, H1, Spinner, Text, View, XStack, YStack } from "tamagui";
import type { z } from "zod/v4";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/Input";
import { OAuthLogInButton } from "@/components/OAuthLogInButton";
import { signInWithEmail, signInWithOAuth } from "@/lib/auth";
import { loginSchema } from "@/schemas/auth";

type FormData = z.infer<typeof loginSchema>;

const LoginPage = memo(() => {
  const { t } = useTranslation("login");
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(loginSchema),
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await signInWithEmail(data.email);

        toast.success(t("success"));
        router.push({
          pathname: "/verify",
          params: {
            email: data.email,
          },
        });
      } catch {
        toast.error(t("error"));
      }
    },
    [router, t],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} items="center" justify="center" px="$12" gap="$6">
          <View position="absolute" t="$2" l="$6">
            <Button
              variant="ghost"
              size="icon"
              rounded="$full"
              onPress={router.back}
            >
              <Button.Icon>
                <Icons.chevronLeft size="$6" />
              </Button.Icon>
            </Button>
          </View>
          <YStack gap="$1">
            <H1 text="center" fontSize="$2xl" fontWeight="bold">
              {t("title")}
            </H1>
            <Text fontSize="$md" color="$mutedColor">
              {t("description")}
            </Text>
          </YStack>
          <Form w="100%" gap="$6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <YStack gap="$1.5">
                  <Input
                    placeholder={t("email")}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  {errors.email && (
                    <Text px="$1" fontSize="$sm" color="$destructiveBackground">
                      {t(`${errors.email.message}`)}
                    </Text>
                  )}
                </YStack>
              )}
            />
            <Form.Trigger asChild disabled={isSubmitting}>
              <Button variant="primary">
                {isSubmitting ? (
                  <Button.Icon>
                    <Spinner color="white" />
                  </Button.Icon>
                ) : (
                  <Button.Text>{t("submit")}</Button.Text>
                )}
              </Button>
            </Form.Trigger>
          </Form>
          <XStack gap="$1" items="center">
            <Text>{t("do_not_have_an_account")}</Text>
            <Link href="/signup" asChild>
              <Button group variant="link" h="auto" px="$0" py="$0">
                <Button.Text
                  color="$primaryBackground"
                  $group-press={{ textDecorationLine: "underline" }}
                >
                  {t("signup")}
                </Button.Text>
              </Button>
            </Link>
          </XStack>
          <XStack items="center" gap="$2">
            <View flex={1} h="$px" rounded="$full" bg="$mutedBackground" />
            <Text color="$mutedColor">{t("or")}</Text>
            <View flex={1} h="$px" rounded="$full" bg="$mutedBackground" />
          </XStack>
          <YStack w="100%" gap="$5" px="$4">
            <OAuthLogInButton
              boxShadow="$shadow.xs"
              provider="google"
              onPress={async () => {
                try {
                  signInWithOAuth("google");
                } catch {
                  toast.error(t("error"));
                }
              }}
            >
              {t("login_with_provider", { provider: "Google" })}
            </OAuthLogInButton>
            <OAuthLogInButton
              boxShadow="$shadow.xs"
              provider="apple"
              onPress={async () => {
                try {
                  signInWithOAuth("apple");
                } catch {
                  toast.error(t("error"));
                }
              }}
            >
              {t("login_with_provider", { provider: "Apple" })}
            </OAuthLogInButton>
            <OAuthLogInButton
              boxShadow="$shadow.xs"
              provider="twitter"
              onPress={async () => {
                try {
                  signInWithOAuth("twitter");
                } catch {
                  toast.error(t("error"));
                }
              }}
            >
              {t("login_with_provider", { provider: "Twitter" })}
            </OAuthLogInButton>
          </YStack>
        </YStack>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
});

export default LoginPage;
