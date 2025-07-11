import { createId } from "@paralleldrive/cuid2";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Label, View, XStack } from "tamagui";
import { RadioGroup } from "@/components/RadioGroup";
import { languages } from "@/constants";
import { useLanguageStore } from "@/stores/useLanguageStore";
import type { Language } from "@/types";

const LanguagePage = memo(() => {
  const { t } = useTranslation("settings");
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <View flex={1} pt="$8" px="$8">
      <RadioGroup
        value={language}
        onValueChange={(language) => setLanguage(language as Language)}
        gap="$6"
      >
        {languages.map((item, index) => {
          const id = createId();

          return (
            <XStack key={index.toString()} items="center" gap="$3">
              <RadioGroup.Item id={id} value={item} size="$10">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
              <Label flex={1} htmlFor={id} fontWeight="$medium">
                {t(`language.${item}`)}
              </Label>
            </XStack>
          );
        })}
      </RadioGroup>
    </View>
  );
});

export default LanguagePage;
