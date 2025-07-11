import { useInsertMutation } from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native";
import { toast } from "sonner-native";
import { Form, H1, Spinner, Text, YStack } from "tamagui";
import type z from "zod/v4";
import { Button } from "@/components/Button";
import { useUpload } from "@/hooks/useUpload";
import { supabase } from "@/lib/client";
import type { setupSchema } from "@/schemas/app";
import { useSessionStore } from "@/stores/useSessionStore";

type FormData = z.infer<typeof setupSchema>;

const WelcomePage = memo(() => {
  const { t } = useTranslation("setup");
  const router = useRouter();
  const session = useSessionStore((state) => state.session);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<FormData>();

  const { trigger: upload } = useUpload();

  const { trigger: createUser } = useInsertMutation(
    supabase.from("t_user"),
    ["id"],
    "*",
    {
      onSuccess: () => {
        router.replace("/loading");
      },
      onError: () => {
        toast.error(t("welcome.error"));
      },
      revalidate: true,
    },
  );

  const { trigger: createTask } = useInsertMutation(
    supabase.from("t_task"),
    ["id"],
    "*",
    {
      onError: () => {
        toast.error(t("welcome.error"));
      },
    },
  );

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (data.avatar) {
        const blob = await (await fetch(data.avatar.uri)).blob();
        await upload({
          blob,
          bucketName: "looky-avatar-images",
          objectKey: `${data.avatar.id}.jpg`,
        });
      }

      await Promise.all(
        data.outfits.map(async (outfit) => {
          const blob = await (await fetch(outfit.uri)).blob();
          await upload({
            blob,
            bucketName: "looky-body-images",
            objectKey: `${outfit.id}.jpg`,
          });
        }),
      );

      await createUser([
        {
          id: session?.user.id ?? "",
          name: data.name,
          gender: data.gender,
          avatar_url: data.avatar ? `${data.avatar.id}.jpg` : null,
          body_url: `${data.outfits[0].uri}.jpg`,
        },
      ]);

      await createTask(
        Array.from({ length: 3 }, () => ({
          user_id: session?.user.id ?? "",
          status: "pending",
        })),
      );
    },
    [createTask, createUser, session, upload],
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Form
        flex={1}
        px="$8"
        pt="$24"
        pb="$6"
        justify="space-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <YStack items="center" gap="$12">
          <Image
            style={{ width: 300, height: 300 }}
            source={require("../../../assets/images/welcome.png")}
            transition={200}
          />
          <YStack gap="$6">
            <H1
              fontSize="$2xl"
              lineHeight="$2xl"
              fontWeight="$bold"
              text="center"
            >
              {t("welcome.title")}
            </H1>
            <Text text="center" color="$mutedColor">
              {t("welcome.description")}
            </Text>
          </YStack>
        </YStack>
        <YStack gap="$3">
          <Form.Trigger asChild>
            <Button variant="primary">
              {isSubmitting ? (
                <Button.Icon>
                  <Spinner color="white" />
                </Button.Icon>
              ) : (
                <Button.Text>{t("welcome.get_started")}</Button.Text>
              )}
            </Button>
          </Form.Trigger>
          <Text fontSize="$xs" color="$placeholderColor" text="center">
            {t("welcome.note")}
          </Text>
        </YStack>
      </Form>
    </SafeAreaView>
  );
});

export default WelcomePage;
