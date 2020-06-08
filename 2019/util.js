

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// Common
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function winSize(){
	    var size = {
    		width : window.innerWidth || document.body.clientWidth,
    		height : window.innerHeight || document.body.clientHeight
		}
		return size;		
	}


	////////////////////////////////////////////////////////////////////////////////////////////////////
	// Easing
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// t: current time
	// b: start position
	// c: amount of change (end - start)
	// d: total animation time
	
	function easeLinear(t, b, c, d) {
		return c*t/d + b;
	}
	function easeInQuad(t, b, c, d) {
		t /= d;
		return c*t*t + b;
	}
	function easeOutQuad(t, b, c, d) {
		t /= d;
		return -c * t*(t-2) + b;
	}
	function easeInOutQuad(t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2*t*t + b;
		t--;
		return -c/2 * (t*(t-2) - 1) + b;
	}
	function easeInCubic(t, b, c, d) {
		return c*(t/=d)*t*t + b;
	}
	function easeOutCubic(t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	}
	function easeInOutCubic(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}
	function easeInExpo(t, b, c, d) {
		return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
	}
	function easeOutExpo(t, b, c, d) {
		return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
	}
	function easeInOutExpo(t, b, c, d) {
		t /= d/2;
		if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
		t--;
		return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
	}
	
	// obj : object
	// pp : property
	// cv : current value
	// ev : end value
	// at : animation time
	// dl : delay(Max at)
	// func : end function
	
	function stEaseLinear(obj, pp, cv, ev, at, sp, dl, ef){
		stEasing(easeLinear, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function stEaseInQuad(obj, pp, cv, ev, at, sp, dl, ef){
		stEasing(easeInQuad, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function stEaseOutQuad(obj, pp, cv, ev, at, sp, dl, ef){
		stEasing(easeOutQuad, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function stEaseInOutQuad(obj, pp, cv, ev, at, sp, dl, ef){
		stEasing(easeInOutQuad, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function stEaseInCubic(obj, pp, cv, ev, at, sp, dl, ef){
		stEasing(easeInCubic, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function stEaseOutCubic(obj, pp, cv, ev, at, sp, dl, ef){
		stEasing(easeOutCubic, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function stEaseInOutCubic(obj, pp, cv, ev, at, sp, dl, ef){
		stEasing(easeInOutCubic, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function stEaseInExpo(obj, pp, cv, ev, at, sp, dl, ef){
		stEasing(easeInExpo, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function stEaseOutExpo(obj, pp, cv, ev, at, sp, dl, ef){
		stEasing(easeOutExpo, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function stEaseInOutExpo(obj, pp, cv, ev, at, sp, dl, ef){
		stEasing(easeInOutExpo, obj, pp, cv, ev, at, sp, dl, ef);
	}

	function stEasing(easing, obj, pp, cv, ev, at, sp, dl, ef){
		var st = 0;
		var unit = cutValue(cv).unit;
		var cv = cutValue(cv).value;
		var ev = cutValue(ev).value;
		var ch = ev - cv;
		var at = at;
		var dl = dl;
		var ef = ef;
		
		// color base
		if(pp == "background" || pp == "color"){
			stEasingBackground(obj, pp, cv, ev, at, sp, dl, ef);
			return;
		}
		
		// check overlap timeout 
		if(obj.getAttribute(pp + "_timeout_name")){
			clearTimeout(obj.getAttribute(pp + "_timeout_seq"));
			obj.setAttribute(pp + "_timeout_name", null);
		}
		// check overlap easing
		if(obj.getAttribute(pp + "_easing_name")){
			clearInterval(obj.getAttribute(pp + "_easing_seq"));
			obj.setAttribute(pp + "_easing_name", null);
		}
		
		if(dl){
			var timeout = setTimeout(function(){
				easingStart();
			}, dl);
			obj.setAttribute(pp + "_timeout_seq", timeout);
			obj.setAttribute(pp + "_timeout_name", pp);
		}else{
			easingStart();
		}
		
		function easingStart(){
			obj.setAttribute(pp + "_easing_seq", setInterval(easingProc, sp));
			obj.setAttribute(pp + "_easing_name", pp);
		}
		
		function easingProc(){
			cv = easing(st, cv, ch, at);
			ch = ev - cv;
			obj.style[pp] = cv + unit;
			if(cv == ev){
				clearInterval(obj.getAttribute(pp + "_easing_seq"));
				obj.setAttribute(pp + "_easing_name", null);
				if(ef){
					ef();
				}
			}
			st++;
		}
	}

	function stEasingBackground(obj, pp, cv, ev, at, sp, dl, ef){
		var st = 0;
		var cv = hexToRgb(cv);
		var ev = hexToRgb(ev);
		var ch = [];
		var at = at;
		var dl = dl;
		var ef = ef;
		
		for(var i = 0; i < cv.length; i++){
			ch.push(ev[i] - cv[i]);
		}

		// check overlap timeout 
		if(obj.getAttribute(pp + "_timeout_name")){
			clearTimeout(obj.getAttribute(pp + "_timeout_seq"));
			obj.setAttribute(pp + "_timeout_name", null);
		}
		// check overlap easing
		if(obj.getAttribute(pp + "_easing_name")){
			clearInterval(obj.getAttribute(pp + "_easing_seq"));
			obj.setAttribute(pp + "_easing_name", null);
		}

		if(dl){
			var timeout = setTimeout(function(){
				easingStart();
			}, dl);
			obj.setAttribute(pp + "_timeout_seq", timeout);
			obj.setAttribute(pp + "_timeout_name", pp);
		}else{
			easingStart();
		}
		
		function easingStart(){
			obj.setAttribute(pp + "_easing_seq", setInterval(easingProc, sp));
			obj.setAttribute(pp + "_easing_name", pp);
		}
		
		function easingProc(){
			var cnt = 0;
			for(var i = 0; i < cv.length; i++){
				cv[i] = easeInOutCubic(st, cv[i], ch[i], at);
				ch[i] = ev[i] - cv[i];
				if(cv[i] == ev[i]){
					cnt++;
				}
				if(cnt >= cv.length){
					clearInterval(obj.getAttribute(pp + "_easing_seq"));
					obj.setAttribute(pp + "_easing_name", null);
					if(ef){
						ef();
					}
				}
			}
			obj.style[pp] = "rgb("+ cv[0] +","+ cv[1] +","+ cv[2] +")";
			st++;
		}
	}
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// JQ Easing
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function jqEaseLinear(obj, pp, cv, ev, at, sp, dl, ef){
		jqEasing(easeLinear, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function jqEaseInQuad(obj, pp, cv, ev, at, sp, dl, ef){
		jqEasing(easeInQuad, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function jqEaseOutQuad(obj, pp, cv, ev, at, sp, dl, ef){
		jqEasing(easeOutQuad, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function jqEaseInOutQuad(obj, pp, cv, ev, at, sp, dl, ef){
		jqEasing(easeInOutQuad, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function jqEaseInCubic(obj, pp, cv, ev, at, sp, dl, ef){
		jqEasing(easeInCubic, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function jqEaseOutCubic(obj, pp, cv, ev, at, sp, dl, ef){
		jqEasing(easeOutCubic, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function jqEaseInOutCubic(obj, pp, cv, ev, at, sp, dl, ef){
		jqEasing(easeInOutCubic, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function jqEaseInExpo(obj, pp, cv, ev, at, sp, dl, ef){
		jqEasing(easeInExpo, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function jqEaseOutExpo(obj, pp, cv, ev, at, sp, dl, ef){
		jqEasing(easeOutExpo, obj, pp, cv, ev, at, sp, dl, ef);
	}
	function jqEaseInOutExpo(obj, pp, cv, ev, at, sp, dl, ef){
		jqEasing(easeInOutExpo, obj, pp, cv, ev, at, sp, dl, ef);
	}
	
	function jqEasing(easing, obj, pp, cv, ev, at, sp, dl, ef){
		var st = 0;
		var unit = cutValue(cv).unit;
		var cv = cutValue(cv).value;
		var ev = cutValue(ev).value;
		var ch = ev - cv;
		var at = at;
		var dl = dl;
		var ef = ef;

		// color base
		if(pp == "background" || pp == "color"){
			stEasingBackground(obj, pp, cv, ev, at, sp, dl, ef);
			return;
		}
		
		// check overlap timeout 
		if(obj.attr(pp + "_timeout_name")){
			clearTimeout(obj.attr(pp + "_timeout_seq"));
			obj.attr(pp + "_timeout_name", null);
		}
		// check overlap easing
		if(obj.attr(pp + "_easing_name")){
			clearInterval(obj.attr(pp + "_easing_seq"));
			obj.attr(pp + "_easing_name", null);
		}
		
		if(dl){
			var timeout = setTimeout(function(){
				easingStart();
			}, dl);
			obj.attr(pp + "_timeout_seq", timeout);
			obj.attr(pp + "_timeout_name", pp);
		}else{
			easingStart();
		}
		
		function easingStart(){
			obj.attr(pp + "_easing_seq", setInterval(easingProc, sp));
			obj.attr(pp + "_easing_name", pp);
		}
		
		function easingProc(){
			cv = easing(st, cv, ch, at);
			ch = ev - cv;
			obj.css(pp, cv + unit);
			if(cv == ev){
				clearInterval(obj.attr(pp + "_easing_seq"));
				obj.attr(pp + "_easing_name", null);
				if(ef){
					ef();
				}
			}
			st++;
		}
	}
	
		
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// Util
	////////////////////////////////////////////////////////////////////////////////////////////////////

	function intRandom(val){
		return Math.floor(Math.random() * val);
	}
	
	function cutValue(v) {
		var res = {
			value : parseInt(v),
			unit  : (''+v).replace(/[0-9\-]/gi,'') || 0,
		};
		return res;
	}
	// const cutValue = (v) => ({
	// 	value : parseInt(v),
	// 	unit  : (''+v).replace(/[0-9\-]/gi,'') || 0,
	// })
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// Math
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	Math.radians = function(degrees) {
    	return degrees * Math.PI / 180;
	};
	
	
	//
	class Point3D {
		constructor(x, y, z) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.cx = 0;
			this.cy = 0;
			this.cz = 0;
			this.ox = 0;
			this.oy = 0;
			this.oz = 0;
		}

		rotationY(val){
			var tempZ = this.cz + (this.z - this.cz) * Math.cos(Math.radians(val)) - (this.x - this.cx) * Math.sin(Math.radians(val));
			this.x = this.cx + (this.z - this.cz) * Math.sin(Math.radians(val)) + (this.x - this.cx) * Math.cos(Math.radians(val));
			this.z = tempZ;
		}
		rotationX(val){
			var tempY = this.cy + (this.y - this.cy) * Math.cos(Math.radians(val)) - (this.z - this.cz) * Math.sin(Math.radians(val));
			this.z = this.cz + (this.y - this.cy) * Math.sin(Math.radians(val)) + (this.z - this.cz) * Math.cos(Math.radians(val));
			this.y = tempY;
		}
		rotationZ(val){
			var tempX = this.cx + (this.x - this.cx) * Math.cos(Math.radians(val)) - (this.y - this.cy) * Math.sin(Math.radians(val));
			this.y = this.cy + (this.x - this.cx) * Math.sin(Math.radians(val)) + (this.y - this.cy) * Math.cos(Math.radians(val));
			this.x = tempX;
		}
	}
	

	////////////////////////////////////////////////////////////////////////////////////////////////////
	// Color
	////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function hexToNumber(v){
		var rgb = hexToRgb(v);
		return rgbToNumber(rgb[0], rgb[1], rgb[2]);
	}
	
	function rgbToNumber(r, g, b) {
	  return (r << 16) + (g << 8) + (b);
	}
	
	function numberToRgb(number) {
		const r = (number & 0xff0000) >> 16;
		const g = (number & 0x00ff00) >> 8;
		const b = (number & 0x0000ff);
  
		return [r, g, b];
	}
	
	const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
		const hex = x.toString(16)
		return hex.length === 1 ? '0' + hex : hex
	}).join('')

	const hexToRgb = hex =>
		hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
		,(m, r, g, b) => '#' + r + r + g + g + b + b)
		.substring(1).match(/.{2}/g)
		.map(x => parseInt(x, 16))

		
	////////////////////////////////////////////////////////////////////////////////////////////////////		
	
	
	
	
	
		