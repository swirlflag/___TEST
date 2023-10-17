"use client";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useMemo } from "react";

const posts = [
    {
        id: 22211,
        name: "yygogo",
    },
    {
        id: 37,
        name: "helloman",
    },
];
const User = () => {
    const pathname = usePathname();
    const router = useRouter();
    const param = useParams();

    const postsMemo = useMemo(() => {
        return posts.map((post) => ({
            isActive: param.userid === post.id.toString(),
            ...post,
        }));
    }, [param.userid]);

    return (
        <>
            {postsMemo.map((post) => {
                return (
                    <li key={post.id}>
                        <Link
                            href={`/mypage/${post.id}`}
                            className={
                                post.isActive ? "text-blue" : "text-black"
                            }
                        >
                            {post.name}
                        </Link>
                    </li>
                );
            })}
        </>
    );
};
export default User;
