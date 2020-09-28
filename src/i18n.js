import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ru from "./config/russian.json"
import kz from "./config/qazaq.json"
import en from "./config/english.json"

i18n.use(LanguageDetector).init({
    resources: {
        kz: kz,
        ru: ru,
        en: en
    },
    fallbackLng: "en",
    debug: true,
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false,
    interpolation: {
        escapeValue: false,
        formatSeparator: ","
    },
    react: {
        wait: true
    }
});

export default i18n;
