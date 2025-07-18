import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { FlashList } from "@shopify/flash-list";
import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import { useFileUrl, useUpload } from "@supabase-cache-helpers/storage-swr";
import * as Crypto from "expo-crypto";
import { Image } from "expo-image";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as R from "remeda";
import { toast } from "sonner-native";
import { Form, Spinner, Text, View, YStack } from "tamagui";
import { z } from "zod/v4";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { Skeleton } from "@/components/Skeleton";
import { origins } from "@/constants";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";

const outfitsSchema = z.object({
  outfits: z
    .array(
      z.object({
        key: z.string(),
        uri: z.string().nullable(),
        origin: z.enum(origins),
      }),
    )
    .nonempty({ error: "required_error" }),
});
type FormData = z.infer<typeof outfitsSchema>;

type BodyItemProps = {
  body: FormData["outfits"][number] | null;
  onDelete: () => void;
};

const BodyItem = ({ body, onDelete }: BodyItemProps) => {
  const session = useSessionStore((state) => state.session);
  const { data: url, isLoading } = useFileUrl(
    supabase.storage.from("body"),
    body && body.origin === "remote"
      ? `${session?.user.id}/${body.key}.jpg`
      : null,
    "private",
    {
      ensureExistence: true,
      expiresIn: 3600,
    },
  );

  if (isLoading) {
    return (
      <Skeleton w="100%" aspectRatio={3 / 4} rounded="$2xl" boxShadow="$sm" />
    );
  }

  if (!body) {
    return (
      <Link
        href={{
          pathname: "/camera",
          params: {
            from: "/settings/outfit",
          },
        }}
        asChild
      >
        <TouchableOpacity activeOpacity={0.6}>
          <View
            w="100%"
            aspectRatio={3 / 4}
            items="center"
            justify="center"
            rounded="$2xl"
            boxShadow="$sm"
            overflow="hidden"
            borderStyle="dashed"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <View p="$4" bg="$mutedBackground" rounded="$full">
              <Icons.camera size="$6" color="$mutedColor" />
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <View
      position="relative"
      w="100%"
      aspectRatio={3 / 4}
      rounded="$2xl"
      boxShadow="$sm"
      overflow="hidden"
      bg="$mutedBackground"
    >
      <Image
        style={{
          width: "100%",
          height: "100%",
        }}
        source={url ?? body.uri}
        transition={200}
      />
      <View position="absolute" t={8} r={8}>
        <TouchableOpacity activeOpacity={0.6} onPress={onDelete}>
          <View
            p="$2"
            items="center"
            justify="center"
            bg="black"
            rounded="$full"
            opacity={0.8}
            boxShadow="$shadow.xl"
          >
            <Icons.x size="$4" color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const GalleryPage = () => {
  const { t } = useTranslation("settings");
  const session = useSessionStore((state) => state.session);
  const router = useRouter();
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  const insets = useSafeAreaInsets();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    resolver: standardSchemaResolver(outfitsSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "outfits",
  });

  const { data: outfits, isLoading } = useQuery(
    supabase
      .from("t_body")
      .select("id")
      .eq("user_id", session?.user.id ?? ""),
    {
      onSuccess: async ({ data }) => {
        if (!data) {
          return;
        }

        append(
          data.map((outfit) => ({
            key: outfit.id,
            uri: null,
            origin: "remote",
          })),
        );
      },
    },
  );

  const { trigger: updateUser } = useUpdateMutation(
    supabase.from("t_user"),
    ["id"],
    "*",
    {
      onError: () => {
        toast.error(t("outfit.gallery.error"));
      },
    },
  );

  const { trigger: insertBody } = useInsertMutation(
    supabase.from("t_body"),
    ["id"],
    "*",
    {
      onError: () => {
        toast.error(t("outfit.gallery.error"));
      },
    },
  );

  const { trigger: deleteBody } = useDeleteMutation(
    supabase.from("t_body"),
    ["id"],
    "*",
    {
      onError: () => {
        toast.error(t("outfit.gallery.error"));
      },
    },
  );

  const { trigger: uploadBody } = useUpload(supabase.storage.from("body"));

  useFocusEffect(
    useCallback(() => {
      if (uri) {
        append({ key: Crypto.randomUUID(), uri, origin: "local" });
        router.setParams({ uri: undefined });
      }
    }, [uri, append, router]),
  );

  const onSubmit = useCallback(
    async (data: FormData) => {
      await Promise.all(
        R.pipe(
          R.difference(
            R.map(outfits ?? [], R.prop("id")),
            R.map(data.outfits, R.prop("key")),
          ),
          R.map(async (id) => {
            await deleteBody({ id });
          }),
        ),
      );

      const files = await Promise.all(
        R.pipe(
          data.outfits,
          R.filter((outfit) => outfit.origin === "local"),
          R.map(async (outfit) => {
            const context = ImageManipulator.manipulate(outfit.uri as string);
            const image = await context.renderAsync();
            const result = await image.saveAsync({
              format: SaveFormat.JPEG,
            });

            const arrayBuffer = await (await fetch(result.uri)).arrayBuffer();
            const file = {
              data: arrayBuffer,
              name: `${outfit.key}.jpg`,
              type: "image/jpeg",
            };

            return file;
          }),
        ),
      );
      await uploadBody({ path: session?.user.id, files });

      await insertBody(
        R.pipe(
          R.filter(data.outfits, (outfit) => outfit.origin === "local"),
          R.map((outfit) => ({
            id: outfit.key,
            user_id: session?.user.id ?? "",
          })),
        ),
      );

      await updateUser({ id: session?.user.id, body_id: data.outfits[0].key });

      router.back();
    },
    [deleteBody, insertBody, outfits, router, session, updateUser, uploadBody],
  );

  return (
    <View flex={1} pt="$8" pb={insets.bottom} px="$8">
      <Form flex={1} justify="space-between" onSubmit={handleSubmit(onSubmit)}>
        {isLoading ? (
          <FlashList
            numColumns={2}
            scrollEnabled={false}
            data={Array.from({ length: 4 })}
            renderItem={({ index }) => (
              <View
                pt={index > 1 ? 20 : 0}
                pl={index % 2 === 1 ? 10 : 0}
                pr={index % 2 === 0 ? 10 : 0}
              >
                <Skeleton
                  w="100%"
                  aspectRatio={3 / 4}
                  rounded="$2xl"
                  boxShadow="$sm"
                />
              </View>
            )}
          />
        ) : (
          <FlashList
            numColumns={2}
            scrollEnabled={false}
            data={Array(4)
              .fill(null)
              .map((_, i) => fields[i] ?? null)}
            ListFooterComponent={
              errors.outfits && (
                <Text
                  mt="$4"
                  text="center"
                  fontSize="$sm"
                  color="$destructiveBackground"
                >
                  {t(`outfit.gallery.${errors.outfits.message}`)}
                </Text>
              )
            }
            renderItem={({ item, index }) => (
              <View
                pt={index > 1 ? 20 : 0}
                pl={index % 2 === 1 ? 10 : 0}
                pr={index % 2 === 0 ? 10 : 0}
              >
                <BodyItem body={item} onDelete={() => remove(index)} />
              </View>
            )}
          />
        )}
        <YStack gap="$3">
          <Form.Trigger asChild disabled={isSubmitting}>
            <Button variant="primary">
              {isSubmitting ? (
                <Button.Icon>
                  <Spinner color="white" />
                </Button.Icon>
              ) : (
                <Button.Text>{t("outfit.gallery.submit")}</Button.Text>
              )}
            </Button>
          </Form.Trigger>
          <Button variant="ghost" onPress={router.back}>
            <Button.Text>{t("outfit.gallery.cancel")}</Button.Text>
          </Button>
        </YStack>
      </Form>
    </View>
  );
};

export default GalleryPage;
