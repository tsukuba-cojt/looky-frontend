import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { toast } from "sonner-native";
import { H1, Text, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { OtpInput } from "@/components/OtpInput";
import { resend, verifyOtp } from "@/lib/auth";

const VerifyPage = memo(() => {
  const { t } = useTranslation("verify");
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const onEnter = useCallback(
    async (code: number) => {
      try {
        await verifyOtp(email, code.toString());

        router.replace("/");
      } catch {
        toast.error(t("error"));
      }
    },
    [email, router, t],
  );

  const onResend = useCallback(async () => {
    try {
      await resend(email);

      toast.success(t("success"));
    } catch {
      toast.error(t("error"));
    }
  }, [email, t]);

  return (
    <YStack flex={1} items="center" justify="center" gap="$6">
      <View position="absolute" t="$16" l="$5">
        <TouchableOpacity activeOpacity={0.6} onPress={router.back}>
          <Icons.chevronLeft size="$8" />
        </TouchableOpacity>
      </View>
      <YStack gap="$1">
        <H1 text="center" fontSize="$2xl" fontWeight="bold">
          {t("title")}
        </H1>
        <Text fontSize="$md" color="$mutedColor">
          {t("description")}
        </Text>
      </YStack>
      <OtpInput onEnter={onEnter} />
      <XStack gap="$2" items="center">
        <Text>{t("do_not_receive_code")}</Text>
        <Button
          group
          variant="link"
          h="auto"
          px="$0"
          py="$0"
          onPress={onResend}
        >
          <Button.Text
            color="$primaryBackground"
            $group-press={{ textDecorationLine: "underline" }}
          >
            {t("resend")}
          </Button.Text>
        </Button>
      </XStack>
    </YStack>
  );
});

export default VerifyPage;
