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

const heightSchema = profileSchema.pick({ height: true });
type FormData = z.infer<typeof heightSchema>;

const HeightPage = memo(() => {
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
    resolver: standardSchemaResolver(heightSchema),
  });

  const { isLoading } = useQuery(
    supabase
      .from("t_user")
      .select("id, height")
      .eq("id", session?.user.id ?? "")
      .maybeSingle(),
    {
      onSuccess: ({ data }) => {
        if (data?.height) {
          setValue("height", data.height);
        }
      },
    },
  );

  const { trigger } = useUpdateMutation(supabase.from("t_user"), ["id"], "*", {
    onSuccess: () => {
      router.back();
    },
    onError: () => {
      toast.error(t("settings:profile.height.error"));
    },
    revalidate: true,
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!session) {
        return;
      }

      await trigger({ id: session.user.id, height: data.height });
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
            name="height"
            control={control}
            render={({ field: { onChange, value } }) => (
              <YStack gap="$1.5">
                <XStack>
                  <Label htmlFor="height" unstyled color="$color">
                    {t("profile.height.label")}
                  </Label>
                  <Text color="$destructiveBackground">*</Text>
                </XStack>
                <XStack position="relative" items="center">
                  <Input
                    placeholder={t("profile.height.placeholder")}
                    value={value?.toString()}
                    onChangeText={onChange}
                    inputMode="numeric"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    disabled={isLoading}
                  />
                  <Text
                    position="absolute"
                    r="$4"
                    fontSize="$sm"
                    color="$mutedColor"
                  >
                    cm
                  </Text>
                </XStack>
                <View px="$1">
                  {errors.height && (
                    <Text px="$1" fontSize="$sm" color="$destructiveBackground">
                      {t(`profile.height.${errors.height.message}`)}
                    </Text>
                  )}
                </View>
              </YStack>
            )}
          />
          <KeyboardStickyView offset={{ opened: 10 }}>
            <YStack gap="$3">
              <Form.Trigger asChild>
                <Button variant="primary">
                  <Button.Text>{t("profile.height.submit")}</Button.Text>
                </Button>
              </Form.Trigger>
              <Button
                variant="ghost"
                onPress={() => {
                  Keyboard.dismiss();
                  router.back();
                }}
              >
                <Button.Text>{t("profile.height.cancel")}</Button.Text>
              </Button>
            </YStack>
          </KeyboardStickyView>
        </Form>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default HeightPage;
