"use client";
import { Metadata } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
    // title: "Next.js",
};

const UserTemplate = (props: any) => {
    const { children } = props;

    const [random, setRandom] = useState(0);

    useEffect(() => {
        setRandom(Math.floor(Math.random() * 100));
        console.log(props);
    }, []);
    return (
        <>
            <h2>template h2</h2>
            <div>{children}</div>
            <Link href={`/mypage/${random}`}>go random : {random}</Link>
        </>
    );
};
export default UserTemplate;
