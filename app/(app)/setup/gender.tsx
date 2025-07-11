import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Adapt, Form, H1, Label, Text, View, XStack, YStack } from "tamagui";
import { z } from "zod/v4";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { Select } from "@/components/Select";
import { Sheet } from "@/components/Sheet";
import { genders } from "@/constants";

const genderSchema = z.object({
  gender: z.enum(genders, { error: "required_error" }),
});
type FormData = z.infer<typeof genderSchema>;

const GenderPage = () => {
  const { t } = useTranslation(["common", "setup"]);
  const router = useRouter();
  const [position, setPosition] = useState(0);
  const { getValues, setValue } = useFormContext<FormData>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(genderSchema),
    defaultValues: { gender: getValues("gender") },
  });

  const onSubmit = (data: FormData) => {
    router.push("/setup/avatar");
    setValue("gender", data.gender);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} pt="$8" px="$8" gap="$8">
        <YStack gap="$1">
          <H1 fontSize="$2xl" fontWeight="bold">
            {t("setup:gender.title")}
          </H1>
          <Text color="$mutedColor">{t("setup:gender.description")}</Text>
        </YStack>
        <Form
          flex={1}
          justify="space-between"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="gender"
            control={control}
            render={({ field: { onChange, value } }) => (
              <YStack gap="$1.5">
                <XStack>
                  <Label htmlFor="gender">{t("setup:gender.label")}</Label>
                  <Text color="$destructiveBackground">*</Text>
                </XStack>
                <Select
                  value={value ?? undefined}
                  onValueChange={onChange}
                  disablePreventBodyScroll
                >
                  <Select.Trigger iconAfter={Icons.chevronDown}>
                    <Select.Value placeholder={t("setup:gender.placeholder")} />
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
                      <Sheet.Frame
                        flex={1}
                        px="$6"
                        py="$8"
                        justify="space-between"
                      >
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
                              bg={
                                isActive ? "$accentBackground" : "transparent"
                              }
                            >
                              <Select.ItemText
                                color={
                                  isActive ? "$accentColor" : "$mutedColor"
                                }
                                fontSize="$sm"
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
                      {t(`setup:gender.${errors.gender.message}`)}
                    </Text>
                  ) : (
                    <View />
                  )}
                </XStack>
              </YStack>
            )}
          />
          <YStack gap="$3">
            <Form.Trigger asChild>
              <Button variant="primary">
                <Button.Text>{t("setup:gender.submit")}</Button.Text>
              </Button>
            </Form.Trigger>
            <Link href="/setup/avatar" asChild>
              <Button variant="ghost">
                <Button.Text>{t("setup:gender.skip")}</Button.Text>
              </Button>
            </Link>
          </YStack>
        </Form>
      </YStack>
    </SafeAreaView>
  );
};

export default GenderPage;
