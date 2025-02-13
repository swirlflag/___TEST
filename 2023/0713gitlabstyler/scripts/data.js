const DATA_prefix = {
    feat: {
        color: "rgba(0,255,11, 0.1)",
        emoji: "✨",
    },
    hotfix: {
        color: "rgba(255,0,0,0.1)",
        emoji: "🚑️",
    },
    fix: {
        color: "rgba(0,98,255, 0.12)",
        emoji: "🐛",
    },
    test: {
        color: "rgba(255,128,30,0.15)",
        emoji: "🧪",
    },
    refactor: {
        color: "rgba(0,224,255,0.15)",
        emoji: "♻️",
    },
    wip: {
        color: "rgba(255, 233, 0, 0.18)",
        emoji: "🚧",
    },
    style: {
        color: "rgba(255, 0, 229, 0.08)",
        emoji: "🎨",
    },
    etc: {
        color: "rgba(0,0,0, 0.12)",
        emoji: "🏷️",
    },
    design: {
        color: "rgba(90,255,200,0.2)",
        emoji: "🖼️",
    },
    ui: {
        color: "rgba(90,255,200,0.2)",
        emoji: "🖼️",
    },
    git: {
        color: "rgba(241, 78, 50, 0.15)",
        emoji: "📚",
    },
    merge: {
        color: "rgba(241, 78, 50, 0.15)",
        emoji: "🔀",
    },
};

const LIST_projects = [
    // 던파모바일
    {
        name: "던파모바일",
        detail: "던파모바일 웹",
        keyword: "던파모바일",
        development: "https://gitlab.nexon.com/live_webdev/dnfm/dnfm_web",
        deployment:
            "https://gitlab.nexon.com/live_webdev/deploy/dnfm/dnfm_brandweb",
    },
    {
        name: "던파모바일",
        detail: "던파모바일 HTML",
        keyword: "던파모바일",
        development: "https://gitlab.nexon.com/live_webdev/dnfm/dnfm_html",
        deployment:
            "https://gitlab.nexon.com/live_webdev/deploy/dnfm/dnfm_event",
    },
    // 프라시아전기
    {
        name: "프라시아전기",
        detail: "프라시아전기 프론트",
        keyword: "프라시아전기",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/wp/development/frontend/com.nexon.wp",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/wp/deployment/frontend/com.nexon.wp-azure",
    },
    {
        name: "프라시아전기",
        detail: "프라시아전기 백엔드",
        keyword: "프라시아전기",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/wp/development/backend/com.nexon.wp-api",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/wp/deployment/backend/com.nexon.wp-api",
    },
    // 블루아카이브
    {
        name: "블루아카이브",
        detail: "블루아카이브 프론트",
        keyword: "블루아카이브",
        development:
            "https://gitlab.nexon.com/clweb/bluearchive/frontend/kr-bluearchive",
        deployment:
            "https://gitlab.nexon.com/clweb/bluearchive/frontend/deployment/com.nexon.bluearchive",
    },
    {
        name: "블루아카이브",
        detail: "블루아카이브 API",
        keyword: "블루아카이브",
        development:
            "https://gitlab.nexon.com/clweb/bluearchive/backend/ba_api",
        deployment:
            "https://gitlab.nexon.com/clweb/bluearchive/backend/deployment/com.nexon.baapi",
    },
    {
        name: "블루아카이브",
        detail: "블루아카이브 백오피스",
        keyword: "블루아카이브",
        development:
            "https://gitlab.nexon.com/clweb/bluearchive/backend/ba_backoffice",
        deployment:
            "https://gitlab.nexon.com/clweb/bluearchive/backend/deployment/com.nexon.babackoffice",
    },

    // 환세취호전
    {
        name: "환세취호전",
        detail: "환세취호전 프론트",
        keyword: "환세취호전",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/krgs/development/frontend/com.nexon.genseionline",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/krgs/deployment/frontend/com.nexon.genseionline",
    },
    {
        name: "환세취호전",
        detail: "환세취호전 백엔드",
        keyword: "환세취호전",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/krgs/development/backend/krgs_api",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/krgs/deployment/backend/krgs_api",
    },

    // 카잔
    {
        name: "카잔",
        detail: "카잔 프론트",
        keyword: "khazan kz",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/kz/development/frontend/com.nexon.kz",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/kz/deployment/frontend/com.nexon.kz",
    },

    // 바람의나라 연
    {
        name: "바람연",
        detail: "바람연 UI - s1(html)",
        keyword: "BaramY",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/frontresource/baramy/baramy_s1",
        deployment:
            "https://gitlab.nexon.com/live_webdev/deploy/baramy/baramy_web",
    },
    {
        name: "바람연",
        detail: "바람연 UI - s3(js)",
        keyword: "BaramY",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/frontresource/baramy/baramy_s3",
        deployment:
            "https://gitlab.nexon.com/live_webdev/deploy/baramy/baramy_web",
    },
    {
        name: "바람연",
        detail: "바람연 웹",
        keyword: "BaramY",
        development: "https://gitlab.nexon.com/live_webdev/baramy/baramy_web",
        deployment:
            "https://gitlab.nexon.com/live_webdev/deploy/baramy/baramy_web",
    },

    // JARVIS
    {
        name: "JARVIS",
        detail: "JARVIS WEB",
        keyword: "jarvis",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/jarvis/development/backend/jarvis",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/jarvis/deployment/backend/jarvis.nexon.com",
    },
    {
        name: "JARVIS",
        detail: "JARVIS API",
        keyword: "jarvis",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/jarvis/development/backend/jarvis-api",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/jarvis/deployment/backend/jarvis-api.nexon.com",
    },

    // HIT2
    {
        name: "HIT2",
        detail: "히트2 프론트",
        keyword: "hit2",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/hit2/development/frontend/hit2-front",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/hit2/deployment/frontend/live_deploy_webv3_front",
    },
    {
        name: "HIT2",
        detail: "히트2 대만 프론트",
        keyword: "hit2",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/hit2_tw_event/develop/hit2tw-front-event",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/hit2_tw_event/deployment/live_deploy_event-front-event",
    },
    {
        name: "HIT2",
        detail: "히트2 API",
        keyword: "hit2",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/hit2/development/backend/hit2.core",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/hit2/deployment/backend/live_deploy_webv2_api",
    },
    {
        name: "HIT2",
        detail: "히트2 대만 API",
        keyword: "hit2",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/hit2_tw_event/develop/hit2tw-api-event",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/hit2_tw_event/deployment/live_deploy_event-api-event",
    },

    // 진삼국무쌍M
    {
        name: "진삼국무쌍M",
        detail: "진삼국무쌍M 프론트",
        keyword: "dwm",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/dwm/development/frontend/com.nexon.dwm",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/dwm/deployment/frontend/com.nexon.dwm",
    },
    {
        name: "진삼국무쌍M",
        detail: "진삼국무쌍M API",
        keyword: "dwm",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/dwm/development/backend/dwm_api",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/dwm/deployment/backend/com.nexon.dwm-api",
    },

    // 퍼스트 디센던트
    {
        name: "퍼스트디센던트",
        detail: "퍼스트디센던트 프론트",
        keyword: "TFD",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/tfd/development/frontend/com.nexon.tfd",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/tfd/deployment/frontend/com.nexon.tfd",
    },
    {
        name: "퍼스트디센던트",
        detail: "퍼스트디센던트 API",
        keyword: "TFD",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/tfd/development/backend/tfd_api",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/tfd/deployment/backend/tfd_api",
    },

    // 슈퍼바이브
    {
        name: "슈퍼바이브",
        detail: "슈퍼바이브 프론트",
        keyword: "슈퍼바이브",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/sv/development/frontend/com.nexon.supervive",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/sv/deployment/frontend/com.nexon.supervive",
    },
    {
        name: "슈퍼바이브",
        detail: "슈퍼바이브 API",
        keyword: "슈퍼바이브",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/sv/development/backend/sv_api",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/sv/deployment/backend/sv_api",
    },

    // 슈퍼바이브
    {
        name: "슈퍼바이브",
        detail: "슈퍼바이브 프론트",
        keyword: "슈퍼바이브",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/sv/development/frontend/com.nexon.supervive",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/sv/deployment/frontend/com.nexon.supervive",
    },
    {
        name: "슈퍼바이브",
        detail: "슈퍼바이브 API",
        keyword: "슈퍼바이브",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/sv/development/backend/sv_api",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/sv/deployment/backend/sv_api",
    },

    // 바람의나라2
    {
        name: "바람의나라2",
        detail: "바람의나라2 프론트",
        keyword: "바람2",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/baram2/development/frontend/com.nexon.baram2",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/baram2/deployment/frontend/com.nexon.baram2",
    },
    {
        name: "바람의나라2",
        detail: "바람의나라2 API",
        keyword: "바람2",
        development:
            "https://gitlab.nexon.com/PublishingRPG_Web/baram2/development/backend/com.nexon.baram2-api",
        deployment:
            "https://gitlab.nexon.com/PublishingRPG_Web/baram2/deployment/backend/com.nexon.baram2-api",
    },
];
