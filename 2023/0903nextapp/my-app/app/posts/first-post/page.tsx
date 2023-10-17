"use client";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

import { Metadata } from "next";
import { useState, useEffect } from "react";

import Head from "next/head";

<Head>
    <title>NeoVest SignIn</title>
</Head>;

// export const metadata: Metadata = {
//     title: {
//         absolute: "First post gogo",
//     },
// };

export default function FirstPost() {
    // const go = () => {
    //     console.log("load gsap");
    // };
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <Head>
                <title>he</title>
            </Head>
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
                strategy="lazyOnload"
                // onLoad={go}
            />
            <h1>First Post</h1>
            <h2>
                <Link href="/posts">Back to posts</Link>
            </h2>
            <div>
                <Image
                    src="/image.png"
                    alt="Your Name"
                    width={100}
                    height={100}
                />
            </div>
        </>
    );
}
