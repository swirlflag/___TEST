class StoreComponent {
	constructor(initStates, options = {proxy : false}) {
		this.options = options;
		this.events = {};
		this.subscribe = {};
		this.state = {};
		this.beforeState = {};
		this.setState({ ...initStates });



		if(options.proxy) {
			return this._makeProxy(options.proxy,initStates);
		}else {
			return this;
		}

	}

	_makeProxy(options, initStates) {
		return new Proxy(this, {
			get: (target, prop, proxy) => {
				let result = null;
				if(options.get) {
					result = options.get(target, prop, proxy, initStates);
					if(result !== undefined) {
						return result
					}
				}
				if(target.state.hasOwnProperty(prop)) {
					return target.state[prop];
				}else {
					return target[prop];
				}
			},
			set: (target, prop, value, proxy,) => {
				if(target.state.hasOwnProperty(prop)) {
					target.setState(prop, value);
				}else {
					target[prop] = value;
				}
				options.set && options.set(target, prop, value, proxy, initStates);
				return true;
			}
		});
	}

	setState(state = {}, value = null, options = {}) {
		this.beforeState = { ...this.state };
		const { exact } = options;

		if (typeof state === "string") {
			const key = state;
			if (exact && this.state[key] === value) {
				return;
			}

			const newState = { ...this.state };
			newState[key] = value;
			this.state = newState;
			this.trigger(key);
		} else if (typeof state === "object") {
			const newState = {
				...this.state,
				...state,
			};

			this.state = newState;

			Object.entries(state).forEach(([key,value]) => {
				this.trigger(key);
				// if(this.options.direct) {
				// 	this[key] = value;
				// }
			});
		}
	}

	// setState를 사용한 state변경시 실행시킬 함수를 등록.
	watch(stateName, fn) {
		if (typeof stateName === "string" && typeof fn === "function") {
			if (!this.subscribe[stateName]) {
				this.subscribe[stateName] = [];
			}
			this.subscribe[stateName] = [...this.subscribe[stateName], fn];
		}
	}

	// 컴포넌트 내부에서 배치한 커스텀 이벤트를 실행시킬 함수를 등록.
	on(eventName, fn) {
		if (typeof eventName === "string" && typeof fn === "function") {
			if (!this.events[eventName]) {
				this.events[eventName] = [];
			}
			this.events[eventName] = [...this.events[eventName], fn];
		}
	}

	// 컴포넌트의 커스텀 이벤트를 실행할곳에 배치.
	eventFire(eventName, data) {
		if (this.events[eventName]) {
			this.events[eventName].forEach((fn) => {
				fn(this, data);
			});
		}
	}

	trigger(key) {
		if (this.subscribe[key]) {
			const now = this.state[key];
			const before = this.beforeState[key];
			this.subscribe[key].forEach((fn) => {
				fn(now, before, this);
			});
		}
	}
}

class ModalObject extends StoreComponent {
	constructor(root, options) {
		if(!root) {
			console.error("모달 타겟이 없습니다.");
			return null;
		}
		super();
		this.el = {};
		this.el.root = root;
		this.tl = gsap.timeline();
		this.onConfirm = null;
		this.onCancel = null;
		this.onClose = null;
		const initialStore = {
			isOpen: false,
			confirm: true,
			cancel: true,
			message: "",
			...options,
		};

		this.setState(initialStore);
		this._init();
	}

	_init() {
		this._setupElement();
		this._setupEvent();
	}

	_setupElement() {
		this.el.box = this.el.root.querySelector(".modal__box");
		this.el.dimmed = this.el.root.querySelector(".modal__dimmed");
		this.el.close = this.el.root.querySelector(".modal__close");
		this.el.confirm = this.el.root.querySelector(".modal__controls ._confirm");
		this.el.cancel = this.el.root.querySelector(".modal__controls ._cancel");
		this.el.message = this.el.root.querySelector(".modal__message");
		gsap.set(this.el.box, { autoAlpha: 0, y: 20 });
		gsap.set(this.el.dimmed, { autoAlpha: 0 });
	}

	_setupEvent() {

		const close = () => {
			this.close();
			this.eventFire("close");
			if(this.onClose) {
				this.onClose(this);
				this.onClose = null;
			}
		};

		const confirm = () => {
			close();
			this.eventFire("confirm");
			if(this.onConfirm) {
				this.onConfirm(this);
				this.onConfirm = null;
			}
		};

		const cancel = () => {
			close();
			this.eventFire("cancel");
			if(this.onCancel) {
				this.onCancel(this);
				this.onCancel = null;
			}
		};

		this.el.close && this.el.close.addEventListener("click", () => {
			close();
		});

		this.el.dimmed && this.el.dimmed.addEventListener("click", () => {
			if(this.state.ignoreDimmed) {
				return;
			}
			close();
		});
		this.el.confirm && this.el.confirm.addEventListener("click", () => {
			confirm();
		});
		this.el.cancel && this.el.cancel.addEventListener("click", () => {
			cancel();
		});

		this.watch("message", (now) => {
			this.el.message && (this.el.message.innerHTML = now);
		});

		this.watch("isOpen", (now) => {
			now ? this._openAction() : this._closeAction();
		});

		this.watch("confirm", (now) => {
			this.el.confirm && this.el.confirm.classList[now ? "remove" : "add" ]("-hide");
		});
		this.watch("cancel", (now) => {
			this.el.cancel && this.el.cancel.classList[now ? "remove" : "add" ]("-hide");
		});
	}

	_openAction() {
		this.el.root.classList.add("-open");
		this.tl.pause().clear();
		this.tl.to(this.el.dimmed, { autoAlpha: 1, duration: 0.3 }, 0);
		this.tl.to(this.el.box, { autoAlpha: 1, ease: "power2.out", duration: 0.25 }, 0 );
		this.tl.fromTo(this.el.box, { y: 20 }, { y: 0, ease: "power2.out", duration: 0.4 }, 0);
		this.tl.play();
		this.eventFire("open");
	}

	_closeAction() {
		this.el.root.classList.remove("-open");
		this.tl.pause().clear();
		this.tl.to(this.el.dimmed, { autoAlpha: 0, duration: 0.3 }, 0);
		this.tl.to( this.el.box,{ autoAlpha: 0, ease: "power2.out", duration: 0.25 }, 0);
		this.tl.fromTo(this.el.box, { y: 0 }, { y: 10, ease: "power2.out", duration: 0.3 },0 );
		this.tl.play();
		this.eventFire("close");
	}

	open(options = {}) {
		const {
			message = null,
			confirm = true,
			cancel = false,
			onClose = null,
			onConfirm = null,
			onCancel = null,
		} = options;

		message && this.setState("message", message , {exact: true});
		this.setState("confirm", confirm , {exact: true});
		this.setState("cancel", cancel , {exact: true});
		this.setState("isOpen", true, {exact : true});

		if(onClose) {
			this.onClose = onClose;
		}
		if(onConfirm) {
			this.onConfirm = onConfirm;
		}
		if(onCancel) {
			this.onCancel = onCancel;
		}
	}
	close() {
		this.setState("isOpen", false, {exact : true});
	}
};

class ModalObjectVideo extends ModalObject {
	constructor(root, options) {
		super(root, options);
		this._initExtend();
		this.trigger("youtube");
	}

	_initExtend() {
		this._setupElementVideo();
		this._setupEventVideo();
	}

	_setupElementVideo() {
		this.el.source = this.el.root.querySelector(".sourcebox");
		this.el.iframe = this.el.root.querySelector(".sourcebox iframe");
		this.el.video = this.el.root.querySelector(".sourcebox video");
	}

	_setupEventVideo() {
		this.watch("youtube", (now) => {
			if (this.el.iframe && now) {
				this.el.iframe.setAttribute(
					"src",
					`https://www.youtube.com/embed/${now}?rel=0&enablejsapi=1`
				);
			}
		});

		this.watch("isOpen", (now) => {
			this.trigger("youtube");
		})
	}

	setYoutube(key) {
		this.setState("youtube", key, {exact: true});
	}
};

const targetPathDetect = (e,...targets) => {

    const path = e.composedPath ? e.composedPath() : e.path;

    for(let i = 0, il = path.length; i < il; ++i){
        for(let j = 0 , jl = targets.length; j < jl; ++j ){
            if(targets[j] === path[i]){
                return true;
            }
        }
    }

    return false;

}

class MapExplorer {
	constructor(canvas, image) {
		const defaultValue = {
			mapPower: 0.25,
			cursorPower: 0.35,
			initScale: 0.1,
			limitCloseoutScale: 0.7,
			limitCloseupScale: 1.4,
			focusScale: 2.7,
		};

		this.isFreeze = false;
		this.size = {
			ww: window.innerWidth,
			wh: window.innerWidth,
			cx: window.innerWidth/2,
			cy: window.innerHeight/2,
		};

		this.focus = {
			x: 0,
			y: 0,
			scale: defaultValue.initScale,
			width: 0,
			height: 0,
			xPercent: 50,
			yPercent: 50,
			xPercentMap :50,
			yPercentMap :50,
		};

		this.map = {
			source: image,
			x: 0,
			y: 0,
			scale: defaultValue.initScale,
			width: 0,
			height: 0,
			power: defaultValue.mapPower,
		};

		this.mouse = {
			x: 0,
			y: 0,
		};

		this.cursor = {
			x: 0,
			y: 0,
			power: defaultValue.cursorPower,
		};

		this.press = {
			isPress: false,
			time: 0,
			timer: null,

			startFocusX : 0,
			startFocusY : 0,
			startPressX: 0,
			startPressY: 0,
			moveX: 0,
			moveY: 0,
		};

		this.el = {
			canvas: canvas,
		};

		this.ctx = null;

		this._init();
	}

	_init() {
		this._setupImage();
		this._setupElement();
		this._setupEvent();
	}

	_setupImage() {
		this.map.source.onload = () => {
			this.focus.width = mapSource.width * focus.scale;
			this.focus.height = mapSource.height * focus.scale;
			this.map.width = focus.width;
			this.map.height = focus.height;

			this.ctx.canvas.width = size.ww;
			this.ctx.canvas.height = size.wh;

			this.setScale(focus.scale);
			this.setFocusPercent(50,50);
		};
	}

	_setupElement() {
		// this.el.canvas = ;
	}

	_setupEvent() {
		window.addEventListener("resize", () => {
			this.size.ww = window.innerWidth;
			this.size.wh = window.innerHeight;
			this.size.cx = window.innerWidth/2;
			this.size.cy = window.innerHeight/2;

			this.ctx.canvas.width = size.ww;
			this.ctx.canvas.height = size.wh;

			this.setFocusMapPercent(focus.xPercentMap, focus.yPercentMap);
		});

		window.addEventListener("mousewheel", () => {
			const direction = e.deltaY > 0;
			if(direction) {
				// if(focus.scale > defaultValue.limitCloseoutScale) {
					setScale(focus.scale - 0.05);
				// }
			}else {
				// 확대
				// if(focus.scale < defaultValue.limitCloseupScale) {
					setScale(focus.scale + 0.05);
				// }
			}

			setFocus();
		});

		window.addEventListener("mousedown", (e) => {
			this._pressDown(e);
		});
		window.addEventListener("mousemove", (e) => {
			this._pressMove(e);
		});
		window.addEventListener("mouseup", (e) => {
			this._pressUp();
		});
		window.addEventListener("mouseout", (e) => {
			// pressUp();
		});

		window.addEventListener("touchstart", (e) => {
			this._pressDown(e.touches[0]);
		});
		window.addEventListener("touchmove", (e) => {
			this._pressMove(e.touches[0]);
		});
		window.addEventListener("touchend", (e) => {
			this._pressUp();
		});

		const render = () => {
			this._draw();
			requestAnimationFrame(render);
		}

		render();
	}

	_pressDown(x, y, path) {
		if(this.isFreeze) {
			return;
		}

		if(path) {
			for(let i = 0, l = path.length; i < l; ++i) {
				const isWorldmap = path[i].classList?.contains('worldmap');
				if(isWorldmap) {
					break;
				}
				if(i === path.length -1 ) {
					return;
				}
			}
		}

		this.press.isPress = true;
		this.press.startPressX = x;
		this.press.startPressY = y;
		this.press.startFocusX = this.focus.x;
		this.press.startFocusY = this.focus.y;
	}

	_pressMove(x, y) {
		if(!press.isPress) {
        	return;
		}
		if(focus.isFreeze) {
			return;
		}

		this.press.moveX = x;
		this.press.moveY = y;

		const dx = this.press.moveX - this.press.startPressX;
		const dy = this.press.moveY - this.press.startPressY;

		const x = this.press.startFocusX - dx;
		const y = this.press.startFocusY - dy;

		const dmax = Math.max(Math.abs(dx),Math.abs(dy));
		// if(dmax > 300 && store.isPointFocusing) {
		// 	store.setState("pointFocusIndex" , -1);
		// 	pressDown(x,y);
		// 	return;
		// }

		setFocus(x,y);
	}

	_pressUp() {
		this.press.isPress = false;
		this.press.moveX = 0;
		this.press.moveY = 0;
		this.press.startFocusX = 0;
		this.press.startFocusY = 0;
	}

	_perRound() {
    	return (Math.round(value * 1000))/10;
	}

	_draw() {
		const d = {
			x: this.focus.x - this.map.x,
			y: this.focus.y - this.map.y,
			scale: this.focus.scale - this.map.scale,
		};

		const x = this.map.x + (d.x * this.map.power);
		const y = this.map.y + (d.y * this.map.power);
		const scale = this.map.scale + (d.scale * this.map.power);

		map.x = x;
		map.y = y;
		map.scale = scale;

		map.width = this.map.source.width * map.scale;
		map.height = this.map.source.height * map.scale;

		// $mappoints.style.transform = `translate3d(${-x}px,${-y}px,0)`
		// $mappoints.style.width = `${map.width}px`;
		// $mappoints.style.height = `${map.height}px`;

		this.ctx.drawImage(this.map.source, -map.x, -map.y, map.width , map.height);
	}

	setFocus(willX, willY) {
		willX = willX === undefined ? focus.x : willX;
		willY = willY === undefined ? focus.y : willY;

		let isOverX = this.focus.width - willX - this.size.ww < 0;
		let isOverY = this.focus.height - willY - this.size.wh < 0;

		let limitX = this.focus.width - this.size.ww - 1;
		let limitY = this.focus.height - this.size.wh - 1;

		let x = willX;
		let y = willY;

		if(willX <= 0) {
			x = 0;
		}
		if(isOverX) {
			x = limitX;
		}

		if(willY <= 0) {
			y = 0;
		}
		if(isOverY) {
			y = limitY;
		}

		this.focus.x = Math.round(x);
		this.focus.y = Math.round(y);

		const xPercent = this._perRound(this.focus.x / (this.focus.width - this.size.ww));
		const yPercent = this._perRound(this.focus.y / (this.focus.height - this.size.wh));
		focus.xPercent = xPercent;
		focus.yPercent = yPercent;

		const xPercentMap = this._perRound((this.focus.x + this.size.cx) / (this.focus.width));
		const yPercentMap = this._perRound((this.focus.y + this.size.cy) / (this.focus.height));
		focus.xPercentMap = xPercentMap;
		focus.yPercentMap = yPercentMap;

		// $crossheadtext.innerHTML = `focus<br>x: ${focus.x} (${xPercent}%)<br>y: ${focus.y} (${yPercent}%)`;
	}

	setFocusPercent(xPercent, yPercent) {
		const x = (this.focus.width - this.size.ww)/100 * xPercent;
		const y = (this.focus.height - this.size.wh)/100 * yPercent;
		this.setFocus(x,y);
	}

	setFocusMapPercent(xPercent, yPercent) {
		const x = this.focus.width/100 * xPercent - this.size.cx;
    	const y = this.focus.height/100 * yPercent - this.size.cy;
		this.setFocus(x,y);
	}

	setScale(scale, power) {
		scale = scale <= 0.001 ? 0.001 : scale;

		const origin = {
			x: 1/focus.scale * focus.x,
			y: 1/focus.scale * focus.y,
		};

		origin.x = origin.x - (this.size.cx - (1/this.focus.scale * this.size.cx));
		origin.y = origin.y - (this.size.cy - (1/this.focus.scale * this.size.cy));

		if(this.map.source.width * scale < this.size.ww) {
			scale = (this.size.ww+1) / (this.map.source.width);
		}
		if(this.map.source.height * scale < this.size.wh) {
			scale = (this.size.wh+1) / (this.map.source.height);
		}

		let x = ((origin.x - this.size.cx/scale) * scale) + (this.size.cx * scale);
		let y = ((origin.y - this.size.cy/scale) * scale) + (this.size.cy * scale);

		this.focus.scale = scale;
		this.focus.width = this.map.source.width * scale;
		this.focus.height = this.map.source.height * scale;
		this.focus.x = x;
		this.focus.y = y;
	}

}