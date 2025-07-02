import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type z from "zod/v4";
import { setupSchema } from "@/schemas/app";

type FormData = z.infer<typeof setupSchema>;

const SetupLayout = () => {
  const { t } = useTranslation("setup");
  const methods = useForm<FormData>({
    resolver: standardSchemaResolver(setupSchema),
    defaultValues: {
      name: t("unset"),
    },
  });

  return (
    <FormProvider {...methods}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="gender" />
        <Stack.Screen name="avatar" />
        <Stack.Screen name="body" />
        <Stack.Screen name="confirm" />
      </Stack>
    </FormProvider>
  );
};

export default SetupLayout;
