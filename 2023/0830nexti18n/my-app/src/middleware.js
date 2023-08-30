import { NextResponse } from "next/server";

console.log(1);

let locales = ["en-US", "nl-NL", "nl"];

// Get the preferred locale, similar to above or using a library
function getLocale(request) {}

export function middleware(request) {
    // return;
    // Check if there is any supported locale in the pathname
    const pathname = request.nextUrl.pathname;
    const pathnameIsMissingLocale = locales.every(
        (locale) =>
            !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );
    console.log("---------------------------------------------");
    console.log(request);

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        return;
        const locale = getLocale(request);

        // e.g. incoming request is /products
        // The new URL is now /en-US/products
        return NextResponse.redirect(
            new URL(`/${locale}/${pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        "/((?!_next).*)",
        // Optional: only run on root (/) URL
        // '/'
    ],
};
