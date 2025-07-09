import { FlashList } from "@shopify/flash-list";
import * as Crypto from "expo-crypto";
import { Image } from "expo-image";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Form, H1, Spinner, Text, View, YStack } from "tamagui";
import type z from "zod/v4";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { setupSchema } from "@/schemas/app";

const outfitsSchema = setupSchema.pick({ outfits: true });
type FormData = z.infer<typeof outfitsSchema>;

const GalleryPage = () => {
  const { t } = useTranslation("setup");
  const router = useRouter();
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const { getValues, setValue } = useFormContext<FormData>();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({ defaultValues: { outfits: getValues("outfits") } });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "outfits",
  });

  useEffect(() => {
    if (uri) {
      append({ id: Crypto.randomUUID(), uri });
    }
  }, [uri, append]);

  const onSubmit = (data: FormData) => {
    setValue("outfits", data.outfits);
    router.push("/setup/welcome");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} pt="$8" pb="$6" px="$8" gap="$8">
        <YStack gap="$1">
          <H1 fontSize="$2xl" fontWeight="bold">
            {t("outfit.gallery.title")}
          </H1>
          <Text fontSize="$md" color="$mutedColor">
            {t("outfit.gallery.description")}
          </Text>
        </YStack>
        <Form flex={1} onSubmit={handleSubmit(onSubmit)}>
          <YStack flex={1} gap="$4">
            <FlashList
              numColumns={2}
              scrollEnabled={false}
              data={Array(4)
                .fill(null)
                .map((_, i) => fields[i] ?? null)}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    paddingLeft: index % 2 === 1 ? 10 : 0,
                    paddingRight: index % 2 === 0 ? 10 : 0,
                    paddingTop: index > 1 ? 20 : 0,
                  }}
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
                          from: "/setup/body/gallery",
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
            {errors.outfits && (
              <Text text="center" fontSize="$sm" color="$destructiveBackground">
                {t(`outfit.attachmenet.${errors.outfits.message}`)}
              </Text>
            )}
          </YStack>
          <YStack gap="$3">
            <Form.Trigger asChild disabled={isSubmitting}>
              <Button variant="primary">
                {isSubmitting ? (
                  <Button.Icon>
                    <Spinner color="white" />
                  </Button.Icon>
                ) : (
                  <Button.Text>
                    {t("outfit.gallery.next")}
                  </Button.Text>
                )}
              </Button>
            </Form.Trigger>
            <Text fontSize="$xs" color="$placeholderColor" text="center">
              {t("outfit.gallery.note")}
            </Text>
          </YStack>
        </Form>
      </YStack>
    </SafeAreaView>
  );
};

export default GalleryPage;
