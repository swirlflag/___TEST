"use client";
import { useRegistForm } from "@/app/hooks.js";

const Regist = () => {
    const [form, setForm, setPhone] = useRegistForm();

    const sett = (target) => {
        const value = target.target.value;
        setPhone(value);
    };
    console.log(form);

    return (
        <>
            <div>{form.phone}</div>
            <div>
                <input type="text" value={form.phone} onChange={sett} />
            </div>
            <div>
                <button
                    onClick={() => {
                        setPhone(form.phone + 1);
                    }}
                >
                    hey
                </button>
            </div>
        </>
    );
};
export default Regist;
