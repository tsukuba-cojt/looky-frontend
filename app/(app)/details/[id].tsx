import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
  useRevalidateTables,
} from "@supabase-cache-helpers/postgrest-swr";
import { useFileUrl } from "@supabase-cache-helpers/storage-swr";
import * as Crypto from "expo-crypto";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { H1, ScrollView, Text, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Heart } from "@/components/Heart";
import { Icons } from "@/components/Icons";
import { Skeleton } from "@/components/Skeleton";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";

const DetailsPage = memo(() => {
  const { t } = useTranslation("details");
  const session = useSessionStore((state) => state.session);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data,
    mutate,
    isLoading: isLoadingClothes,
  } = useQuery(
    supabase
      .from("t_clothes")
      .select(`      
        id,
        title,
        description,
        category,
        purchase_url,
        like: t_like (count)
      `)
      .eq("like.user_id", session?.user.id ?? "")
      .eq("id", Number(id))
      .maybeSingle(),
  );

  const revalidateTables = useRevalidateTables([
    { schema: "public", table: "t_clothes" },
    { schema: "public", table: "t_like" },
  ]);

  const { trigger: insertLike } = useInsertMutation(
    supabase.from("t_like"),
    ["id"],
    "*",
    {
      onSuccess: async () => {
        // @ts-expect-error
        await mutate((prev) => {
          if (!prev) {
            return;
          }

          return { ...prev, data: { ...prev.data, like: [{ count: 1 }] } };
        });

        await revalidateTables();
      },
      onError: () => {
        toast.error(t("error"));
      },
    },
  );

  const { trigger: deleteLike } = useDeleteMutation(
    supabase.from("t_like"),
    ["clothes_id", "user_id"],
    "*",
    {
      onSuccess: async () => {
        // @ts-expect-error
        await mutate((prev) => {
          if (!prev) {
            return;
          }

          return { ...prev, data: { ...prev.data, like: [{ count: 0 }] } };
        });

        await revalidateTables();
      },
      onError: () => {
        toast.error(t("error"));
      },
    },
  );

  const { data: url, isLoading: isLoadingImage } = useFileUrl(
    supabase.storage.from("clothes"),
    `${data?.id}.jpg`,
    "public",
    {
      ensureExistence: true,
    },
  );

  const isLoading = isLoadingClothes || isLoadingImage;

  const isLiked = (data?.like[0].count ?? 0) > 0;

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <YStack flex={1} gap="$4">
            {isLoading ? (
              <Skeleton w="100%" aspectRatio={3 / 4} rounded="$none" />
            ) : (
              <>
                <View
                  position="relative"
                  w="100%"
                  aspectRatio={3 / 4}
                  bg="$mutedBackground"
                >
                  <XStack
                    position="absolute"
                    t="$5"
                    z="$50"
                    w="100%"
                    px="$5"
                    items="center"
                    justify="space-between"
                  >
                    <TouchableOpacity activeOpacity={0.6} onPress={router.back}>
                      <View
                        p="$2"
                        items="center"
                        justify="center"
                        bg="black"
                        rounded="$full"
                        opacity={0.8}
                        boxShadow="$shadow.xl"
                      >
                        <Icons.chevronLeft size="$5" color="white" />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6}>
                      <View
                        p="$2"
                        items="center"
                        justify="center"
                        bg="black"
                        rounded="$full"
                        opacity={0.8}
                        boxShadow="$shadow.xl"
                      >
                        <Icons.share size="$5" color="white" />
                      </View>
                    </TouchableOpacity>
                  </XStack>
                  <Image
                    source={url}
                    style={{ width: "100%", height: "100%" }}
                    transition={200}
                  />
                </View>

                <YStack px="$5" gap="$2">
                  <Text fontSize="$md" color="$mutedColor">
                    {t("brand_name")}
                  </Text>
                  <Text fontSize="$md" color="$mutedColor">
                    {data?.category}
                  </Text>
                  <H1 fontSize="$lg" color="$mutedColor">
                    {data?.title}
                  </H1>
                  <Text fontSize="$xl" color="$mutedColor" fontWeight="$bold">
                    {t("price")}
                  </Text>
                  <Text fontSize="$sm" color="$mutedColor">
                    {data?.description}
                  </Text>
                </YStack>
              </>
            )}
          </YStack>
        </ScrollView>
      </SafeAreaView>
      <XStack
        position="absolute"
        b="$0"
        w="100%"
        px="$8"
        pt="$3"
        pb="$10"
        borderTopWidth="$px"
        borderColor="$borderColor"
        items="center"
        justify="space-between"
      >
        <XStack gap="$4">
          <Button
            variant="outline"
            size="icon"
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (isLiked) {
                await deleteLike({
                  clothes_id: Number(id),
                  user_id: session?.user.id ?? "",
                });
              } else {
                await insertLike([
                  {
                    id: Crypto.randomUUID(),
                    clothes_id: Number(id),
                    user_id: session?.user.id ?? "",
                  },
                ]);
              }
            }}
          >
            <Button.Icon>
              <Heart size="$5" active={isLiked} />
            </Button.Icon>
          </Button>
        </XStack>
        <Button
          variant="primary"
          px="$8"
          disabled={!data?.purchase_url}
          onPress={() => Linking.openURL(data?.purchase_url as string)}
        >
          <Button.Text>{t("shop")}</Button.Text>
        </Button>
      </XStack>
    </>
  );
});

export default DetailsPage;
