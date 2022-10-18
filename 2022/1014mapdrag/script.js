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
	constructor() {
		this.state = {
			size: {
				ww: window.innerWidth,
				wh: window.innerWidth,
				cx: window.innerWidth/2,
				cy: window.innerHeight/2,
			},
			focus: {

			},
			map: {

			},
			mouse: {

			},
			cursor: {

			},
			press: {
				isPress: false,
				time: 0,
				timer: null,

				startFocusX : 0,
				startFocusY : 0,
				startPressX: 0,
				startPressY: 0,
				moveX: 0,
				moveY: 0,
			},
		};

		this.el = {};

		this.ctx = null;

		this._init();
	}

	_init() {
		this._setupElement();
		this._setupEvent();
	}

	_setupElement() {

	}

	_setupEvent() {

	}

	_pressDown(x, y) {
		this.state.press.isPress = true;
		this.state.press.startPressX = x;
		this.state.press.startPressY = y;
		this.state.press.startFocusX = this.state.focus.x;
		this.state.press.startFocusY = this.state.focus.y;
	}

	_pressMove(x, y) {
		if(!this.state.press.isPress) {
			return;
		}
		press.moveX = x;
    	press.moveY = y;
		// const dx = press.moveX - press.startPressX;
		// const dy = press.moveY - press.startPressY;

		// const x = press.startFocusX - dx;
		// const y = press.startFocusY - dy;

		// setFocus(x,y);
	}

	_pressUp() {
	
	}


}