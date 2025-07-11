import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Stack } from "expo-router";
import { memo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type z from "zod/v4";
import { setupSchema } from "@/schemas/app";

type FormData = z.infer<typeof setupSchema>;

const SetupLayout = memo(() => {
  const methods = useForm<FormData>({
    resolver: standardSchemaResolver(setupSchema),
  });

  return (
    <FormProvider {...methods}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="gender" />
        <Stack.Screen name="avatar" />
        <Stack.Screen name="outfit" />
        <Stack.Screen name="welcome" />
      </Stack>
    </FormProvider>
  );
});

export default SetupLayout;
