
// 이것만 따로 쓰는일은 일반적으로 없게하는것이 기본 목표
// action동작을 frame별로 실행해주는것 + 하나의 메인 루프를 가지게 하는것이 DX_ease의 목표 기능
// 들어온 duration을 가지고 progress를 0~1로 나누어 action함수에 기본 제공한다

const DX_easeBase = class {

	constructor() {

	}

	static easeStacks = [];

	static isRendering = false;

	static fpsInterval = 1000/60;

	static easeTypes = {
		linear : (t,b,c,d,) => c*t/d + b,
		inQuad : (t,b,c,d,) => {t /= d;return c*t*t + b;},
		outQuad : (t,b,c,d) => {t /= d;return -c * t*(t-2) + b;},
		inOutQuad : (t,b,c,d) => {t /= d/2;if (t < 1) return c/2*t*t + b;t--;return -c/2 * (t*(t-2) - 1) + b;},
		inCubic : (t,b,c,d) => c*(t/=d)*t*t + b,
		outCubic : (t,b,c,d) => c*((t=t/d-1)*t*t + 1) + b,
		inOutCubic : (t,b,c,d) => (t/=d/2) < 1 ? c/2*t*t*t + b : c/2*((t-=2)*t*t + 2) + b,
		inExpo : (t,b,c,d) => c * Math.pow( 2, 10 * (t/d - 1) ) + b,
		outExpo : (t,b,c,d) => c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b,
		inOutExpo : (t,b,c,d) => {t /= d/2;if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;t--;return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;}
	}

// 일단 fps 는 보류.. 60fps를 기준으로 작업
	setFps() {
		this.fps = Math.ceil( 1000 / (performance.now() - this.lastTime));
	}

	static start(o) {
		o.startFunction && o.startFunction(o);
		DX_easeBase.easeStacks.push(o);
	}

// 이징 오브젝트를 받아서 stack에 추가해주고,
	addEase(options){
	// 오브젝트 설정들..
		const o = {
			progress 			: 0,
			currentTime 		: 0,
			pointer 			: 0,
			start 				: 0,
			end 				: 0,
			progressValue 		: options.start || 0,
			progressDistance 	: typeof options.end === 'number' ? options.start - options.end : 0,
			frameLength 		: Math.ceil(options.duration/DX_easeBase.fpsInterval),
			...options,
		}

	// ease옵션이 문자열이면 내장된 클래스에 있는 옵션매치
	// ease가 없다면 linear로 설정
		typeof o.ease === 'string' && (o.ease = DX_easeBase.easeTypes[o.ease]);
		!o.ease && (o.ease = DX_easeBase.easeTypes.linear);

	// stack에 오브젝트를 넣어줌

	// 반복해줄 렌더 함수
		const render = (timestamp) => {
		//  현재 stack이 루프 가능한지 체크
			if(DX_easeBase.isRendering){
				requestAnimationFrame(render);
				this.loopStack();
		// stack이 비어있으면 루프 정지
			}else {
				cancelAnimationFrame(render);
			}
		}

		DX_easeBase.start(o);

	// 플레이중인 상태가 아니라면 최초 점화
		if(!DX_easeBase.isRendering){
			DX_easeBase.isRendering = true;
			requestAnimationFrame(render);
		}
	}

	loopStack() {
		for(let i = 0; i < DX_easeBase.easeStacks.length; ++i){
			const o = DX_easeBase.easeStacks[i];
			o.currentTime = o.ease(o.pointer , 0 , o.duration , o.frameLength);
			o.progress = o.currentTime / o.duration;
			o.pointer++;

			o.progressValue = o.start - ((o.progressDistance)*o.progress);

		// 하위 클래스에서 확장한 프레임별 액션
			if(o.extendOption){
				o.extendOption(o);
			}
		// 프레임마다 설정해줄 액션
			if(o.frameFunction){
				o.frameFunction(o);
			}
		// 해당 오브젝트의 움직임 종료
			if(o.pointer > o.frameLength){
				this.finish(o,i);
			}
		}
	}

	finish(o,i) {
		o.finishFunction && o.finishFunction(o);
		DX_easeBase.easeStacks.splice(i, 1);
		if(!DX_easeBase.easeStacks.length){
			DX_easeBase.isRendering = false;
		}
	}
}


// 셀렉트하는애는 따로 만들자
const DX_elementSelect = class {

}


// DOM + css style 에 특화된 ease
// memo : 성능상 transform, opacity의 변환이 성능상 가장좋기떄문에 left , width와같은 속성보다 transform 사용을 우선시한다.

const DX_easeDOM = class extends DX_easeBase {

	constructor(){
		super();
	}

	static cutValue = (v) => ({
		value : parseInt(v),
		unit  : (''+v).replace(/[0-9\-]/gi,'') || 0,
	});

	static unitSheet = {
		'left' 		: 'px' ,
		'top' 		: 'px' ,
		'right' 	: 'px' ,
		'bottom' 	: 'px' ,
		'font-size' : 'px' ,
		'width' 	: 'px' ,
		'height' 	: 'px' ,
		// 'margin'	: 'px' ,
		// 'margin-top': 'px' ,
		// 'margin'	: 'px' ,
		// 'margin'	: 'px' ,
		// 'margin'	: 'px' ,
	}

	static setModify(o) {

		const targetStyles = getComputedStyle(o.target);

		for(const [k,v] of Object.entries(o.modify)){
			const isUseUnit = DX_easeDOM.unitSheet[k] || false;
			const origins = DX_easeDOM.cutValue(targetStyles[k]);
			const modifys = isUseUnit ? DX_easeDOM.cutValue(v) : { value : o.modify[k] , unit : 0};

			o.modify[k] = {
				start	 : origins.value ,
				end  	 : modifys.value ,
				distance : modifys.value - origins.value,
				unit 	 : modifys.unit,
			}
		};

	}

// 현재 상태 에서 to상태로 ease되는 기능
	to(options) {
		const o = {...options,}
		DX_easeDOM.setModify(o);

		o.frameFunction = (o) => {
			for(const [k,v] of Object.entries(o.modify)){
				o.target.style[k] = v.start + (v.distance*o.progress) + v.unit;
			}
		}

		this.addEase(o);
	}

// from 상태 에서 현재 상태로 ease되는 기능
	from(options) {
		const o = {...options,}
		DX_easeDOM.setModify(o);

		o.frameFunction = (o) => {
			for(const [k,v] of Object.entries(o.modify)){
				o.target.style[k] = v.end - (v.distance*o.progress) + v.unit;
			}
		}

		this.addEase(o);
	}

// fromTo start상태에서 end상태로 ease되는 기능
	formTo(options) {

	}

}



//todo : 움직임과 opacity처럼 여러가지 속성을 다른 duration으로 처리할수있게 하자 !






// const DX_easePack = (() => {

// 	const easeFunctions = {
// 		linear : (t,b,c,d,) => c*t/d + b,
// 		inQuad : (t,b,c,d,) => {
// 			t /= d;
// 			return c*t*t + b;
// 		},
// 		outQuad : (t,b,c,d) => {
// 			t /= d;
// 			return -c * t*(t-2) + b;
// 		},
// 		inOutQuad : (t,b,c,d) => {
// 			t /= d/2;
// 			if (t < 1) return c/2*t*t + b;
// 			t--;
// 			return -c/2 * (t*(t-2) - 1) + b;
// 		},
// 		inCubic : (t,b,c,d) => c*(t/=d)*t*t + b,
// 		outCubic : (t,b,c,d) => c*((t=t/d-1)*t*t + 1) + b,
// 		inOutCubic : (t,b,c,d) => (t/=d/2) < 1 ? c/2*t*t*t + b : c/2*((t-=2)*t*t + 2) + b,
// 		inExpo : (t,b,c,d) => c * Math.pow( 2, 10 * (t/d - 1) ) + b,
// 		outExpo : (t,b,c,d) => c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b,
// 		inOutExpo : (t,b,c,d) => {
// 			t /= d/2;
// 			if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
// 			t--;
// 			return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
// 		}
// 	}

// 	const 	easeStacks = [];
// 	const 	fpsInterval = 1000/60;
// 	let 	isLoop = false;

// // 프레임이 종료되고 메인루프에서 해당 객체 삭제
// 	const removeEaseStack = (index) => {
// 		easeStacks.splice(index, 1);
// 	}

// // 처음 루프를 시작 할때...
// 	const startLoop = (obj) => {
// 		obj.frameLength = Math.ceil(obj.duration/fpsInterval);
// 		obj.frameArray  = [];
// 		obj.frameIndex  = 0;

// 		if(typeof obj.easing === 'string'){
// 			obj.easing = easeFunctions[obj.easing];
// 		}

// 		let currentValue 	= 0;
// 		for(let i = 1; i <= obj.frameLength; ++i){
// 			currentValue 	= obj.easing(i ,obj.start, obj.end-obj.start, obj.frameLength);
// 			obj.frameArray.push(currentValue);
// 		}

// 		obj.startFunction && obj.startFunction();
// 		isLoop || mainFrame();
// 		isLoop = true;
// 	};

// // 실제 돌아가는 메인 루프 함수 (1프레임)
// 	const mainFrame = (timestamp) => {
// 		// console.log('main')
// 		if(easeStacks.length){
// 			for(let i = 0; i < easeStacks.length; ++i){
// 				var obj = easeStacks[i];
// 				obj.index = i;
// 				loopStack(obj);
// 				if(obj.frameIndex >= obj.frameLength){
// 					obj.endFunction && obj.endFunction(obj);
// 					removeEaseStack(obj.index);
// 				}
// 			}
// 			requestAnimationFrame(mainFrame);
// 		}else {
// 			isLoop = false;
// 		};
// 	};

// // 1 프레임당의 액션 (커스텀 가능하게 준비?)
// 	const loopStack = (obj) => {
// 		[...obj.target].map((target) => {
// 			target.style['left'] = obj.frameArray[obj.frameIndex] + 'px';
// 		});
// 		++obj.frameIndex;
// 	}

// 	const DX_easePack = function(){
// 		// console.log('start?');
// 		requestAnimationFrame(mainFrame);
// 	};

// 	DX_easePack.prototype.to = function(obj = {
// 		// 들어올 옵션은 여기서 일단 리스트업 및 정리
// 		target,
// 		duration,
// 		prop,
// 		start,
// 		end,
// 		delay,
// 		stagger,
// 		term,
// 		startFunction,
// 		frameFunction,
// 		endFunction,
// 	}){
// 		typeof obj.target === 'string' && (obj.target = document.querySelectorAll(obj.target))
// 		startLoop(obj);
// 		easeStacks.push(obj);
// 	};

// 	DX_easePack.prototype.from = function(){

// 	}

// 	DX_easePack.prototype.progress = function(){

// 	}

// 	return DX_easePack;

// })();
