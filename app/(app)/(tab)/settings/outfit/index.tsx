import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { FlashList } from "@shopify/flash-list";
import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-swr";
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
import { useDownload } from "@/hooks/useDownload";
import { useUpload } from "@/hooks/useUpload";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";

const outfitsSchema = z.object({
  outfits: z
    .array(
      z.object({ id: z.string(), uri: z.string(), origin: z.enum(origins) }),
    )
    .nonempty({ error: "required_error" }),
});
type FormData = z.infer<typeof outfitsSchema>;

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
  const { fields, append, remove } = useFieldArray<FormData>({
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
        await Promise.all(
          (data ?? []).map(async (outfit) => {
            const uri = await download({
              objectKey: `${outfit.id}.jpg`,
              bucketName: "looky-body-images",
            });

            append({
              id: outfit.id.toString(),
              uri,
              origin: "remote",
            });
          }),
        );
      },
    },
  );

  const { trigger: download, isMutating } = useDownload();
  const { trigger: upload } = useUpload();

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

  useFocusEffect(
    useCallback(() => {
      if (uri) {
        append({ id: Crypto.randomUUID(), uri, origin: "local" });
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
            R.map(data.outfits, R.prop("id")),
          ),
          R.map(async (id) => {
            await deleteBody({ id });
          }),
        ),
      );

      const ids = await Promise.all(
        R.pipe(
          R.filter(data.outfits, (outfit) => outfit.origin === "local"),
          R.map(async (outfit) => {
            const context = ImageManipulator.manipulate(outfit.uri);
            const image = await context.renderAsync();
            const result = await image.saveAsync({
              format: SaveFormat.JPEG,
            });

            const blob = await (await fetch(result.uri)).blob();

            await upload({
              blob,
              bucketName: "looky-body-images",
              objectKey: `${outfit.id}.jpg`,
            });

            return outfit.id;
          }),
        ),
      );

      await insertBody(
        ids.map((id) => ({ id, user_id: session?.user.id ?? "" })),
      );

      router.back();
    },
    [deleteBody, insertBody, outfits, router, session, upload],
  );

  return (
    <View flex={1} pt="$8" pb={insets.bottom} px="$8">
      <Form flex={1} justify="space-between" onSubmit={handleSubmit(onSubmit)}>
        {isLoading || isMutating ? (
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
                {item ? (
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
                      source={item.uri}
                      transition={200}
                    />
                    <View position="absolute" t={8} r={8}>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => remove(index)}
                      >
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
                ) : (
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
                )}
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
