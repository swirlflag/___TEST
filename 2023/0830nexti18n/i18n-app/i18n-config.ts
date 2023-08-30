export const i18n = {
    defaultLocale: "de",
    locales: ["en", "de", "cs", "ko", "tw"],
    deniedCountrys: ["cn", "vn"],
    redirectCountrys: ["dk"],
    redirectCountryMap: {
        tw: ["hk", "mo"],
    },
    localeDetection: false,
} as const;

export type Locale = (typeof i18n)["locales"][number];
