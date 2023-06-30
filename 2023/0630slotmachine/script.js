class SlotMachineNumber {
	constructor() {
		this._setupStyle();
	}
	_setupStyle() {
		const isInstalledStyle = document.querySelector(
			"[data-stylename=slotmachine]"
		);

		if (!isInstalledStyle) {
			const styleTag = document.createElement("style");
			styleTag.dataset.stylename = "slotmachine";

			const styleStrings = `
                ._target {
                    display: inline-flex;
                    align-items: center;
                }
                ._box {
                    position: relative;
                    overflow: hidden;
                    vertical-align: top;
                    display: inline-block;
                    box-sizing: border-box;
                }
                ._sizer {
                    display: inline-flex;
                    visibility: hidden;
                }
                ._belt {
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    filter: blur(0.5px);
                    transition: filter 2000ms ease;
                    box-sizing: border-box;
                    overflow: hidden;
                }
                ._beltnumber {
                    display: inline-flex;
                    box-sizing: border-box;
                }
                @keyframes slotting{ 0% {transform: translateY(0)} 100% {transform: translateY(-90%)}} }
            `;
			styleTag.innerHTML = styleStrings
				.replaceAll("  ", "")
				.replaceAll("\n", "");

			document.head.appendChild(styleTag);
		}
	}
	play(option) {
		let {
			target,
			number = "auto",
			stagger = 100,
			delay = 1000,
			random = false,
			locale = false,
		} = option;

		if (typeof target === "string") {
			target = document.querySelector(target);
		}

		if (number === "auto") {
			number = parseInt(target.innerText);
		}

		let numberString = number + "";
		if (locale) {
			numberString = number.toLocaleString();
		}

		const DOM = [...numberString]
			.map((slot) => {
				if (slot === ",") {
					return `<div>,</div>`;
				}
				return `
                    <div class="_box">
                        <div class="_belt">
                            ${(() => {
								const randomArray = [...Array(10).keys()].sort(
									() => 0.5 - Math.random()
								);
								const slice = randomArray.splice(
									randomArray.indexOf(+slot),
									1
								);
								randomArray.push(slice[0]);

								return randomArray
									.map(
										(n) =>
											`<div class="_beltnumber">${n}</div>`
									)
									.join("");
							})()}
                        </div>
                        <div class="_sizer">0</div>
                    </div>
                `;
			})
			.join("");

		target.classList.add("_target");
		target.innerHTML = DOM;

		const belts = target.querySelectorAll("._belt");

		const paintActions = [];
		for (let i = 0; i < belts.length; ++i) {
			let num = 0;
			const end = belts[i].offsetHeight * 0.9;
			const speed = 5 + Math.ceil(Math.random() * 5);

			const action = () => {
				num = num + speed;
				belts[i].style.transform = `translateY(-${num}px)`;
				if (num >= end) {
					num = 0;
				}
			};
			paintActions.push(action);
		}

		const orders = paintActions.map((item, idx) => idx);

		if (random) {
			orders.sort(() => (Math.random() > 0.5 ? 1 : -1));
		}

		for (let i = 0; i < paintActions.length; ++i) {
			const index = orders[i];
			setTimeout(() => {
				paintActions[index] = null;
				belts[index].style.animation = `slotting 1s ease-out both`;
				belts[index].style.filter = `blur(0px)`;
			}, i * stagger + delay);
		}

		const paint = () => {
			if (paintActions.every((item) => item === null)) {
				return;
			}
			for (let i = 0; i < paintActions.length; ++i) {
				paintActions[i] && paintActions[i]();
			}
			requestAnimationFrame(paint);
		};
		paint();

		belts[orders[orders.length - 1]].addEventListener(
			"animationend",
			() => {
				target.innerText = numberString;
				target.classList.remove("_target");
			},
			{ once: true }
		);
	}
}
