import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Link, useRouter } from "expo-router";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { Form, H1, Label, Text, View, XStack, YStack } from "tamagui";
import type { z } from "zod/v4";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { setupSchema } from "@/schemas/app";

const nameSchema = setupSchema.pick({ name: true });
type FormData = z.infer<typeof nameSchema>;

const NamePage = () => {
  const { t } = useTranslation("setup");
  const router = useRouter();
  const { setValue } = useFormContext<FormData>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(nameSchema),
  });

  const onSubmit = (data: FormData) => {
    router.push("/setup/gender");
    setValue("name", data.name);

    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} pt="$8" px="$8" gap="$8">
          <YStack gap="$1">
            <H1 fontSize="$2xl" fontWeight="bold">
              {t("name.title")}
            </H1>
            <Text color="$mutedColor">{t("name.description")}</Text>
          </YStack>
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
                    <Label htmlFor="name">{t("name.label")}</Label>
                    <Text color="$destructiveBackground">*</Text>
                  </XStack>
                  <Input
                    placeholder={t("name.placeholder")}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                  />
                  <XStack items="center" justify="space-between" px="$1">
                    {errors.name ? (
                      <Text
                        px="$1"
                        fontSize="$sm"
                        color="$destructiveBackground"
                      >
                        {t(`name.${errors.name.message}`)}
                      </Text>
                    ) : (
                      <View />
                    )}
                    <Text fontSize="$sm" color="$mutedColor">
                      {value.length} / 24
                    </Text>
                  </XStack>
                </YStack>
              )}
            />
            <KeyboardStickyView offset={{ opened: 10 }}>
              <YStack gap="$4">
                <Form.Trigger asChild>
                  <Button variant="primary">
                    <Button.Text>{t("name.submit")}</Button.Text>
                  </Button>
                </Form.Trigger>
                <Link href="/setup/gender" asChild>
                  <Button variant="link" onPress={Keyboard.dismiss}>
                    <Button.Text>{t("name.skip")}</Button.Text>
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

export default NamePage;
