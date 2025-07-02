import {
  type CameraType,
  CameraView,
  type FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { H1, Text, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";

const CameraPage = () => {
  const { t } = useTranslation("camera");
  const router = useRouter();
  const { from, ...params } = useLocalSearchParams<
    { from: string } & Record<string, string>
  >();
  const ref = useRef<CameraView>(null);
  const paramsRef = useRef(params);
  const [isReady, setIsReady] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();

  const onReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }, []);

  const takePicture = useCallback(async () => {
    const picture = await ref.current?.takePictureAsync();
    if (picture) {
      router.push({
        pathname: from,
        params: { ...paramsRef.current, uri: picture.uri },
      });
    }
  }, [router, from]);

  const toggleFlash = useCallback(() => {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  }, []);

  if (!permission) {
    return <View flex={1} bg="black" />;
  }

  if (!permission.granted) {
    return (
      <YStack flex={1} items="center" justify="center" px="$8" gap="$8">
        <YStack gap="$5" items="center">
          <View
            w="$24"
            h="$24"
            items="center"
            justify="center"
            rounded="$full"
            bg="$mutedBackground"
          >
            <Icons.camera size="$12" color="$mutedColor" />
          </View>
          <YStack gap="$2">
            <H1 text="center" fontWeight="bold" fontSize="$xl">
              {t("placeholder.title")}
            </H1>
            <Text text="center" color="$mutedColor">
              {t("placeholder.description")}
            </Text>
          </YStack>
        </YStack>
        <Button variant="primary" onPress={requestPermission}>
          <Button.Text>{t("grant")}</Button.Text>
        </Button>
      </YStack>
    );
  }

  return (
    <View flex={1} bg="black">
      <CameraView
        ref={ref}
        ratio="4:3"
        style={{ flex: 1, width: "100%" }}
        facing={facing}
        flash={flash}
        onCameraReady={onReady}
      />
      {isReady && (
        <>
          <XStack
            animation="medium"
            enterStyle={{ opacity: 0, y: 20 }}
            exitStyle={{ opacity: 0, y: 20 }}
            px="$6"
            w="100%"
            position="absolute"
            t="$16"
            items="center"
            justify="space-between"
          >
            <TouchableOpacity activeOpacity={0.6} onPress={router.back}>
              <Icons.chevronLeft size="$8" color="white" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6}>
              <Icons.zap size="$6" color="white" />
            </TouchableOpacity>
          </XStack>
          <XStack
            animation="medium"
            enterStyle={{ opacity: 0, y: 20 }}
            exitStyle={{ opacity: 0, y: 20 }}
            px="$8"
            w="100%"
            position="absolute"
            b="$8"
            items="center"
            justify="space-between"
          >
            <TouchableOpacity activeOpacity={0.6} onPress={toggleFacing}>
              <View
                p="$3"
                items="center"
                justify="center"
                bg="black"
                rounded="$full"
                opacity={0.8}
                boxShadow="$shadow.xl"
              >
                <Icons.image size="$6" color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6} onPress={takePicture}>
              <View
                p="$1"
                borderWidth="$0.5"
                borderColor="white"
                items="center"
                justify="center"
                rounded="$full"
                boxShadow="$shadow.xl"
              >
                <View
                  w="$14"
                  h="$14"
                  bg="white"
                  rounded="$full"
                  boxShadow="$shadow.xl"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6} onPress={toggleFlash}>
              <View
                p="$3"
                items="center"
                justify="center"
                bg="black"
                rounded="$full"
                opacity={0.8}
                boxShadow="$shadow.xl"
              >
                <Icons.refreshCcw size="$6" color="white" />
              </View>
            </TouchableOpacity>
          </XStack>
        </>
      )}
    </View>
  );
};

export default CameraPage;
