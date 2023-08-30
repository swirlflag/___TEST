const DICT_prefix = {
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
		color: "rgba(255,128,0,0.15)",
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
};

const storage = {
	options: {},
	reset: false,
}

const LIST_gitMessagePrefixTypes = ["Merge branch "];

const STR_alreadyClassName = "nexon-gitlab-styler-styled";

const LIST_querySelectors = [
	".commit-box > .commit-title",
	".commit-row-message",
	".tree-commit-link",
];

const INT_tickrate = 1000;

const renderHighLight = () => {

	if(storage.reset) {
		const el_reset_targets = [...document.querySelectorAll(`.${STR_alreadyClassName}`)];
		el_reset_targets.forEach((el) => {
			el.classList.remove(STR_alreadyClassName);
		});
		chrome.storage.sync.set({gitlabStylerResetElement: false});
		storage.reset = false;
	}

	const el_commit_messages = [
		...document.querySelectorAll(
			LIST_querySelectors.map(
				(string) => `${string}:not([class*=${STR_alreadyClassName}])`
			).join(",")
		),
	];

	el_commit_messages.forEach((el) => {
		el.classList.add(STR_alreadyClassName);

		const message = el.innerText;

		const prefix = Object.entries(DICT_prefix).find(
			([k]) => message.indexOf(`${k}:`) === 0
		);

		if (prefix) {
			const [key, value] = prefix;
			el.style.backgroundColor = value.color;
			if(storage.options['use-emoji']){
				el.innerText = el.innerText.replace(`${key}:`, value.emoji);
			}
			return;
		}

		const isGitMessage = LIST_gitMessagePrefixTypes.some(
			(type) => message.indexOf(type) === 0
		);

		if (isGitMessage) {
			[...el.parentElement.children].forEach((child) => {
				if(child.tagName === "A") {
					child.style.fontStyle = "italic";
					child.style.opacity = 0.5;
					child.style.fontWeight = 300;
				}
			});
			return;
		}
	});

};

const tick = async () => {
	if(chrome?.storage?.sync) {
		const { gitlabStylerOptions } = await chrome.storage.sync.get("gitlabStylerOptions");
		const { gitlabStylerResetElement } = await chrome.storage.sync.get("gitlabStylerResetElement");
		storage.options = gitlabStylerOptions || {};
		storage.reset = gitlabStylerResetElement;
	}

	renderHighLight();

	setTimeout(tick, INT_tickrate);
};

const checkDeployRepo = () => {
	const isDeployment = window.location.href.indexOf('/deployment') > -1;

	if (!isDeployment) {
		return;
    }

	const navSidebar = document.querySelector(".nav-sidebar");
	const navBar = document.querySelector(".navbar");
	const titleContainer = document.querySelector(".title-container");

	navSidebar.style.filter = `invert(1)`;
	navBar.style.backgroundColor = `#000`;

	const deployTitle = document.createElement("p");
	deployTitle.innerText = "⚠️ THIS IS DEPLOY REPO";
	deployTitle.style.color = "#fff";
	deployTitle.style.display = "inline-flex";
	deployTitle.style.fontSize = "14px";
	deployTitle.style.fontWeight = "700";
	deployTitle.style.alignItems = "center";
	deployTitle.style.margin = "0 0";
	titleContainer.append(deployTitle);
};

const initContent = () => {
	tick();
	checkDeployRepo();
}

initContent();
