import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { useRouter } from "expo-router";
import { memo, useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import {
  Adapt,
  Form,
  getFontSize,
  Label,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import type { z } from "zod/v4";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { Select } from "@/components/Select";
import { Sheet } from "@/components/Sheet";
import { Skeleton } from "@/components/Skeleton";
import { genders } from "@/constants";
import { supabase } from "@/lib/client";
import { profileSchema } from "@/schemas/app";
import { useSessionStore } from "@/stores/useSessionStore";
import type { Gender } from "@/types";

const genderSchema = profileSchema.pick({ gender: true });
type FormData = z.infer<typeof genderSchema>;

const GenderPage = memo(() => {
  const { t } = useTranslation(["common", "settings"]);
  const session = useSessionStore((state) => state.session);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [position, setPosition] = useState(0);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(genderSchema),
  });

  const { isLoading } = useQuery(
    supabase
      .from("t_user")
      .select("id, gender")
      .eq("id", session?.user.id ?? "")
      .maybeSingle(),
    {
      onSuccess: ({ data }) => {
        if (data?.gender) {
          setValue("gender", data.gender as Gender);
        }
      },
    },
  );

  const { trigger } = useUpdateMutation(supabase.from("t_user"), ["id"], "*", {
    onSuccess: () => {
      router.back();
    },
    onError: () => {
      toast.error(t("settings:profile.gender.error"));
    },
    revalidate: true,
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!session) {
        return;
      }

      await trigger({ id: session.user.id, gender: data.gender });
    },
    [session, trigger],
  );

  return (
    <View flex={1} pt="$8" pb={insets.bottom} px="$8">
      <Form flex={1} justify="space-between" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="gender"
          control={control}
          render={({ field: { onChange, value } }) => (
            <YStack gap="$1.5">
              <XStack>
                <Label htmlFor="gender">
                  {t("settings:profile.gender.label")}
                </Label>
                <Text color="$destructiveBackground">*</Text>
              </XStack>
              <Select
                value={value ?? undefined}
                onValueChange={onChange}
                disablePreventBodyScroll
              >
                <Select.Trigger
                  iconAfter={Icons.chevronDown}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Skeleton w="$16" h={getFontSize("$md")} rounded="$full" />
                  ) : (
                    <Select.Value
                      placeholder={t("settings:profile.gender.placeholder")}
                    />
                  )}
                </Select.Trigger>

                <Adapt when="maxMd" platform="touch">
                  <Sheet
                    modal
                    snapPoints={[28]}
                    position={position}
                    onPositionChange={setPosition}
                    dismissOnSnapToBottom
                    animation="quick"
                  >
                    <Sheet.Overlay />
                    <Sheet.Handle />
                    <Sheet.Frame flex={1} px="$6" py="$8">
                      <Sheet.ScrollView>
                        <Adapt.Contents />
                      </Sheet.ScrollView>
                    </Sheet.Frame>
                  </Sheet>
                </Adapt>

                <Select.Content>
                  <Select.ScrollUpButton />
                  <Select.Viewport>
                    <Select.Group>
                      <Select.Label />
                      {genders.map((option, index) => {
                        const isActive = value === option;

                        return (
                          <Select.Item
                            key={index.toString()}
                            index={index}
                            value={option}
                            bg={isActive ? "$accentBackground" : "transparent"}
                          >
                            <Select.ItemText
                              color={isActive ? "$accentColor" : "$mutedColor"}
                            >
                              {t(`common:gender.${option}`)}
                            </Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <Icons.check size="$4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        );
                      })}
                    </Select.Group>
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select>
              <XStack items="center" justify="space-between" px="$1">
                {errors.gender ? (
                  <Text px="$1" fontSize="$sm" color="$destructiveBackground">
                    {t(`settings:profile.gender.${errors.gender.message}`)}
                  </Text>
                ) : (
                  <View />
                )}
              </XStack>
            </YStack>
          )}
        />
        <YStack gap="$3">
          <Form.Trigger asChild disabled={isSubmitting}>
            <Button variant="primary">
              {isSubmitting ? (
                <Button.Icon>
                  <Spinner color="white" />
                </Button.Icon>
              ) : (
                <Button.Text>{t("settings:profile.gender.submit")}</Button.Text>
              )}
            </Button>
          </Form.Trigger>
          <Button variant="ghost" onPress={router.back}>
            <Button.Text>{t("settings:profile.gender.cancel")}</Button.Text>
          </Button>
        </YStack>
      </Form>
    </View>
  );
});

export default GenderPage;
