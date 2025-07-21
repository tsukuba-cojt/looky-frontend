import {
  useInsertMutation,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { useUpload } from "@supabase-cache-helpers/storage-swr";
import * as Crypto from "expo-crypto";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { Form, H1, Spinner, Text, YStack } from "tamagui";
import type z from "zod/v4";
import { Button } from "@/components/Button";
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

  const { trigger: insertUser } = useInsertMutation(
    supabase.from("t_user"),
    ["id"],
    "*",
    {
      onError: (error) => {
        console.error(error);
        toast.error(t("welcome.error"));
      },
    },
  );

  const { trigger: updateUser } = useUpdateMutation(
    supabase.from("t_user"),
    ["id"],
    "*",
    {
      onSuccess: () => {
        router.push("/loading");
      },
      onError: () => {
        toast.error(t("welcome.error"));
      },
      revalidate: true,
    },
  );

  const { trigger: insertTask } = useInsertMutation(
    supabase.from("t_task"),
    ["id"],
    "*",
    {
      onError: (error) => {
        console.error(error);
        toast.error(t("welcome.error"));
      },
    },
  );

  const { trigger: insertBody } = useInsertMutation(
    supabase.from("t_body"),
    ["id"],
    "*",
    {
      onError: (error) => {
        console.error(error);
        toast.error(t("welcome.error"));
      },
    },
  );

  const { trigger: uploadAvatar } = useUpload(supabase.storage.from("avatar"), {
    onError: (error) => {
      console.error(error);
      toast.error(t("welcome.error"));
    },
  });
  const { trigger: uploadBody } = useUpload(supabase.storage.from("body"), {
    onError: (error) => {
      console.error(error);
      toast.error(t("welcome.error"));
    },
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (data.avatar) {
        const arrayBuffer = await (await fetch(data.avatar.uri)).arrayBuffer();
        const file = {
          data: arrayBuffer,
          name: `${session?.user.id}.jpg`,
          type: "image/jpeg",
        };
        await uploadAvatar({ files: [file] });
      }

      const files = await Promise.all(
        data.outfits.map(async (outfit) => {
          const arrayBuffer = await (await fetch(outfit.uri)).arrayBuffer();
          const file = {
            data: arrayBuffer,
            name: `${outfit.key}.jpg`,
            type: "image/jpeg",
          };

          return file;
        }),
      );
      await uploadBody({ path: session?.user.id, files });

      await insertUser([
        {
          id: session?.user.id,
          name: data.name,
          gender: data.gender,
        },
      ]);

      await insertBody(
        data.outfits.map((outfit) => ({
          id: outfit.key,
          user_id: session?.user.id,
        })),
      );

      await updateUser({ id: session?.user.id, body_id: data.outfits[0].key });

      await insertTask(
        Array.from({ length: 3 }, () => ({
          id: Crypto.randomUUID(),
          user_id: session?.user.id ?? "",
          part: "Upper-body",
          status: "pending",
        })),
      );
    },
    [
      insertBody,
      insertTask,
      insertUser,
      session,
      uploadAvatar,
      uploadBody,
      updateUser,
    ],
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
