import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { supabase } from "@/lib/client";

const DetailsPage = memo(() => {
  const { t } = useTranslation("details");
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data } = useQuery(
    supabase
      .from("t_clothes")
      .select("id,object_key")
      .eq("id", Number(id))
      .maybeSingle(),
  );

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
          <Button variant="outline" size="icon">
            <Button.Icon>
              <Icons.heart size="$5" fill="red" color="red" />
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
