// import { I18nManager } from "react-native";
// import i18n from "i18n-js";
// import memoize from "lodash.memoize";

// const translationGetters = {
//   // lazy requires (metro bundler does not support symlinks)
//   en: () => require("../translations/en.json"),
//   ch: () => require("../translations/ch.json"),
// };

// const translate = memoize(
//   (key, config) => i18n.t(key, config),
//   (key, config) => (config ? key + JSON.stringify(config) : key)
// );

// export const setI18nConfig = (lang, isRTL) => {
//   // fallback if no available language fits
//   const fallback = { languageTag: "en", isRTL: false };
//   const languageTag = lang ? lang : "en";
//   Object.keys(translationGetters) || fallback;

//   // clear translation cache
//   translate.cache.clear();
//   // update layout direction

//   I18nManager.forceRTL(isRTL);

//   // set i18n-js config
//   i18n.translations = { [languageTag]: translationGetters[languageTag]() };

//   i18n.locale = languageTag ? languageTag : "en";
// };

// export default translate;

import LocalizedStrings from "react-native-localization";
import english from "./en.json";
// import chinese from "./ch.json";
// import malai from "./ba.json";

const translation = new LocalizedStrings({
  en: english,
  // ch: chinese,
  // ma: malai,
});

export default translation;
