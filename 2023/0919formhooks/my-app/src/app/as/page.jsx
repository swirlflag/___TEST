"use client";
import { useAsyncStatus } from "@/app/hooks.js";
import { useEffect } from "react";

const ASPage = () => {
    const myAS = useAsyncStatus();

    const hello = async () => {
        const stay = await myAS.stay("success");
        console.log("success hello");
        // myAS.success("");
        // console.log("success");
    };

    useEffect(() => {
        // hello();
    }, []);

    useEffect(() => {
        console.log(myAS.isPending);
    }, [myAS.isPending]);

    return (
        <>
            <div>{myAS.status}</div>
            <div>{myAS.isSuccess ? "true" : "false"}</div>
            <div>
                <button onClick={hello}>hello</button>
                <br />
                <button onClick={myAS.initial}>initial</button>
                <button onClick={myAS.success}>success</button>
                <button onClick={myAS.pending}>pending</button>
            </div>
        </>
    );
};

export default ASPage;
