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
import { Text } from "tamagui";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const CollectionsLayout = memo(() => {
  const { t } = useTranslation("collections");
  const { width } = useWindowDimensions();

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
            <Text
              fontWeight="$medium"
              color={focused ? "$primaryBackground" : "$color"}
              opacity={focused ? 1 : 0.6}
            >
              {t("vton.title")}
            </Text>
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="clothes"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              fontWeight="$medium"
              color={focused ? "$primaryBackground" : "$color"}
              opacity={focused ? 1 : 0.6}
            >
              {t("clothes.title")}
            </Text>
          ),
        }}
      />
    </MaterialTopTabs>
  );
});

export default CollectionsLayout;
