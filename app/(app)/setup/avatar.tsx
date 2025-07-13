import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import * as Crypto from "expo-crypto";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import {
  Link,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { memo, useCallback, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, Form, H1, Text, View, YStack } from "tamagui";
import { z } from "zod/v4";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { ImagePickerSheet } from "@/components/ImagePickerSheet";

const avatarSchema = z.object({
  avatar: z.object(
    {
      id: z.uuid(),
      uri: z.string(),
    },
    {
      error: "required_error",
    },
  ),
});
type FormData = z.infer<typeof avatarSchema>;

const AvatarPage = memo(() => {
  const { t } = useTranslation("setup");
  const router = useRouter();
  const pathname = usePathname();
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const { getValues, setValue } = useFormContext<FormData>();
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(avatarSchema),
    defaultValues: {
      avatar: uri ? { id: Crypto.randomUUID(), uri } : getValues("avatar"),
    },
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      const context = ImageManipulator.manipulate(data.avatar?.uri ?? "");
      const image = await context.renderAsync();
      const result = await image.saveAsync({
        format: SaveFormat.JPEG,
      });
      setValue("avatar", { id: data.avatar.id, uri: result.uri });
      router.push("/setup/outfit");
    },
    [router, setValue],
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} pt="$8" px="$8" gap="$8">
          <YStack gap="$1">
            <H1 fontSize="$2xl" fontWeight="bold">
              {t("avatar.title")}
            </H1>
            <Text fontSize="$md" color="$mutedColor">
              {t("avatar.description")}
            </Text>
          </YStack>
          <Form
            flex={1}
            items="center"
            justify="space-between"
            onSubmit={handleSubmit(onSubmit)}
          >
            <YStack gap="$4" items="center">
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => setIsOpen(true)}
              >
                <YStack position="relative">
                  <Avatar circular size="$40">
                    {uri && <Avatar.Image src={uri} />}
                    <Avatar.Fallback
                      items="center"
                      justify="center"
                      bg="$mutedBackground"
                    >
                      <Icons.userRound
                        size="$20"
                        strokeWidth={1.5}
                        color="$mutedColor"
                      />
                    </Avatar.Fallback>
                  </Avatar>
                  <View
                    position="absolute"
                    p="$2"
                    b="$1"
                    r="$1"
                    bg="black"
                    opacity={0.6}
                    rounded="$full"
                  >
                    <Icons.image size="$5" color="white" />
                  </View>
                </YStack>
              </TouchableOpacity>
              {errors.avatar && (
                <Text
                  text="center"
                  fontSize="$sm"
                  color="$destructiveBackground"
                >
                  {t(`avatar.${errors.avatar.message}`)}
                </Text>
              )}
            </YStack>
            <YStack w="100%" gap="$3">
              <Form.Trigger asChild>
                <Button variant="primary">
                  <Button.Text>{t("avatar.submit")}</Button.Text>
                </Button>
              </Form.Trigger>
              <Link href="/setup/outfit" asChild>
                <Button variant="ghost">
                  <Button.Text>{t("avatar.skip")}</Button.Text>
                </Button>
              </Link>
            </YStack>
          </Form>
        </YStack>
      </SafeAreaView>
      <ImagePickerSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        onImagePicked={(uri) => {
          router.push({
            pathname: "/crop",
            params: {
              uri,
              from: pathname,
            },
          });
          setIsOpen(false);
        }}
      />
    </>
  );
});

export default AvatarPage;
