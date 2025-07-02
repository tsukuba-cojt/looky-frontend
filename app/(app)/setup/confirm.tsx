import { useInsertMutation } from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native";
import { toast } from "sonner-native";
import { Form, H1, Spinner, Text, View, XStack, YStack } from "tamagui";
import type z from "zod/v4";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/client";
import type { setupSchema } from "@/schemas/app";

type FormData = z.infer<typeof setupSchema>;

const ConfirmPage = () => {
  const { t } = useTranslation("setup");
  const { session } = useAuth();
  const router = useRouter();
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const { setValue, handleSubmit } = useFormContext<FormData>();

  useEffect(() => {
    if (uri) {
      setValue("bodyUrl", uri);
    }
  }, [uri, setValue]);

  const { trigger, isMutating } = useInsertMutation(
    supabase.from("t_user"),
    ["id"],
    "*",
    {
      onSuccess: () => {
        router.push("/");
      },
      onError: () => {
        toast.error(t("avatar.error"));
      },
      revalidate: true,
    },
  );

  const onSubmit = (data: FormData) => {
    if (!session) {
      return;
    }

    trigger([
      {
        id: session.user.id,
        name: data.name,
        gender: data.gender,
        avatar_url: data.avatarUrl,
        body_url: uri,
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Form
        flex={1}
        px="$8"
        pt="$8"
        justify="space-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <YStack items="center" gap="$8">
          <H1 fontSize="$xl" fontWeight="$bold" text="center">
            {t("body.confirm.title")}
          </H1>
          <View
            w="95%"
            aspectRatio={3 / 4}
            rounded="$3xl"
            boxShadow="$sm"
            overflow="hidden"
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              source={uri}
              transition={200}
            />
          </View>
          <YStack gap="$3">
            <XStack gap="$1" items="center">
              <Icons.checkCircle size="$3.5" color="$primaryBackground" />
              <Text color="$mutedColor">{t("body.confirm.requirement1")}</Text>
            </XStack>
            <XStack gap="$1" items="center">
              <Icons.checkCircle size="$3.5" color="$primaryBackground" />
              <Text color="$mutedColor">{t("body.confirm.requirement2")}</Text>
            </XStack>
            <XStack gap="$1" items="center">
              <Icons.checkCircle size="$3.5" color="$primaryBackground" />
              <Text color="$mutedColor">{t("body.confirm.requirement3")}</Text>
            </XStack>
            <XStack gap="$1" items="center">
              <Icons.checkCircle size="$3.5" color="$primaryBackground" />
              <Text color="$mutedColor">{t("body.confirm.requirement4")}</Text>
            </XStack>
          </YStack>
        </YStack>
        <YStack gap="$3">
          <Form.Trigger asChild>
            <Button variant="primary">
              {isMutating ? (
                <Button.Icon>
                  <Spinner color="white" />
                </Button.Icon>
              ) : (
                <Button.Text fontWeight="$bold">
                  {t("body.confirm.done")}
                </Button.Text>
              )}
            </Button>
          </Form.Trigger>
          <Button
            variant="link"
            onPress={() =>
              router.push({
                pathname: "/camera",
                params: {
                  from: "/setup/body/confirm",
                },
              })
            }
          >
            <Button.Text>{t("body.confirm.redo")}</Button.Text>
          </Button>
        </YStack>
      </Form>
    </SafeAreaView>
  );
};

export default ConfirmPage;
