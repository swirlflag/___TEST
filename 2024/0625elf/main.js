import elf from "./elf";

const getCookieValue = (name) => {
    const regex = new RegExp(`(^| )${name}=([^;]+)`);
    const match = document.cookie.match(regex);
    if (match) {
        return match[2];
    }
    return null;
};

elf.setAirport({
    TOY: () => {
        const result = {
            origin: "https://sandbox.api.nexon.com/community-ext-api",
            headers: {
                "x-inface-api-key": "fb994959-da51-52a7-a2ac-2ce59e5ea506",
                "community-id": 253,
            },
            alias: "WPQA",
            countryCode: "KR",
            codeMessage: {},
        };

        const NPP = getCookieValue("NPP");
        if (NPP) {
            result.headers.authorization = `KRPC ${NPP}`;
        }

        return result;
    },
    JARVIS: {
        origin: "https://stg-jarvis-api.nexon.com",
        headers: {
            "x-jarvis-api-key": "jarvis_wp",
            Authorization: "Bearer JARVIS_WP_API_KEY",
        },
        codeMessage: {
            "0000": "자비스 정상 호출 완료에 대한 메세지",
        },
    },
});

// elf({
//     method: "get",
//     ticket: "TOY",
//     path: "/api/v1/thread/694870",
//     log: true,
// });

const API_getThread = async ($threadId = "") => {
    const method = elf.METHOD.GET;
    const ticket = elf.TICKET.TOY;
    const path = `/api/v1/thread/${$threadId}`;
    const query = {
        hey: "ho",
    };
    const payload = {
        method,
        ticket,
        path,
        query: {},
        log: true,
    };
    const response = await elf(payload);
    return response;
};

const API_getAlias = async () => {
    const method = elf.METHOD.GET;
    const ticket = elf.TICKET.TOY;
    const { alias, countryCode } = elf.getAirplane(ticket);

    const path = `/api/v1/community/${alias}`;

    const query = {
        alias,
        countryCode,
    };

    const payload = {
        method,
        ticket,
        path,
        query,
    };
    const response = await elf(payload);

    return response;
};

const API_getJarvisItem = async ($contentId) => {
    const method = elf.METHOD.GET;
    const ticket = elf.TICKET.JARVIS;
    const path = `/v1/Contents/list/${$contentId}`;

    const payload = {
        method,
        ticket,
        path,
        log: true,
    };

    const response = await elf(payload);
    return response;
};

const [b1, b2, b3] = document.querySelectorAll("button");

b1.addEventListener("click", async () => {
    const r = await API_getThread("694870");
    // console.log("final res: ", r);
});
b2.addEventListener("click", async () => {
    const r = await API_getAlias();
    // console.log("final res: ", r);
});
b3.addEventListener("click", async () => {
    const r = await API_getJarvisItem("WP_BANNER_MainPromotion");
    // console.log("final res: ", r);
});
