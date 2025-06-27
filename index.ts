import Constants from "expo-constants";

if (Constants.expoConfig?.extra?.storybookEnabled === "true") {
  const { registerRootComponent } = require("expo");
  const Storybook = require("./.storybook").default;
  registerRootComponent(Storybook);
} else {
  require("expo-router/entry");
}
