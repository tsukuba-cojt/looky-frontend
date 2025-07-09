import { useInsertMutation } from "@supabase-cache-helpers/postgrest-swr";
import { File } from "expo-file-system/next";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native";
import { toast } from "sonner-native";
import { Form, H1, Spinner, Text, View, YStack } from "tamagui";
import type z from "zod/v4";
import { Button } from "@/components/Button";
import { supabase } from "@/lib/client";
import type { setupSchema } from "@/schemas/app";
import { useSessionStore } from "@/stores/useSessionStore";

type FormData = z.infer<typeof setupSchema>;

const WelcomePage = () => {
  const { t } = useTranslation("setup");
  const router = useRouter();
  const session = useSessionStore((state) => state.session);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<FormData>();

  const { trigger } = useInsertMutation(supabase.from("t_user"), ["id"], "*", {
    onSuccess: () => {
      router.push("/loading");
    },
    onError: () => {
      toast.error(t("welcome.error"));
    },
    revalidate: true,
  });

  const onSubmit = async (data: FormData) => {
    if (!session) {
      return;
    }

    let avatarUrl: string;

    try {
      const context = ImageManipulator.manipulate(data.avatar.uri);
      const image = await context.renderAsync();
      const result = await image.saveAsync({
        format: SaveFormat.JPEG,
      });

      const file = new File(result.uri);
      const blob = file.blob();

      const objectKey = `${data.avatar.id}.jpg`;

      const {
        data: { url },
        error,
      } = await supabase.functions.invoke("upload", {
        method: "POST",
        body: {
          bucket_name: "looky-avatar-images",
          object_key: objectKey,
          content_type: blob.type,
        },
      });

      if (error) {
        throw error;
      }

      const response = await fetch(url, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": blob.type,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      avatarUrl = objectKey;
    } catch {
      toast.error(t("welcome.error"));
      return;
    }

    let bodyUrls: string[];

    try {
      const objectKeys = await Promise.all(
        data.outfits.map(async ({ id, uri }) => {
          const context = ImageManipulator.manipulate(uri);
          const image = await context.renderAsync();
          const result = await image.saveAsync({
            format: SaveFormat.JPEG,
          });

          const file = new File(result.uri);
          const blob = file.blob();

          const objectKey = `${id}.jpg`;

          const {
            data: { url },
            error,
          } = await supabase.functions.invoke("upload", {
            method: "POST",
            body: {
              bucket_name: "looky-body-images",
              object_key: objectKey,
              content_type: blob.type,
            },
          });

          if (error) {
            throw error;
          }

          const response = await fetch(url, {
            method: "PUT",
            body: blob,
            headers: {
              "Content-Type": blob.type,
            },
          });

          if (!response.ok) {
            const text = await response.text();
            throw new Error(text);
          }

          return objectKey;
        })
      );

      bodyUrls = objectKeys;
    } catch {
      toast.error(t("welcome.error"));
      return;
    }

    await trigger([
      {
        id: session.user.id,
        name: data.name,
        gender: data.gender,
        avatar_url: avatarUrl,
        body_url: bodyUrls[0],
      },
    ]);
  };

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
          <View
            w={300}
            h={300}
            bg="$primaryBackground"
            rounded="$full"
            overflow="hidden"
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
                <Button.Text fontWeight="$bold">
                  {t("welcome.get_started")}
                </Button.Text>
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
};

export default WelcomePage;
