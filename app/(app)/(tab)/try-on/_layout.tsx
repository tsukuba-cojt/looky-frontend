import {
  createMaterialTopTabNavigator,
  type MaterialTopTabNavigationEventMap,
  type MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import type {
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";
import { Text, useTheme, View, YStack } from "tamagui";
import BottomsIcon from "@/assets/images/bottoms.svg";
import TopsIcon from "@/assets/images/tops.svg";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const TryOnLayout = memo(() => {
  const { t } = useTranslation("common");
  const { width } = useWindowDimensions();
  const theme = useTheme();

  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarIndicatorStyle: {
          height: 2.5,
          width: width / 4,
          marginLeft: (width / 2 - width / 4) / 2,
          borderRadius: 1.25,
        },
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => (
            <YStack items="center" justify="center" gap="$1">
              <View>
                {/* svg component */}
                <TopsIcon
                  width={24}
                  height={24}
                  color={
                    focused
                      ? theme.primaryBackground.val
                      : theme.placeholderColor.val
                  }
                />
              </View>
              <Text
                fontWeight="$medium"
                color={focused ? "$primaryBackground" : "$color"}
                opacity={focused ? 1 : 0.6}
              >
                {t("category.tops")}
              </Text>
            </YStack>
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="bottoms"
        options={{
          tabBarLabel: ({ focused }) => (
            <YStack items="center" justify="center" gap="$1">
              <View>
                <BottomsIcon
                  width={24}
                  height={24}
                  color={
                    focused
                      ? theme.primaryBackground.val
                      : theme.placeholderColor.val
                  }
                />
              </View>
              <Text
                fontWeight="$medium"
                color={focused ? "$primaryBackground" : "$color"}
                opacity={focused ? 1 : 0.6}
              >
                {t("category.bottoms")}
              </Text>
            </YStack>
          ),
        }}
      />
    </MaterialTopTabs>
  );
});

export default TryOnLayout;
