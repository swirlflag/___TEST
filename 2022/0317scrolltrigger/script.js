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
const elPage = document.querySelector(".page--product-cex");
const elSections = elPage.querySelectorAll("section");

iterElement(elSections, (section) => {
	const span = document.createElement("span");
	span.classList.add("section-name");
	span.innerText = section.classList.value;
	section.prepend(span);
});

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

const sceneHero = () => {
	const elSection = elPage.querySelector("section.hero");
	const elVisual = elSection.querySelector(".hero__visual");
	const tl = new gsap.timeline({ paused: true });

	tl.from(elVisual, { duration: 0.6, ease: "power1.out", y: -200 }, 0);
	tl.from(elVisual, { duration: 1, ease: "power2.out", scale: 0.7 }, "<");
	tl.from(elVisual, { duration: 0.4, ease: "power1.out", opacity: 0 }, "<");

	tl.play();
	tl.delay(0.5);
};

const sceneIntro = () => {

    const useSpacing = false;
	const elSection = elPage.querySelector("section.intro");
	const elVisual = elSection.querySelector(".intro__visual");
	const elH2 = elSection.querySelector("h2");
	const elText = elSection.querySelector("p");
	const elPointWords = elText.querySelectorAll("span");

	// gsap.set(elSection, { css: { height: "200vh" } });

	const tl1 = new gsap.timeline({ paused: true });

	tl1.addLabel("init", 0);
	tl1.addLabel("h2", "init");
	tl1.from(elH2, { duration: 1, opacity: 0 }, "h2");
	tl1.from(elH2, { duration: 5, y: 30 }, "<");
	tl1.to(elH2, { duration: 2, opacity: 0 }, "-=3");

	tl1.addLabel("visual", ">-=3");
	tl1.from(elVisual, { duration: 1, opacity: 0 }, "visual");

	tl1.addLabel("p", "h2>");
	tl1.from(elText, { duration: 1, opacity: 0 }, "p");
	tl1.from(elText, { duration: 5, y: 30 }, "<");

	tl1.addLabel("pointword", "p+=0.5");
	iterElement(elPointWords, (el, i) => {
		tl1.add(() => {
			const labelTime = tl1.labels.pointword + i;
			const time = tl1.time();
			el.classList[labelTime > time ? "remove" : "add"]("st-point");
		}, `pointword+=${i}`);
	});

	tl1.to(elText, { duration: 1.5, opacity: 0 }, "-=1");

	new ScrollTrigger.create({
		animation: tl1,
		// scroller: elScroller,
		trigger: elSection,
		start: "0% 0%",
		end: '100% 0%',
		pin: true,
		scrub: 0,
		pinSpacing: useSpacing,
		// markers: true,
	});
};

const sceneConfig = () => {
    const heightRatio = 3;
    const useSpacing = false;
	const elSection = elPage.querySelector("section.config");
	const elVisual = elSection.querySelector(".config__visual");
	const elText = elSection.querySelectorAll(".config__content li");

	const tl1 = new gsap.timeline({ paused: true });

	tl1.addLabel("init", 0);
	tl1.addLabel("visual", "init");
	tl1.addLabel("text", "init");

    iterElement(elText , (el,i) => {
        i = i * 1;
        tl1.from(el, { duration: 1, opacity: 0 }, `text+=${i + 0.5}`);
        tl1.from(el, { duration: 2, y: 200 }, `text+=${i}`);
    });

    tl1.fromTo(
		elVisual,
		{ yPercent: 30 },
		{ duration: tl1._dur/heightRatio, yPercent: 0 },
		"visual"
	);

    tl1.to( elSection, { duration: 1,opacity: 0, }, "text>");

	new ScrollTrigger.create({
		animation: tl1,
		trigger: elSection,
		start: "0% 0%",
		end: () => `${(heightRatio - (useSpacing ? 0 : 1))*100}% 0%`,

		pin: true,
		scrub: 0,
		// markers: true,
		pinSpacing: useSpacing,
	});
};

const sceneDetail = () => {
    const heightRatio = 2;
    const useSpacing = true;
    const elSection = elPage.querySelector('section.detail');

    const tl1 = new gsap.timeline({paused: true});
    // tl1.fromTo(elSection , {
    //     opacity: 0,
    // }, {
    //     duration: 1,
    //     opacity: 1,
    // });

    new ScrollTrigger.create({
		animation: tl1,
		trigger: elSection,
		start: "0% 0%",
		end: () => `${(heightRatio + (useSpacing ? 1 : 0))*100}% 0%`,
		pin: true,
		scrub: 0,
		markers: true,
		pinSpacing: useSpacing,
	});
};

const initDOMLoaded = () => {
	setLocoScroll();

	sceneHero();
	sceneIntro();
	sceneConfig();
    sceneDetail();
};

window.addEventListener("DOMContentLoaded", initDOMLoaded);
