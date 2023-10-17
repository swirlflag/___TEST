import Link from "next/link";
import style from "./style.module.scss";

export default function FirstPost() {
    return (
        <div className={style["page-hey"]}>
            <h1>first posts</h1>
            <Link href="/posts/first-post" className="globaltest">
                first-post
            </Link>
        </div>
    );
}
