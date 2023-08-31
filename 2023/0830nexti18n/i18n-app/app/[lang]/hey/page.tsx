import { headers } from "next/headers";
import { useEffect } from "react";
const Hey = () => {
    const header = headers();

    return <div>{header}</div>;
};
export default Hey;
