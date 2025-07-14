import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
} from "@supabase-cache-helpers/postgrest-swr";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { ScrollView, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Heart } from "@/components/Heart";
import { Icons } from "@/components/Icons";
import { supabase } from "@/lib/client";
import { useSessionStore } from "@/stores/useSessionStore";

const DetailsPage = memo(() => {
  const { t } = useTranslation("details");
  const session = useSessionStore((state) => state.session);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, mutate } = useQuery(
    supabase
      .from("t_clothes")
      .select(`
        id,
        object_key,
        like: t_like (count)
      `)
      .eq("id", Number(id))
      .maybeSingle(),
  );

  const { trigger: insertLike } = useInsertMutation(
    supabase.from("t_like"),
    ["id"],
    "*",
    {
      onSuccess: () => {
        // @ts-expect-error
        mutate((prev) => {
          if (!prev) {
            return;
          }

          return { ...prev, data: { ...prev.data, like: [{ count: 1 }] } };
        }, false);
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
      onSuccess: () => {
        // @ts-expect-error
        mutate((prev) => {
          console.log("delete", prev);
          if (!prev) {
            return;
          }

          return { ...prev, data: { ...prev.data, like: [{ count: 0 }] } };
        }, false);
      },
      onError: () => {
        toast.error(t("error"));
      },
    },
  );

  const isLiked = (data?.like[0].count ?? 0) > 0;

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <YStack flex={1} gap="$4">
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
                    <Icons.ellipsis size="$5" color="white" />
                  </View>
                </TouchableOpacity>
              </XStack>
              <Image
                source={`https://looky-clothes-images.s3.ap-northeast-1.amazonaws.com/${data?.object_key}`}
                style={{ width: "100%", height: "100%" }}
                transition={200}
              />
            </View>
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
          <Button variant="outline" size="icon">
            <Button.Icon>
              <Icons.shoppingCart size="$5" />
            </Button.Icon>
          </Button>
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
        <Button variant="primary" px="$8">
          <Button.Text>{t("try_on")}</Button.Text>
        </Button>
      </XStack>
    </>
  );
});

export default DetailsPage;
