const storage = {
    options: {},
    reset: false,
};

const LIST_gitMessagePrefixTypes = ["Merge branch "];

const regex_mergeMessage = /Merge branch '([^']+)'.+into ([^\s]+)/;
const regex_pullMessage = /Merge branch '([^']+)'.*of/;
const STR_alreadyHighlight = "nexon-gitlab-styler-styled-highlight";
const STR_alreadyCommitlink = "nexon-gitlab-styler-styled-commit-link";
const STR_alreadyCheckOpened = "nexon-gitlab-styler-opened";

const LIST_querySelectors = [
    ".commit-box > .commit-title",
    ".commit-row-message",
    ".tree-commit-link",
];

const INT_tickrate = 1000;

const checkGitHash = (inputString) => {
    const regexPattern = /\[[0-9a-fA-F]{7,8}\]/;
    const matchResult = inputString.match(regexPattern);
    const isHaveGitHash = matchResult !== null;
    const withoutString = inputString.replace(regexPattern, "").trim();
    const slicedGitHash = isHaveGitHash ? matchResult[0].slice(1, -1) : null;
    return {
        isHaveGitHash,
        withoutString,
        slicedGitHash,
    };
};

const delay = async (time) => {
    return new Promise((resolve) => setTimeout(() => resolve(), time));
};

const renderHighLightCommit = () => {
    if (storage.reset) {
        const el_reset_targets = [
            ...document.querySelectorAll(`.${STR_alreadyHighlight}`),
        ];
        el_reset_targets.forEach((el) => {
            el.classList.remove(STR_alreadyHighlight);
        });
        chrome.storage.sync.set({ gitlabStylerResetElement: false });
        storage.reset = false;
    }

    const useEmoji = storage.options["use-emoji"];

    const el_commit_messages = [
        ...document.querySelectorAll(
            LIST_querySelectors.map(
                (string) => `${string}:not([class*=${STR_alreadyHighlight}])`
            ).join(",")
        ),
    ];

    el_commit_messages.forEach((el) => {
        el.classList.add(STR_alreadyHighlight);

        const message = el.innerText;

        const prefix = Object.entries(DATA_prefix).find(
            ([k]) => message.indexOf(`${k}:`) === 0
        );

        if (prefix) {
            const [key, value] = prefix;
            el.style.backgroundColor = value.color;
            el.style.borderRadius = "3px";
            el.style.padding = "1px 3px";
            el.style.boxSizing = "border-box";
            if (useEmoji) {
                el.innerText = el.innerText.replace(`${key}:`, value.emoji);
            }
            return;
        }

        const matchMergeMessage = message.match(regex_mergeMessage);

        if (matchMergeMessage) {
            [...el.parentElement.children].forEach((child) => {
                if (child.tagName !== "A" && child.tagName !== "H3") {
                    return;
                }

                child.style.opacity = 0.6;
                child.style.marginLeft = "35px";

                const sourceBranch = matchMergeMessage[1];
                const targetBranch = matchMergeMessage[2];

                const messageString = `
					<span style="padding:0px 2px; border-radius: 2px; box-sizing: border-box;border:1px solid rgba(60,60,255,0.2); background-color: rgba(60,60,255,0.05); color: rgba(60,60,255,1)">
						${targetBranch}
					</span>
					<span style="transform: scale(1.3); color: rgba(60,60,255,1); display:inline-block">
						&nbsp;🠔&nbsp;
					</span>
					<span style="padding:0px 2px; border-radius: 2px; box-sizing: border-box;border:1px solid rgba(0,0,0,0.2); background-color: rgba(0,0,0,0.02)">
						${sourceBranch}
					</span>
				`;

                child.innerHTML = messageString;
            });
            return;
        }

        const matchPullMessage = message.match(regex_pullMessage);

        if (matchPullMessage) {
            [...el.parentElement.children].forEach((child) => {
                if (child.tagName !== "A" && child.tagName !== "H3") {
                    return;
                }
                child.style.opacity = 0.6;
                child.style.marginLeft = "35px";

                const sourceBranch = matchPullMessage[1];

                const messageString = `
					<span style="padding:0px 2px; border-radius: 2px; box-sizing: border-box;border:1px solid rgba(255,100,100,0.2); background-color: rgba(255,100,100,0.05); color: rgba(255,100,100,1)">
						 ${sourceBranch}
					 </span>
					<span style="transform: scale(1.3); color: rgba(255,100,100,1); display:inline-block">
						&nbsp;🠗&nbsp;
					</span>
				 `;
                child.innerHTML = messageString;
            });
            return;
        }
    });
};

const urls = (() => {
    const href = window.location.href;
    let project = {};
    let type = null;
    let isMatcheData = false;

    for (let i = 0, l = LIST_projects.length; i < l; ++i) {
        const target = LIST_projects[i];
        if (href.indexOf(target.development) > -1) {
            type = "development";
            project = target;
            project.otherLink = project.deployment;
            isMatcheData = true;
            break;
        }
        if (href.indexOf(target.deployment) > -1) {
            type = "deployment";
            project = target;
            project.otherLink = project.development;
            isMatcheData = true;
            break;
        }
    }

    if (!isMatcheData) {
        let repoHref = href;
        const dashIndex = href.indexOf("/-/");
        if (dashIndex !== -1) {
            repoHref = repoHref.substring(0, dashIndex);
        }

        const regexDevelop = /\/development|\/develop/;
        const regexDeploy = /\/deployment|\/deploy/;
        if (regexDevelop.test(repoHref)) {
            project.development = repoHref;
            project.deployment = repoHref
                .replace("/development", "/deployment")
                .replace("/develop", "/deployment");
            project.otherLink = project.deployment;
            type = "development";
        } else if (regexDeploy.test(repoHref)) {
            project.development = repoHref
                .replace("/deployment", "/development")
                .replace("/deploy", "/development");
            project.deployment = repoHref;
            project.otherLink = project.development;
            type = "deployment";
        }
    }

    const pathname = window.location.pathname;
    const isDashboard =
        pathname === "/" ||
        pathname === "" ||
        pathname.indexOf("/dashboard") > -1;

    return {
        ...project,
        type,
        isMatcheData,
        isDashboard,
    };
})();

const renderWrapCommitLink = () => {
    if (!urls.development) {
        return;
    }
    const el_commit_messages = [
        ...document.querySelectorAll(
            LIST_querySelectors.map(
                (string) => `${string}:not([class*=${STR_alreadyCommitlink}])`
            ).join(",")
        ),
    ];

    el_commit_messages.forEach((el) => {
        el.classList.add(STR_alreadyCommitlink);
        const text = el.innerText;
        const { isHaveGitHash, slicedGitHash, withoutString } =
            checkGitHash(text);
        if (!isHaveGitHash) {
            return;
        }

        const href_dev = `${urls.development}/-/commit/${slicedGitHash}`;
        const href_origin = el.href;
        const childTag = el.tagName === "A" ? "a" : "span";

        const DOMString = `
            <a style="display:inline-flex;background-color: rgb(41, 41, 97); color: rgb(209, 209, 240); border-radius: 3px; padding: 0px 2px;font-weight: 600" href="${href_dev}" target="_blank">
                [${slicedGitHash}]
            </a>
            <${childTag} href="${href_origin}" target="_self" style="color: inherit; font-size: inherit">
                ${withoutString}
            </${childTag}>
        `;
        el.href = "";
        el.style.textDecoration = "none";
        el.innerHTML = DOMString;
    });
};

const checkLiveDeployInnerTick = (commitLine) => {
    const stages = [
        ...commitLine.querySelectorAll(
            ".dropdown-menu.js-builds-dropdown-container .ci-job-component"
        ),
    ];

    if (!stages.length) {
        setTimeout(() => checkLiveDeployInnerTick(commitLine), 400);
        return;
    }

    const liveStage = stages.find((stage) => {
        const regex = /(?=.*live)(?=.*deploy)/i;
        return regex.test(stage.innerText.trim());
    });
    if (!liveStage) {
        return;
    }
    const liveIcon = liveStage.querySelector(".ci-status-icon");
    const isLive = liveIcon.classList.contains("ci-status-icon-success");
    if (!isLive) {
        return;
    }

    const labelWrap = commitLine.querySelector(".label-container");

    const liveLabel = document.createElement("span");
    liveLabel.innerText = "live";
    liveLabel.classList.add("badge");
    liveLabel.style.color = "#fff";
    liveLabel.style.backgroundColor = "rgba(255, 50, 80, 0.8)";
    liveLabel.style.marginRight = "4px";
    labelWrap.append(liveLabel);
};

const checkLiveDeploy = async () => {
    const table = document.querySelector(".pipelines-container .ci-table");
    if (!table) {
        return;
    }

    const commits = [
        ...table.querySelectorAll(
            `.commit.gl-responsive-table-row:not([class*=${STR_alreadyCheckOpened}])`
        ),
    ];

    if (!commits.length) {
        return;
    }

    commits.forEach(async (commit) => {
        commit.classList.add(STR_alreadyCheckOpened);
        const buttons = [
            ...commit.querySelectorAll(`.mini-pipeline-graph-dropdown-toggle`),
        ];
        // buttons.forEach((button) => button.click());
        buttons[1].click();
        checkLiveDeployInnerTick(commit);
    });

    document.body.click();
    window.scrollTo(0, 0);
};

const tick = async () => {
    if (chrome?.storage?.sync) {
        const { gitlabStylerOptions } = await chrome.storage.sync.get(
            "gitlabStylerOptions"
        );
        const { gitlabStylerResetElement } = await chrome.storage.sync.get(
            "gitlabStylerResetElement"
        );
        storage.options = gitlabStylerOptions || {};
        storage.reset = gitlabStylerResetElement;
    }

    renderHighLightCommit();
    renderWrapCommitLink();
    checkLiveDeploy();

    setTimeout(tick, INT_tickrate);
};

const checkRepo = () => {
    const isDevelopment = urls.type === "development";
    const isDeployment = urls.type === "deployment";

    const isRepo = isDevelopment || isDeployment;

    if (!isRepo) {
        return;
    }
    const navSidebar = document.querySelector(".nav-sidebar");
    const navBar = document.querySelector(".navbar");
    const titleContainer = document.querySelector(".title-container");

    if (isDeployment) {
        navSidebar.style.filter = `invert(1)`;
        navBar.style.backgroundColor = `#000`;
        const deployTitle = document.createElement("p");
        deployTitle.innerText = "⚠️DEPLOY REPO";
        deployTitle.style.color = "#fff";
        deployTitle.style.display = "inline-flex";
        deployTitle.style.fontSize = "14px";
        deployTitle.style.fontWeight = "700";
        deployTitle.style.alignItems = "center";
        deployTitle.style.margin = "0 0";
        deployTitle.style.marginRight = "10px";
        titleContainer.append(deployTitle);
    }

    const otherLink = document.createElement("a");
    otherLink.href = urls.otherLink;
    otherLink.target = "_blank";
    otherLink.style.color = isDeployment ? "rgb(209, 209, 240)" : "#fff";
    otherLink.style.display = "inline-flex";
    otherLink.style.fontWeight = "700";
    otherLink.style.boxSizing = "border-box";
    otherLink.style.border = `1px solid ${
        isDeployment ? "rgb(209, 209, 240)" : "#fff"
    }`;
    otherLink.style.backgroundColor = isDeployment ? "rgb(41, 41, 97)" : "#000";
    otherLink.style.borderRadius = "5px";
    otherLink.style.alignSelf = "center";
    otherLink.style.padding = "0px 6px 3px";
    otherLink.innerText = `open ${isDeployment ? "develop" : "deploy"}`;
    otherLink.fontSize = "16px";
    otherLink.fontWeight = "700";

    titleContainer.append(otherLink);
};

const checkDashboard = () => {
    const isDashboard = urls.isDashboard;
    if (!isDashboard) {
        return;
    }
    const titleHolder = document.querySelector(".page-title-holder");
    if (!titleHolder) {
        return;
    }
    titleHolder.style.display = "flex";
    titleHolder.style.flexDirection = "column";
    titleHolder.classList.remove("align-items-center");
    titleHolder.style.alignItems = "flex-start !important";

    const title = titleHolder.querySelector(".page-title");
    title.innerHTML = `
        <a href="https://gitlab.nexon.com/dashboard/projects" style="color: #000">Projects</a>
    `;

    const list = document.createElement("ul");
    list.style.display = "flex";
    list.style.alignItems = "center";
    list.style.gap = "4px";
    list.style.margin = "0";
    list.style.marginBottom = "10px";
    list.style.padding = "0";

    const searchParams = new URLSearchParams(window.location.search);
    const searchValue = searchParams.get("name");

    const reduceData = LIST_projects.reduce(
        (memo, item) => {
            if (memo.keywords[item.keyword]) {
                return memo;
            }
            const newMemo = { ...memo };
            newMemo.keywords[item.keyword] = true;
            newMemo.list = [
                ...memo.list,
                {
                    name: item.name,
                    keyword: item.keyword,
                },
            ];
            return newMemo;
        },
        {
            list: [],
            keywords: {},
        }
    );

    const listString = reduceData.list
        .map((item) => {
            const searchlink = `https://gitlab.nexon.com/dashboard/projects?utf8=%E2%9C%93&name=${item.keyword}&sort=name_asc`;
            const isExact = item.keyword === searchValue;
            const color = isExact ? "#fff" : "#111";
            const backgroundColor = isExact
                ? "#292961"
                : "rgba(209,209,240,0.4)";
            const fontWeight = isExact ? 700 : 400;

            return `
            <li style="display: flex">
                <a
                    style="display: inline-flex; width: 100%; font-size: 14px;padding: 1px 4px 2px; background-color: ${backgroundColor}; color: ${color};border-radius: 3px; font-weight: ${fontWeight}"
                    href="${searchlink}"
                >
                    ${item.name}
                </a>
            </li>
        `;
        })
        .join("");

    list.innerHTML = listString;

    const projectList = document.querySelectorAll(".projects-list li");

    [...projectList].forEach((li) => {
        const name = li
            .querySelector(".flex-wrapper")
            .innerText.toLowerCase()
            .replaceAll(/\s/g, "");

        let order = 0;
        const isFront =
            name.includes("front") ||
            name.includes("html") ||
            name.includes("프론트");
        const isBack =
            name.includes("backend") ||
            name.includes("api") ||
            name.includes("백엔드");
        const isDevelop =
            name.includes("develop") ||
            name.includes("개발") ||
            name.includes("소스");
        const isDeploy = name.includes("deploy") || name.includes("배포");
        const isOther = !isFront && !isBack;
        const isDeprecated = name.includes("사용x");

        li.style.paddingLeft = "10px";
        li.style.paddingRight = "10px";

        if (isFront) {
            order += 0;
            li.style.backgroundColor = "rgba(0,150,255, 0.04)";
        } else if (isBack) {
            order += 5;
            li.style.backgroundColor = "rgba(0,255,100, 0.04)";
        }
        if (isDevelop) {
            order += 1;
        } else if (isDeploy) {
            order += 2;
            li.style.borderLeft = "5px solid rgba(0,0,0,0.5)";
        }
        if (isOther) {
            order += 10;
        }
        if (isDeprecated) {
            li.style.opacity = 0.4;
            li.style.backgroundColor = "transparent";
            order += 10;
        }
        li.style.order = order;
    });

    titleHolder.append(list);
};

const initContent = () => {
    tick();
    checkDashboard();
    checkRepo();
};

initContent();
