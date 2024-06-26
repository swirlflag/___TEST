/**
 * elf. ErrorLess Fetch
 *
 * @param {Object} $p - API 요청에 필요한 매개변수 객체입니다.
 * @param {string} $p.ticket - API 티켓 식별자입니다.
 * @param {string} [$p.method=elf.METHOD.GET] - 요청에 사용할 HTTP 메서드입니다.
 * @param {Object} [elf.TICKET] - API 티켓을 포함하는 객체입니다.
 * @param {Object} [$p.query] - 요청에 사용할 쿼리 매개변수입니다.
 * @param {string} [$p.origin] - 요청의 출처 URL입니다.
 * @param {string} [$p.url] - 요청의 전체 URL입니다. 제공되지 않으면, origin, path 및 query로 구성됩니다.
 * @param {boolean} [$p.withCredential=false] - 요청에 자격 증명을 포함할지 여부입니다.
 * @param {string} [$p.credentials="same-origin"] - 요청에 사용할 자격 증명 옵션입니다.
 * @param {Object} [$p.headers] - 요청에 사용할 추가 헤더입니다.
 * @param {Object} [$p.options] - fetch 요청에 사용할 추가 옵션입니다.
 * @param {Object} [$p.data] - 요청 본문에 보낼 데이터입니다 (POST, PUT 등).
 * @param {boolean} [$p.log=false] - 요청 및 응답 세부 정보를 로그로 남길지 여부입니다.
 * @returns {Promise<Object>} - API 요청의 결과를 반환합니다.
 * @throws {string} - API 티켓이 없거나 유효하지 않은 경우 오류를 발생시킵니다.
 *
 * @example
 * const result = await elf({
 *     ticket: "myApiTicket",
 *     method: "POST",
 *     url: "https://api.example.com/data",
 *     data: { key: "value" },
 *     log: true
 * });
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

    const options = {
        method,
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            ...airplane?.headers,
            ...$p?.headers,
        },
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
            data = await response.json();
        } catch (jsonError) {
            errors.push(`[JSON ERROR] ${jsonError.message}`);
        }

        const { ok, status } = response;

        if (!ok) {
            errors.push(`[HTTP ERROR] status: ${status}`);
        }
        const error = errors.length ? errors.join(" | ") : null;

        let code = data?.code || data?.errorCode || data?.errorcode;
        if (!code) {
            code = error ? "-1" : "-0";
        }

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
        ticket,
        result?.status
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

    getCodeMessage: (code = "-1", ticket = "CLIENT", status = "000") => {
        const ticketSign = ticket.slice(0, 2);
        const codeMessage =
            elf.CODEMESSAGE[ticket][code] ||
            elf.CODEMESSAGE_DEFAULT[code] ||
            "알 수 없는 오류가 발생했습니다.";
        const codeHint = `${status}:${ticketSign}:${code}`;

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
    [...Object.entries($options)].forEach(([k, v]) => {
        elf.TICKET[k] = k;
        elf.AIRPLANE[k] = v;

        const airplane = typeof v === "function" ? v() : v;

        if (airplane.codeMessage) {
            elf.CODEMESSAGE[k] = airplane.codeMessage;
        }
    });
};

export default elf;
