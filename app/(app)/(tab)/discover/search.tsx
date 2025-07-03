import { FlashList } from "@shopify/flash-list";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, XStack, YStack } from "tamagui";
import { Button } from "@/components/Button";
import { Icons } from "@/components/Icons";
import { Input } from "@/components/Input";

const SearchPage = () => {
  const { t } = useTranslation("discover");
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} pt="$4" gap="$8">
        <XStack px="$8" items="center" gap="$4">
          <TouchableOpacity activeOpacity={0.6} onPress={router.back}>
            <Icons.chevronLeft size="$6" />
          </TouchableOpacity>
          <XStack position="relative" items="center" shrink={1}>
            <Input
              autoFocus
              placeholder={t("placeholder")}
              rounded="$full"
              borderWidth={0}
              pl="$9"
              boxShadow="none"
              bg="$mutedBackground"
            />
            <Icons.search
              position="absolute"
              l="$3"
              size="$4"
              color="$mutedColor"
            />
          </XStack>
          <Button variant="ghost" size="icon" w="$6" h="$6" circular>
            <Button.Icon>
              <Icons.slidersHorizontal size="$5" />
            </Button.Icon>
          </Button>
        </XStack>
        <YStack flex={1} gap="$4">
          <XStack px="$8" items="center" justify="space-between">
            <Text fontWeight="$bold">{t("search.history")}</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Text color="$mutedColor">{t("search.clear")}</Text>
            </TouchableOpacity>
          </XStack>
          <FlashList
            data={["foo", "bar", "baz"]}
            contentContainerStyle={{
              paddingHorizontal: 24,
            }}
            estimatedItemSize={64}
            renderItem={({ item }) => (
              <Link href="/discover" asChild>
                <Button my="$2" px="$2" variant="ghost">
                  <XStack w="100%" items="center" justify="space-between">
                    <XStack items="center" gap="$3">
                      <Button.Icon>
                        <View p="$2" rounded="$full" bg="$mutedBackground">
                          <Icons.clock size="$5" />
                        </View>
                      </Button.Icon>
                      <Text fontSize="$lg">{item}</Text>
                    </XStack>
                    <Button.Icon>
                      <Icons.chevronRight size="$5" color="$mutedColor" />
                    </Button.Icon>
                  </XStack>
                </Button>
              </Link>
            )}
          />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};
export default SearchPage;
