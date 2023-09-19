"use client";
import { useRegistForm } from "@/app/hooks.js";

const Regist = () => {
    const regForm = useRegistForm();

    const { phone, email } = regForm.state;
    const { bind, valid, validater } = regForm;

    const onInputPhone = (ref) => {
        const value = ref.target.value;
        regForm.set("phone", value);
    };

    const onInputEmail = (ref) => {
        const value = ref.target.value;
        regForm.set("email", value);
    };

    return (
        <>
            <div>
                phone: {phone}
                <br />
                email: {email}
                <br />
                <br />
                valid phone: {valid.phone ? "true" : "false"}
                <br />
                valid email: {valid.email ? "true" : "false"}
            </div>
            <div>
                <input type="text" value={phone} onChange={onInputPhone} />
            </div>
            <div>
                <input type="text" value={email} onChange={onInputEmail} />
            </div>
            <div>
                <input type="text" value={phone} onChange={bind("phone")} />
            </div>
            <div>
                <button onClick={() => regForm.set("phone", Math.random())}>
                    1asaaaaa
                </button>
            </div>
            <button>최종 사전에약</button>
        </>
    );
};
export default Regist;
