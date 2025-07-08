import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Form, Label, Spinner, Text, View, XStack, YStack } from "tamagui";
import type { z } from "zod/v4";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { updateUser } from "@/lib/auth";
import { profileSchema } from "@/schemas/app";
import { useSessionStore } from "@/stores/useSessionStore";

const email = profileSchema.pick({ email: true });
type FormData = z.infer<typeof email>;

const EmailPage = () => {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const session = useSessionStore((state) => state.session);
  const isLoading = useSessionStore((state) => state.isLoading);
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(email),
  });

  const onSubmit = async (data: FormData) => {
    Keyboard.dismiss();

    try {
      if (!session) {
        return;
      }

      await updateUser({
        email: data.email,
      });

      toast.success(t("profile.email.success"));
      router.replace("/settings");
    } catch {
      toast.error(t("profile.email.error"));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View flex={1} pt="$8" pb={insets.bottom} px="$8">
        <Form
          flex={1}
          justify="space-between"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <YStack gap="$1.5">
                <XStack>
                  <Label htmlFor="email">{t("profile.email.label")}</Label>
                  <Text color="$destructiveBackground">*</Text>
                </XStack>
                <Input
                  placeholder={t("profile.email.placeholder")}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  disabled={isLoading}
                />
                <XStack items="center" justify="space-between" px="$1">
                  {errors.email ? (
                    <Text px="$1" fontSize="$sm" color="$destructiveBackground">
                      {t(`profile.email.${errors.email.message}`)}
                    </Text>
                  ) : (
                    <View />
                  )}
                  <Text fontSize="$sm" color="$mutedColor">
                    {value?.length ?? 0} / 24
                  </Text>
                </XStack>
              </YStack>
            )}
          />
          <KeyboardStickyView offset={{ opened: 10 }}>
            <YStack gap="$3">
              <Form.Trigger asChild disabled={isSubmitting}>
                <Button variant="primary">
                  {isSubmitting ? (
                    <Button.Icon>
                      <Spinner color="white" />
                    </Button.Icon>
                  ) : (
                    <Button.Text>{t("profile.email.submit")}</Button.Text>
                  )}
                </Button>
              </Form.Trigger>
              <Button
                variant="ghost"
                onPress={() => {
                  Keyboard.dismiss();
                  router.back();
                }}
              >
                <Button.Text>{t("profile.email.cancel")}</Button.Text>
              </Button>
            </YStack>
          </KeyboardStickyView>
        </Form>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EmailPage;
