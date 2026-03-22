import { useLocalSearchParams, useRouter } from "expo-router";
import { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { View } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";

const WebViewPage = memo(() => {
  const { url } = useLocalSearchParams<{ url: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View px="$4" py="$2">
        <Button
          variant="ghost"
          size="icon"
          rounded="$full"
          onPress={router.back}
        >
          <Button.Icon>
            <Icons.chevronLeft size="$6" />
          </Button.Icon>
        </Button>
      </View>
      <View flex={1}>
        <WebView source={{ uri: url }} />
      </View>
    </SafeAreaView>
  );
});

export default WebViewPage;
