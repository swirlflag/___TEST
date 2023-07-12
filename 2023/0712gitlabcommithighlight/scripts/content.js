const DICT_prefix = {
	feat: {
		color: "rgba(209, 255, 211, 0.3)",
		emoji: "✨",
	},
	hotfix: {
		color: "rgba(255, 0, 85, 0.1)",
		emoji: "🚑️",
	},
	fix: {
		color: "rgba(5, 95, 240, 0.12)",
		emoji: "🐛",
	},
	test: {
		color: "rgba(255, 128, 0, 0.2)",
		emoji: "🧪",
	},
	refactor: {
		color: "rgba(186, 255, 241, 0.1)",
		emoji: "♻️",
	},
	wip: {
		color: "rgba(255, 246, 150, 0.1)",
		emoji: "🚧",
	},
	style: {
		color: "rgba(234, 0, 255, 0.1)",
		emoji: "🎨",
	},
	etc: {
		color: "rgba(0,0,0, 0.1)",
		emoji: "🏷️",
	},
};

const LIST_gitMessagePrefixTypes = ["Merge branch "];

const STR_alreadyClassName = "nexon-gitlab-styler-styled";

const LIST_querySelectors = [
	".commit-title",
	".commit-row-message",
	".tree-commit-link",
];

const INT_tickrate = 1000;

const renderHighLight = () => {
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
			el.innerText = el.innerText.replace(`${key}:`, value.emoji);
			return;
		}

		const isGitMessage = LIST_gitMessagePrefixTypes.some(
			(type) => message.indexOf(type) === 0
		);

		if (isGitMessage) {
			el.style.fontStyle = "italic";
			el.style.opacity = 0.5;
			el.style.fontWeight = 300;
			return;
		}
	});
};

const tick = () => {
	renderHighLight();
	setTimeout(tick, INT_tickrate);
};

tick();
