import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

export type AppLocale = "en" | "zh";
export type LanguagePreference = "system" | AppLocale;

const FALLBACK_LOCALE: AppLocale = "en";

const resources = {
  en: { translation: en },
  zh: { translation: zh },
} as const;

/** Map the device's primary locale to a supported app locale. */
function resolveDeviceLocale(): AppLocale {
  const languageCode = getLocales()[0]?.languageCode ?? "";
  return languageCode.startsWith("zh") ? "zh" : FALLBACK_LOCALE;
}

/**
 * Resolve a stored language preference to a concrete locale. `"system"` (and
 * any unknown value) falls back to the device locale. Shared by init and the
 * settings store so both pick the same locale for a given preference.
 */
export function resolveLanguage(preference: LanguagePreference | undefined): AppLocale {
  if (preference === "en" || preference === "zh") {
    return preference;
  }
  return resolveDeviceLocale();
}

// eslint-disable-next-line import/no-named-as-default-member -- canonical i18next chain API
void i18n.use(initReactI18next).init({
  resources,
  lng: resolveDeviceLocale(),
  fallbackLng: FALLBACK_LOCALE,
  keySeparator: ".",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  compatibilityJSON: "v4",
});

export default i18n;
