import "./style.scss";
import gsap from "gsap";
import LocomotiveScroll from "locomotive-scroll";
import { iterElement } from "./utils.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
/* set var(--app-height) */
var windowHeight = window.innerHeight;
window.addEventListener(
	"resize",
	function () {
		requestAnimationFrame(resizeHandler);
	},
	false
);
resizeHandler();
function resizeHandler() {
	document.documentElement.style.setProperty(
		"--app-height",
		window.innerHeight + "px"
	);
}

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const elApp = document.querySelector("#app");

const setLocoScroll = () => {
	document.querySelector("html").style.overflow = "hidden";
	const elScroller = document.querySelector("[data-scroll-container]");
	const locoScroll = new LocomotiveScroll({
		el: elScroller,
		smooth: true,
		smartphone: {
			smooth: true,
			// lerp : 10,
		},
	});

	locoScroll.on("scroll", ScrollTrigger.update);
	ScrollTrigger.scrollerProxy(elScroller, {
		scrollTop(value) {
			return arguments.length
				? locoScroll.scrollTo(value, 0, 0)
				: locoScroll.scroll.instance.scroll.y;
		},
		getBoundingClientRect() {
			return {
				top: 0,
				left: 0,
				width: window.innerWidth,
				height: window.innerHeight,
			};
		},
		pinType: elScroller.style.transform ? "transform" : "fixed",
	});
	ScrollTrigger.defaults({
		scroller: elScroller,
	});
	ScrollTrigger.addEventListener("refresh", () => {
		locoScroll.update();
	});
	ScrollTrigger.refresh();
};

const initDOMLoaded = () => {
	// setLocoScroll();
	const sections = document.querySelectorAll("section");

	let isSpacingMap = [...sections].map(() => Math.random() > 0.5);
	// isSpacingMap = [
    //     true,
    //     true,
    //     true,
    //     false,
    // ];
	console.log(isSpacingMap);

	[...sections].forEach((el, i) => {
		const beforeSpacing = i > 0 ? isSpacingMap[i-1] : false;
		const nowSpacing = isSpacingMap[i];
		new ScrollTrigger.create({
			trigger: el,
			// start: `${beforeSpacing ? 0 : 0}% 0%`,
            start: `50% 50%`,
			// end: `${beforeSpacing ? 2200 : 1200}% 0%`,
            end: '+=100%',
			pin: true,
			// markers: !nowSpacing,
			markers: true,
			// pinSpacing: nowSpacing,
		});
	});
};

window.addEventListener("DOMContentLoaded", initDOMLoaded);
