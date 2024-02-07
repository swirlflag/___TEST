// JARVIS: ($p = { baseURL: null }) => {
//     const defaults: any = {
//         baseURL: $p.baseURL || env("JARVIS_API_URL"),
//         headers: {
//             "x-jarvis-api-key": env("JARVIS_KEY"),
//             Authorization: "Bearer " + env("JARVIS_TOKEN"),
//         },
//     };
//     return axios.create(defaults);
// },

// export const API_getJarvisContents = async ($p: PAYLOAD_JARVISCONTENTS) => {
//     const ticket = TICKET_JARVIS;
//     const method = "GET";
//     const origin = "/v1/Contents/list";

//     const url = `${origin}/${$p.contentId}`;

//     const payload: PAYLOAD_API = {
//         ticket,
//         method,
//         url,
//     };

//     const response: Response = await API(payload);

//     return response;
// };

const fs = require("fs");
const http = require("http");
const https = require("https");

const server = http.createServer();

const gettest = async () => {
    const response = await https.request(
        "https://jarvis-api.nexon.com/v1/Contents/list/WP_BANNER_MainPromotion",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-jarvis-api-key": "jarvis_wp",
                Authorization: "Bearer 46C559EC-6EBC-4A6B-943E-32F0E562CEA0",
            },
        }
    );

    console.log(response);
    return;

    const parseData = await response.json();

    const isOK =
        response.ok && response.status === 200 && parseData.code === "0000";

    if (!isOK) {
        return;
    }

    const jsonString = JSON.stringify(parseData, null, 2);

    fs.writeFile(`${__dirname}/data.json`, jsonString, (err) => {
        if (err) {
            console.error("파일 저장 중 오류 발생:", err);
        } else {
            console.log("JSON 데이터가 성공적으로 저장되었습니다.");
        }
    });
};

gettest();

const test = () => {
    setTimeout(test, 1000);
    console.log(1);
};
// test();
