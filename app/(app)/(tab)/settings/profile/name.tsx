import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Form, Label, Text, View, XStack, YStack } from "tamagui";
import type { z } from "zod/v4";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { supabase } from "@/lib/client";
import { profileSchema } from "@/schemas/app";
import { useSessionStore } from "@/stores/useSessionStore";

const nameSchema = profileSchema.pick({ name: true });
type FormData = z.infer<typeof nameSchema>;

const NamePage = memo(() => {
  const { t } = useTranslation("settings");
  const router = useRouter();
  const session = useSessionStore((state) => state.session);
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(nameSchema),
  });

  const { isLoading } = useQuery(
    supabase
      .from("t_user")
      .select("id, name")
      .eq("id", session?.user.id ?? "")
      .maybeSingle(),
    {
      onSuccess: ({ data }) => {
        if (data?.name) {
          setValue("name", data.name);
        }
      },
    },
  );

  const { trigger } = useUpdateMutation(supabase.from("t_user"), ["id"], "*", {
    onSuccess: () => {
      router.back();
    },
    onError: () => {
      toast.error(t("settings:profile.name.error"));
    },
    revalidate: true,
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!session) {
        return;
      }

      await trigger({ id: session.user.id, name: data.name });
    },
    [session, trigger],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View flex={1} pt="$8" pb={insets.bottom} px="$8">
        <Form
          flex={1}
          justify="space-between"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <YStack gap="$1.5">
                <XStack>
                  <Label htmlFor="name">{t("profile.name.label")}</Label>
                  <Text color="$destructiveBackground">*</Text>
                </XStack>
                <Input
                  placeholder={t("profile.name.placeholder")}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  disabled={isLoading}
                />
                <XStack items="center" justify="space-between" px="$1">
                  {errors.name ? (
                    <Text px="$1" fontSize="$sm" color="$destructiveBackground">
                      {t(`name.${errors.name.message}`)}
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
              <Form.Trigger asChild>
                <Button variant="primary">
                  <Button.Text>{t("profile.name.submit")}</Button.Text>
                </Button>
              </Form.Trigger>
              <Button
                variant="ghost"
                onPress={() => {
                  Keyboard.dismiss();
                  router.back();
                }}
              >
                <Button.Text>{t("profile.name.cancel")}</Button.Text>
              </Button>
            </YStack>
          </KeyboardStickyView>
        </Form>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default NamePage;
