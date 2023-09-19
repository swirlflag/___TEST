import { useState, useMemo, useCallback } from "react";
export const useRegistForm = () => {
    const [phone, setPhone] = useState("1");
    const [email, setEmail] = useState("");

    const form = useMemo(() => {
        return {
            phone,
            email,
        };
    }, [phone, email]);

    const setForm = useCallback(() => {}, [phone, email]);

    return [form, setForm, setPhone];
};
