import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Adapt,
  Form,
  H1,
  Label,
  Sheet,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import type { z } from "zod/v4";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { Select } from "@/components/Select";
import { setupSchema } from "@/schemas/app";

const genderSchema = setupSchema.pick({ gender: true });
type FormData = z.infer<typeof genderSchema>;

const GenderPage = () => {
  const { t } = useTranslation("setup");
  const router = useRouter();
  const [position, setPosition] = useState(0);
  const { setValue } = useFormContext<FormData>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(genderSchema),
  });

  const onSubmit = (data: FormData) => {
    router.push("/setup/avatar");
    setValue("gender", data.gender);

    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} pt="$8" px="$8" gap="$8">
          <YStack gap="$1">
            <H1 fontSize="$2xl" fontWeight="bold">
              {t("gender.title")}
            </H1>
            <Text color="$mutedColor">{t("gender.description")}</Text>
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
                    <Label htmlFor="gender">{t("gender.label")}</Label>
                    <Text color="$destructiveBackground">*</Text>
                  </XStack>
                  <Select
                    value={value}
                    onValueChange={onChange}
                    disablePreventBodyScroll
                  >
                    <Select.Trigger iconAfter={Icons.chevronDown}>
                      <Select.Value placeholder={t("gender.placeholder")} />
                    </Select.Trigger>

                    <Adapt when="maxMd" platform="touch">
                      <Sheet
                        modal
                        snapPoints={[28]}
                        position={position}
                        onPositionChange={setPosition}
                        dismissOnSnapToBottom
                      >
                        <Sheet.Overlay
                          bg="black"
                          opacity={0.5}
                          enterStyle={{ opacity: 0 }}
                          exitStyle={{ opacity: 0 }}
                        />
                        <Sheet.Handle h="$1" mx="40%" />
                        <Sheet.Frame
                          flex={1}
                          justify="space-between"
                          px="$6"
                          py="$8"
                          borderTopLeftRadius="$4xl"
                          borderTopRightRadius="$4xl"
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
                          {genderSchema.shape.gender
                            .unwrap()
                            .options.map((option, index) => {
                              const isActive = value === option;

                              return (
                                <Select.Item
                                  key={index.toString()}
                                  index={index}
                                  value={option}
                                  w="100%"
                                  rounded="$sm"
                                  pl="$2"
                                  pr="$8"
                                  py="$1.5"
                                  bg={
                                    isActive
                                      ? "$accentBackground"
                                      : "transparent"
                                  }
                                  select="none"
                                >
                                  <Select.ItemText
                                    color={
                                      isActive ? "$accentColor" : "$mutedColor"
                                    }
                                    fontSize="$sm"
                                  >
                                    {t(`gender.${option}`)}
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
                      <Text
                        px="$1"
                        fontSize="$sm"
                        color="$destructiveBackground"
                      >
                        {t(`gender.${errors.gender.message}`)}
                      </Text>
                    ) : (
                      <View />
                    )}
                  </XStack>
                </YStack>
              )}
            />
            <KeyboardStickyView offset={{ opened: 10 }}>
              <YStack gap="$4">
                <Form.Trigger asChild>
                  <Button variant="primary">
                    <Button.Text>{t("gender.submit")}</Button.Text>
                  </Button>
                </Form.Trigger>
                <Link href="/setup/avatar" asChild>
                  <Button variant="link" onPress={Keyboard.dismiss}>
                    <Button.Text>{t("gender.skip")}</Button.Text>
                  </Button>
                </Link>
              </YStack>
            </KeyboardStickyView>
          </Form>
        </YStack>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default GenderPage;
