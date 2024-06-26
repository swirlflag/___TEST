/**
 * credentail 처리
 * 커스텀으로 headers 및 변경 해보기
 * 한번 요청한 기능에 대한 guard
 * 커스텀으로 메세지 바꿔보기
 * no ticket
 */
const elf = async function ($p) {
    if (!$p.ticket) {
        throw "API 티켓이 필요합니다.";
    }

    const method = $p?.method || elf.METHOD.GET;
    const ticket = elf.TICKET[$p.ticket];

    if (!ticket) {
        throw "올바른 API 티켓이 아닙니다.";
    }

    const airplane = elf.getAirplane(ticket);

    if (!airplane) {
        throw "등록된 API 티켓이 아닙니다.";
    }

    const query = $p?.query ? elf.util.objectToQuery($p.query) : "";

    const origin = $p?.origin || airplane.origin;

    const url = $p?.url || `${origin}${$p.path}${query}`;

    const credentials =
        $p.credentials || ($p.withCredential ? "include" : "same-origin");

    const mode = "";

    const options = {
        method,
        headers: {
            // "Content-type": "application/json; charset=UTF-8",
            "Content-type": "application/json",
            // "Content-type": "text/plain",
            ...airplane?.headers,
            ...$p.headers,
        },
        // mode: "no-cors",
        ...$p?.options,
        credentials,
    };

    if ($p?.data) {
        options.body = JSON.stringify($p.data);
    }

    let result = {};
    try {
        if ($p?.log) {
            console.log(" ");
            elf.util.log("----- ELF LOG START -----");
            elf.util.log("fetch()", url, options);
        }
        const response = await fetch(url, options);
        if ($p?.log) {
            elf.util.log("response: ", response);
        }

        let data = null;
        const errors = [];

        try {
            const text = await response.text();
            data = JSON.parse(text);
        } catch (jsonError) {
            errors.push(`[JSON ERROR] ${jsonError.message}`);
        }

        console.log(data);

        // try {
        //     data = await response.json();
        // } catch (jsonError) {
        //     errors.push(`[JSON ERROR] ${jsonError.message}`);
        // }

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
            elf.util.errorlog("networkError: ", networkError);
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

    if ($p.log) {
        const log = result.ok ? elf.util.log : elf.util.errorlog;
        log("result: ", result);
        elf.util.log("----- ELF LOG END -------");
    }

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
elf.ENV = {};
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
    errorlog: (first, ...log) => {
        console.log(
            `%c${first}`,
            "font-weight: 700;padding: 2px;background: rgb(230, 80, 100); color: #fff",
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

elf.setAirport = ($options) => {
    for ([k, v] of Object.entries($options)) {
        elf.TICKET[k] = k;
        elf.AIRPLANE[k] = v;
        if (v.codeMessage) {
            elf.CODEMESSAGE[k] = v.codeMessage;
        }
    }
};
