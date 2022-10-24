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

class NexonImageDrag2D {
	constructor(payload = {}) {
		const requireChecked = this._checkRequired(payload);
		if(!requireChecked.value) {
			throw requireChecked.message;
		}

		const {
			canvas,
			image,
			area,
			wheelScale = false,
			wheelScaleStep = 0.05,
			initX = 50,
			initY = 50,
			power = 0.25,
			scale = 1,
			limitCloseoutScale = 0.1,
			limitCloseupScale = 3,
		} = payload;

		this.default = {
			limitCloseoutScale,
			limitCloseupScale,
			scale,
			initX,
			initY,
			power,
		};

		this.power = power;
		this.isFreeze = false;
		this.isActive = false;
		this.wheelScale = wheelScale;
		this.wheelScaleStep = wheelScaleStep;

		this.size = {
			ww: window.innerWidth,
			wh: window.innerHeight,
			cx: window.innerWidth/2,
			cy: window.innerHeight/2,
		};

		this.focus = {
			x: 0,
			y: 0,
			scale,
			width: 0,
			height: 0,
			xPercent: 50,
			yPercent: 50,
			xPercentMap :50,
			yPercentMap :50,
		};

		this.map = {
			x: 0,
			y: 0,
			scale,
			width: 0,
			height: 0,
		};

		this.mouse = {
			x: 0,
			y: 0,
		};

		this.press = {
			isPress: false,
			startFocusX : 0,
			startFocusY : 0,
			startPressX: 0,
			startPressY: 0,
			moveX: 0,
			moveY: 0,
		};

		this.el = {
			canvas: canvas,
			area: area,
			image: image,
		};

		this.events = {};

		this.ctx = canvas.getContext("2d");

		this._init(payload);
	}

	_checkRequired(payload) {
		const { canvas, image } = payload;

		const checked = {
			value: false,
			message: "",
		};

		if(!(canvas instanceof HTMLCanvasElement)) {
			checked.message = "필수: 실행 옵션 객체 내 canvas에 canvas DOM을 전달해주세요. new NexonImageDrag2D({canvas: HTMLCanvasElement})"
			return checked;
		}

		if(!(image instanceof HTMLImageElement)) {
			checked.message = "필수: 실행 옵션 객체 내 image에 이미지 객체를 전달해주세요. new NexonImageDrag2D({canvas: HTMLImageElement})"
			return checked;
		}

		checked.value = true;
		return checked;
	}

	_init() {
		this._setupImage();
		this._setupElement();
		this._setupEvent();
	}

	_setupinitSize() {
		this.focus.width = this.el.image.width * this.focus.scale;
		this.focus.height = this.el.image.height * this.focus.scale;
		this.map.width = this.focus.width;
		this.map.height = this.focus.height;

		this.el.canvas.width = window.innerWidth;
		this.el.canvas.height = window.innerHeight;

		this.setScale(this.focus.scale, true);

		this.setFocusPercent(this.default.initX, this.default.initY, true);
	}

	_setupImage() {
		this.el.image.onload = () => {
			if(this.isActive) {
				this._setupinitSize();
			}
		};
	}

	_setupElement() {
		if(this.el.area) {
			this.el.area.style.willChange = "width, height, transform";
			this.el.area.style.boxSizing = "border-box";
		}
	}

	_setupEvent() {

		this.events.resize = () => {
			this.size.ww = window.innerWidth;
			this.size.wh = window.innerHeight;
			this.size.cx = window.innerWidth/2;
			this.size.cy = window.innerHeight/2;

			this.el.canvas.width = this.size.ww;
			this.el.canvas.height = this.size.wh;

			this.setFocusMapPercent(focus.xPercentMap, focus.yPercentMap);
		};

		this.events.mousewheel = (e) => {
			if(this.isFreeze) {
				return;
			}
			if(!this.wheelScale) {
				return;
			}

			const direction = e.deltaY > 0;
			if(direction) {
				if(this.focus.scale > this.default.limitCloseoutScale) {
					this.setScale(this.focus.scale - this.wheelScaleStep);
				}
			}else {
				if(this.focus.scale < this.default.limitCloseupScale) {
					this.setScale(this.focus.scale + this.wheelScaleStep);
				}
			}

			this.setFocus();
		}

		this.events.mousedown = (e) => {
			this._pressDown(e.clientX, e.clientY, e.path);
		};

		this.events.mousemove = (e) => {
			this._pressMove(e.clientX, e.clientY);
		};

		this.events.mouseup = () => {
			this._pressUp();
		};

		this.events.touchstart = (e) => {
			this._pressDown(e.touches[0].clientX, e.touches[0].clientY);
		};

		this.events.touchmove = () => {
			this._pressMove(e.touches[0].clientX, e.touches[0].clientY);
		};

		this.events.touchend = () => {
			this._pressUp();
		};

	}

	_pressDown(x, y, path) {
		if(this.isFreeze) {
			return;
		}

		if(path) {
			for(let i = 0, l = path.length; i < l; ++i) {
				const isDetect = path[i] === this.el.canvas;
				if(isDetect) {
					break;
				}
				if(i === path.length -1) {
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

	_pressMove(willX, willY) {
		if(!this.press.isPress) {
        	return;
		}
		if(this.isFreeze) {
			return;
		}

		this.press.moveX = willX;
		this.press.moveY = willY;

		const dx = this.press.moveX - this.press.startPressX;
		const dy = this.press.moveY - this.press.startPressY;

		const x = this.press.startFocusX - dx;
		const y = this.press.startFocusY - dy;

		this.setFocus(x,y);
	}

	_pressUp() {
		this.press.isPress = false;
		this.press.moveX = 0;
		this.press.moveY = 0;
		this.press.startFocusX = 0;
		this.press.startFocusY = 0;
	}

	_perRound(value) {
    	return (Math.round(value * 1000))/10;
	}

	_drawMap() {
		const d = {
			x: this.focus.x - this.map.x,
			y: this.focus.y - this.map.y,
			scale: this.focus.scale - this.map.scale,
		};

		const x = Math.abs(d.x) < 0.001 ? this.focus.x : this.map.x + (d.x * this.power);
		const y = Math.abs(d.y) < 0.001 ? this.focus.y : this.map.y + (d.y * this.power);
		const scale = Math.abs(d.scale) < 0.000001 ? this.focus.scale : this.map.scale + (d.scale * this.power);

		this.map.x = x;
		this.map.y = y;
		this.map.scale = scale;
		this.map.width = this.el.image.width * this.map.scale;
		this.map.height = this.el.image.height * this.map.scale;

		if(this.el.area) {
			this.el.area.style.transform = `translate3d(${-x}px,${-y}px,0)`;
			this.el.area.style.width = `${this.map.width}px`;
			this.el.area.style.height = `${this.map.height}px`;
		}

		this.ctx.drawImage(this.el.image, -this.map.x, -this.map.y, this.map.width , this.map.height);
	}

	_render() {
		if(!this.isActive) {
			return;
		}
		this._drawMap();
		requestAnimationFrame(this._render.bind(this));
	}

	setFocus(willX = this.focus.x, willY = this.focus.y, force = false) {

		const isOverX = this.focus.width - willX - this.size.ww < 0;
		const isOverY = this.focus.height - willY - this.size.wh < 0;

		const limitX = this.focus.width - this.size.ww - 1;
		const limitY = this.focus.height - this.size.wh - 1;

		const x = willX <= 0 ? 0 : isOverX ? limitX : willX;
		const y = willY <= 0 ? 0 : isOverY ? limitY : willY;

		this.focus.x = Math.round(x);
		this.focus.y = Math.round(y);
		this.focus.xPercent = this._perRound(this.focus.x / (this.focus.width - this.size.ww));
		this.focus.yPercent = this._perRound(this.focus.y / (this.focus.height - this.size.wh));
		this.focus.xPercentMap = this._perRound((this.focus.x + this.size.cx) / (this.focus.width));
		this.focus.yPercentMap = this._perRound((this.focus.y + this.size.cy) / (this.focus.height));

		if(force) {
			this.map.x = this.focus.x;
			this.map.y = this.focus.y;
		}
	}

	setFocusPercent(xPercent = this.focus.xPercent, yPercent = this.focus.yPercent, force = false) {
		const x = (this.focus.width - this.size.ww)/100 * xPercent;
		const y = (this.focus.height - this.size.wh)/100 * yPercent;
		this.setFocus(x,y,force);
	}

	setFocusMapPercent(xPercent = this.focus.xPercentMap, yPercent = this.focus.yPercentMap, force = false) {
		const x = this.focus.width/100 * xPercent - this.size.cx;
    	const y = this.focus.height/100 * yPercent - this.size.cy;
		this.setFocus(x,y);
	}

	setPower(power = this.default.power) {
		this.power = power;
	}

	setScale(scale = 1, force = false) {
		scale = scale <= 0.001 ? 0.001 : scale;

		const origin = {
			x: 1/this.focus.scale * this.focus.x,
			y: 1/this.focus.scale * this.focus.y,
		};

		origin.x = origin.x - (this.size.cx - (1/this.focus.scale * this.size.cx));
		origin.y = origin.y - (this.size.cy - (1/this.focus.scale * this.size.cy));

		if(this.el.image.width * scale < this.size.ww) {
			scale = (this.size.ww+1) / (this.el.image.width);
		}
		if(this.el.image.height * scale < this.size.wh) {
			scale = (this.size.wh+1) / (this.el.image.height);
		}

		this.focus.scale = scale;
		this.focus.width = this.el.image.width * scale;
		this.focus.height = this.el.image.height * scale;

		if(force) {
			this.map.scale = scale;
			this.map.width = this.focus.width;
			this.map.height = this.focus.height;
		}

		const x = ((origin.x - this.size.cx/scale) * scale) + (this.size.cx * scale);
		const y = ((origin.y - this.size.cy/scale) * scale) + (this.size.cy * scale);

		this.setFocus(x,y,force);
	}

	create() {
		this.isActive = true;

		if(this.el.image.complete) {
			this._setupinitSize();
		}

		window.addEventListener("resize", this.events.resize);
		window.addEventListener("mousewheel", this.events.mousewheel);
		window.addEventListener("mousedown", this.events.mousedown);
		window.addEventListener("mousemove", this.events.mousemove);
		window.addEventListener("mouseup", this.events.mouseup);
		// window.addEventListener("mouseout", this.events.mouseup);
		window.addEventListener("touchstart", this.events.touchstart);
		window.addEventListener("touchmove", this.events.touchmove);
		window.addEventListener("touchend", this.events.touchend);

		this._render();

		return this;
	}

	destroy() {
		this.isActive = false;

		window.removeEventListener("resize", this.events.resize);
		window.removeEventListener("mousewheel", this.events.mousewheel);
		window.removeEventListener("mousedown", this.events.mousedown);
		window.removeEventListener("mousemove", this.events.mousemove);
		window.removeEventListener("mouseup", this.events.mouseup);
		// window.removeEventListener("mouseout", this.events.mouseup);
		window.removeEventListener("touchstart", this.events.touchstart);
		window.removeEventListener("touchmove", this.events.touchmove);
		window.removeEventListener("touchend", this.events.touchend);

		return this;
	}

}

class CustomCursor {
	constructor(payload = {}) {
		const {
			power = 0.3,
		} = payload;

		this.isFreeze = false;
		this.isActive = false;
		this.el = {};
		this.events = {};
		this.power = power;
		this.mouse = {
			x: 0,
			y: 0,
		};
		this.cursor = {
			x: 0,
			y: 0,
		};

		this._init();
	}

	_init() {
		this._setupElement();
		this._setupEvent();
	}

	_setupElement() {
		const template = `
			<div class="cursor">
				<span class="cursor__pointer">
					<span class="cursor__visual"></span>
				</span>
			</div>
		`;
		const fragment = document.createElement("div");

		fragment.innerHTML = template;

		this.el.root = fragment.querySelector(".cursor");
		this.el.pointer = fragment.querySelector(".cursor__pointer");
		this.el.visual = fragment.querySelector(".cursor__visual");

		this.el.root.style.cssText = `
			display: inline-flex;
			position: fixed;
			width: 0;
			height: 0;
			z-index: 100;
			pointer-events: none !important;
		`;
		this.el.pointer.style.cssText = `
			display: inline-flex;
			will-change: transform;
			left: 0; top: 0;
			position: absolute;
			z-index: 100;
			pointer-events: none !important;
		`;

		this.el.visual.style.cssText = `
			display: inline-flex;
			will-change: transform;
			overflow: hidden;
			position: relative;
			pointer-events: none !important;
		`;

		document.body.prepend(fragment.children[0]);
	}

	_setupEvent() {

		this.events.mousemove = (e) => {
			if(this.isFreeze) {
				return;
			}
			this.mouse.x = e.clientX;
			this.mouse.y = e.clientY;
			for(let i = 0, l = e.path.length; i < l; ++i) {
				if(e.path[i].tagName === "A" || e.path[i].tagName === "BUTTON") {
					this.el.root.classList.add("-hover");
					break;
				}
				this.el.root.classList.remove("-hover");
			}
		}

		this.events.mousedown = () => {
			this.el.root.classList.add("-press");
		}

		this.events.mouseup = () => {
			this.el.root.classList.remove("-press");
		}

	}

	_render() {
		if(!this.isActive) {
			return;
		}
		this._drawCursor();
		requestAnimationFrame(this._render.bind(this));
	}

	_drawCursor() {
		const dx = this.mouse.x - this.cursor.x;
		const dy = this.mouse.y - this.cursor.y;

		const x = (this.cursor.x + (dx * this.power));
		const y = (this.cursor.y + (dy * this.power));

		this.cursor.x = x;
		this.cursor.y = y;

		this.el.pointer.style.transform = `translate3d(${x}px,${y}px,0)`;
	}

	create() {
		this.isActive = true;
		window.addEventListener("mousedown", this.events.mousedown);
		window.addEventListener("mousemove", this.events.mousemove);
		window.addEventListener("mouseup", this.events.mouseup);
		this._render();
		return this;
	}

	destroy() {
		this.isActive = false;
		window.removeEventListener("mousedown", this.events.mousedown);
		window.removeEventListener("mousemove", this.events.mousemove);
		window.removeEventListener("mouseup", this.events.mouseup);
		return this;
	}
}