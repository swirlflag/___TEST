import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// 브라우저(유저)의 국가코드 얻음
function getLocale(request: NextRequest): string | undefined {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // @ts-ignore locales are readonly
    const locales: string[] = i18n.locales;

    // Use negotiator and intl-localematcher to get best locale
    let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
        locales
    );

    const locale = matchLocale(languages, locales, i18n.defaultLocale);

    return locale;
}

export function middleware(request: NextRequest) {
    // const res = NextResponse.next();
    // console.log(request.headers.get("x-real-ip"));
    // console.log(request.headers.get("x-forwarded-for"));
    const pathname = request.nextUrl.pathname;
    const {
        deniedCountrys,
        defaultLocale,
        redirectCountrys,
        redirectCountryMap,
    } = i18n;

    const domainCode = pathname.slice(1).split("/")[0];

    // 0. IP를 탐지한 후에 해당 국가코드를 자동으로 넣어준다.

    // 1. 제공하지 않는 지역의 국가코드일경우 기본값(en) 으로 리다이렉트
    const isRedirectContry =
        domainCode && redirectCountrys.some((code) => code === domainCode);
    if (isRedirectContry) {
        return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
    }

    // 2. 제한하는 지역의 국가코드일경우 특정 페이지로 이동
    const isDeniedContry = deniedCountrys.some((loc) =>
        request.nextUrl.pathname.startsWith(`/${loc}`)
    );
    if (isDeniedContry) {
        return NextResponse.redirect(
            new URL(`https://mw-notice.nexon.com/out_of_service`)
        );
    }

    // 3. 특정 리다이렉트로 도달하게 하는 모음
    for (const [k, v] of Object.entries(redirectCountryMap)) {
        const isMatch = v.some((value) => value === domainCode);
        if (isMatch) {
            return NextResponse.redirect(new URL(`/${k}`, request.url));
        }
    }

    // 4. 브라우저 국가코드의 설정대로 이동
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
                request.url
            )
        );
    }
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
