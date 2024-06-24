const elf = async function ($p) {
    if (!$p.ticket) {
        throw "API 티켓이 필요합니다.";
    }

    const method = $p.method || elf.METHOD.GET;
    const ticket = elf.TICKET[$p.ticket];

    if (!ticket) {
        throw "올바른 API 티켓이 아닙니다.";
    }

    const airplane = elf.getAirplane(ticket);

    if (!airplane) {
        throw "등록된 API 티켓이 아닙니다.";
    }

    const query = $p.query ? elf.util.objectToQuery($p.query) : "";

    const url = `${airplane.origin}${$p.path}${query}`;

    const options = {
        method,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            ...airplane?.headers,
        },
    };

    if ($p?.data) {
        options.body = JSON.stringify($p.data);
    }

    let result = {};
    try {
        if ($p?.log) {
            elf.util.log("fetch()", url, options);
        }
        const response = await fetch(url, options);
        if ($p?.log) {
            elf.util.log("response: ", response);
        }

        let data = null;

        const errors = [];

        try {
            data = await response.json();
        } catch (jsonError) {
            errors.push(`[JSON ERROR] ${jsonError.message}`);
        }

        const { ok, status } = response;

        if (!ok) {
            errors.push(`[HTTP ERROR] status: ${status}`);
        }
        const error = errors.length ? errors.join(" | ") : null;

        const code = error
            ? data?.code || data?.errorCode || data?.errorcode || "-1"
            : "-0";

        result = {
            ...response,
            ok,
            networkOk: true,
            status,
            data,
            error,
            code,
        };
    } catch (networkError) {
        if ($p?.log) {
            elf.util.log("networkError: ", networkError);
        }
        const error = `[NETWORK ERROR] message: ${networkError.message}`;
        result = {
            ok: false,
            networkOk: false,
            error,
            data: null,
            code: "-2",
        };
    }

    const { codeMessage, codeHint } = elf.util.getCodeMessage(
        result.code,
        ticket
    );

    result.codeMessage = codeMessage;
    result.codeHint = codeHint;

    return result;
};

elf.METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
    get: "GET",
    post: "POST",
    put: "PUT",
    patch: "PATCH",
    delete: "DELETE",
};

elf.TICKET = {};
elf.AIRPLANE = {};
elf.CODEMESSAGE = {};
elf.CODEMESSAGE_DEFAULT = {
    "-0": "정상 호출 되었습니다.",
    "-1": "알 수 없는 오류가 발생했습니다.",
    "-2": "네트워크 오류가 발생했습니다.",
};

elf.util = {
    log: (first, ...log) => {
        console.log(
            `%c${first}`,
            "font-weight: 700;padding: 2px;background: rgb(8, 60, 230); color: #fff",
            ...log
        );
    },
    objectToQuery: (...objs) => {
        return (
            "?" +
            objs
                .map((obj) =>
                    Object.entries(obj)
                        .filter(([k, v]) => v !== undefined)
                        .map((c) => c.join("="))
                        .join("&")
                )
                .join("&")
        );
    },

    getCodeMessage: (code = "-1", ticket = "CLIENT") => {
        const ticketSign = ticket.slice(0, 2);
        const codeMessage =
            elf.CODEMESSAGE[code] || elf.CODEMESSAGE_DEFAULT[code];
        const codeHint = `${ticketSign}:${code}`;

        return {
            codeMessage,
            codeHint,
        };
    },
};

elf.getAirplane = ($ticket, $p) => {
    const airplane = elf.AIRPLANE[$ticket]
        ? typeof elf.AIRPLANE[$ticket] === "function"
            ? elf.AIRPLANE[$ticket]($p)
            : elf.AIRPLANE[$ticket]
        : null;

    return airplane;
};

elf.addAirport = ($options) => {
    for ([k, v] of Object.entries($options)) {
        elf.TICKET[k] = k;
        elf.AIRPLANE[k] = v;
        if (v.codeMessage) {
            elf.CODEMESSAGE[k] = v.codeMessage;
        }
    }
};

// logic

elf.addAirport({
    TOY: () => {
        return {
            origin: "https://sandbox.api.nexon.com/community-ext-api",
            headers: {
                "x-inface-api-key": "fb994959-da51-52a7-a2ac-2ce59e5ea506",
                "community-id": 253,
            },
        };
    },
});

elf.addAirport({
    TOY: {
        origin: "https://sandbox.api.nexon.com/community-ext-api",
        headers: {
            "x-inface-api-key": "fb994959-da51-52a7-a2ac-2ce59e5ea506",
            "community-id": 253,
        },
        alias: "WPQA",
        countryCode: "KR",
        codeMessage: {
            "-1": "에러 기본입니다",
            "0000": "에러 0000 입니다",
            123: "에러 12입니다",
        },
    },
});

// elf({
//     method: elf.METHOD.GET,
//     ticket: elf.TICKET.TOY,
//     // log: true,
//     path: "/api/v1/thread",
// });

const getthread = async ($threadId = "") => {
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
        query,
        log: true,
    };
    const response = await elf(payload);
    return response;
};

const getalias = async () => {
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

const [b1, b2] = document.querySelectorAll("button");

b1.addEventListener("click", async () => {
    const r = await getthread("694870");
    console.log(r);
});
b2.addEventListener("click", async () => {
    const r = await getalias();
    console.log(r);
});
