import { createId } from "@paralleldrive/cuid2";
import { useTranslation } from "react-i18next";
import { Label, View, XStack } from "tamagui";
import { RadioGroup } from "@/components/RadioGroup";
import { themes } from "@/constants";
import { useThemeStore } from "@/stores/useThemeStore";
import type { Theme } from "@/types";

const ThemePage = () => {
  const { t } = useTranslation("settings");
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <View flex={1} pt="$8" px="$8">
      <RadioGroup
        value={theme}
        onValueChange={(theme) => setTheme(theme as Theme)}
        gap="$6"
      >
        {themes.map((item, index) => {
          const id = createId();

          return (
            <XStack key={index.toString()} items="center" gap="$3">
              <RadioGroup.Item id={id} value={item} size="$10">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <Label flex={1} htmlFor={id} fontWeight="$medium">
                {t(`theme.${item}`)}
              </Label>
            </XStack>
          );
        })}
      </RadioGroup>
    </View>
  );
};

export default ThemePage;
