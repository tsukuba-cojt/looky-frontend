import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { Text, View, YStack } from "tamagui";
import { Icons } from "@/components/Icons";
import { colors } from "@/constants";
import { useSearchQueryStore } from "@/stores/useSearchQueryStore";
import type { Color } from "@/types";

const ColorPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const query = useSearchQueryStore((state) => state.query);
  const setQuery = useSearchQueryStore((state) => state.setQuery);

  return (
    <View flex={1} pt="$4">
      <FlashList
        numColumns={4}
        estimatedItemSize={84}
        data={Object.entries(colors)}
        renderItem={({ item: [key, value] }) => (
          <View flex={1} p="$3" items="center">
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setQuery({ color: key as Color });
                router.back();
              }}
            >
              <YStack w="$16" gap="$1" items="center">
                <View
                  w="$10"
                  h="$10"
                  items="center"
                  justify="center"
                  rounded="$full"
                  borderColor="$borderColor"
                  borderWidth={key === "white" ? 1 : 0}
                  bg={value}
                >
                  {query.color === key && (
                    <Icons.check
                      size="$5"
                      color={key === "white" ? "black" : "white"}
                    />
                  )}
                </View>
                <Text fontSize="$sm">{t(`color.${key}`)}</Text>
              </YStack>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};
export default ColorPage;
