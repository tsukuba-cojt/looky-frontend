import { useAudioPlayer } from "expo-audio";
import {
  type CameraType,
  CameraView,
  type FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { Image } from "expo-image";
import {
  type ActionCrop,
  ImageManipulator,
  SaveFormat,
} from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { H1, Text, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { wait } from "@/lib/utilts";

const CameraPage = memo(() => {
  const { t } = useTranslation("camera");

  const router = useRouter();
  const { from } = useLocalSearchParams<{ from: string }>();

  const ref = useRef<CameraView>(null);

  const [isReady, setIsReady] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");

  const [permission, requestPermission] = useCameraPermissions();

  const player = useAudioPlayer(require("../../assets/countdown.wav"));

  useEffect(() => {
    player.muted = true;
  }, [player]);

  const onReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }, []);

  const takePicture = useCallback(async () => {
    try {
      player.play();

      for (let i = 3; i >= 1; i--) {
        setCount(i);
        await wait(1);
      }

      setCount(null);
      await wait(0.1);

      const picture = await ref.current?.takePictureAsync();

      if (!picture) {
        return;
      }

      const context = ImageManipulator.manipulate(picture.uri);

      const ratio = 3 / 4;
      let crop: ActionCrop["crop"];

      if (picture.width / picture.height > ratio) {
        const width = picture.height * ratio;
        crop = {
          originX: (picture.width - width) / 2,
          originY: 0,
          width,
          height: picture.height,
        };
      } else {
        const height = picture.width / ratio;
        crop = {
          originX: 0,
          originY: (picture.height - height) / 2,
          width: picture.width,
          height,
        };
      }

      context.crop(crop).resize({ width: 768, height: 1024 });

      const image = await context.renderAsync();
      const result = await image.saveAsync({ format: SaveFormat.JPEG });

      router.dismissTo({
        pathname: from,
        params: { uri: result.uri },
      });
    } finally {
      setCount(null);
    }
  }, [player, from, router]);

  const toggleFlash = useCallback(() => {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  }, []);

  const toggleMute = useCallback(() => {
    player.muted = !player.muted;
    setIsMuted(player.muted);
  }, [player]);

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
        <View
          position="absolute"
          w="100%"
          h="100%"
          items="center"
          justify="center"
        >
          <Image
            source={require("../../assets/images/outline.png")}
            style={{
              width: "60%",
              height: "60%",
              opacity: 0.5,
            }}
            contentFit="contain"
          />
        </View>
      )}

      {count !== null && (
        <View
          position="absolute"
          w="100%"
          h="100%"
          items="center"
          justify="center"
          z={20}
          pointerEvents="none"
        >
          <Text
            fontSize={120}
            fontWeight="bold"
            color="white"
            textShadowColor="rgba(255, 255, 255, 1.0)"
            textShadowRadius={10}
          >
            {count}
          </Text>
        </View>
      )}

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
            z={30}
          >
            <TouchableOpacity activeOpacity={0.6} onPress={router.back}>
              <Icons.x size="$8" color="white" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6} onPress={toggleMute}>
              {isMuted ? (
                <Icons.volumeOff size="$6" color="white" />
              ) : (
                <Icons.volume2 size="$6" color="white" />
              )}
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
                <Icons.zap size="$6" color="white" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                if (count === null) {
                  takePicture();
                }
              }}
            >
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
                <Icons.refreshCcw size="$6" color="white" />
              </View>
            </TouchableOpacity>
          </XStack>
        </>
      )}
    </View>
  );
});

export default CameraPage;
