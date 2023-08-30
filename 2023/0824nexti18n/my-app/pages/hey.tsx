import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Hey = (props) => {
    console.log(props);
    const { t } = useTranslation("common");
    return <div>{t("mytext")}</div>;
};

export async function getStaticProps(props) {
    const { locale } = props;
    console.log(props);
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
            // Will be passed to the page component as props
        },
    };
}
export default Hey;
