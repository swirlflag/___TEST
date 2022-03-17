import "./style.scss";
import gsap from "gsap";
import { iterElement } from "./utils.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const elPage = document.querySelector(".page--product-cex");

const sceneHero = () => {
	const elSection = elPage.querySelector("section.hero");
	const elVisual = elSection.querySelector(".hero__visual");
	const tl = new gsap.timeline({paused: true,});

	tl.from(elVisual, { duration: 0.6, ease: "power1.out", y: -200 }, 0);
	tl.from(elVisual, { duration: 1, ease: "power2.out", scale: 0.7 }, '<');
	tl.from(elVisual, { duration: 0.4, ease: "power1.out", opacity: 0 }, '<');

	tl.play();
	tl.delay(0.5);
};

const sceneIntro = () => {
	const elSection = elPage.querySelector("section.intro");
	const elVisual = elSection.querySelector(".intro__visual");
	const elH2 = elSection.querySelector("h2");
	const elText = elSection.querySelector("p");
	const elPointWords = elText.querySelectorAll("span");

	gsap.set(elSection, { css: { height: "200vh" } });

	const tl = new gsap.timeline({ paused: true });

	tl.addLabel("h2", "+=0");
	tl.from(elH2, { duration: 1, opacity: 0 }, "h2");
	tl.from(elH2, { duration: 5, y: 30 }, "<");
	tl.to(elH2, { duration: 2, opacity: 0 }, "-=3");

	tl.addLabel("visual", ">-=3");
	tl.from(elVisual, { duration: 1, opacity: 0 }, "visual");

	tl.addLabel("p", "h2>");
	tl.from(elText, { duration: 1, opacity: 0 }, "p");
	tl.from(elText, { duration: 5, y: 30 }, "<");

	tl.addLabel("pointword", "p+=0.5");
	iterElement(elPointWords, (el, i) => {
		tl.add(() => {
			const labelTime = tl.labels.pointword + i;
			const time = tl.time();
			el.classList[labelTime > time ? "remove" : "add"]("st-point");
		}, `pointword+=${i}`);
	});

	tl.to(elText, { duration: 1.5, opacity: 0 }, "-=1");

	new ScrollTrigger.create({
		animation: tl,
		trigger: elSection,
		start: "0% 0%",
		end: "100% 100%",
		pin: true,
		scrub: 2,
		// pinSpacing: true,
		// markers: true,
	});
};

const sceneConfig = () => {
    const elSection = elPage.querySelector('section.config');
    const elVisual = elSection.querySelector('.config__visual');

    const tl = new gsap.timeline();

    gsap.set(elSection, { css: { height: "200vh" } });

    tl.addLabel('visual' , '+=0');
    tl.from(elVisual , {
        duration: 1,
    })
    // tl.from('visual' , '+=0');

    new ScrollTrigger.create({
        animation: tl,
        trigger: elSection,
        start: "0% 50%",
		end: "100% 100%",
		// pin: true,
        pin: elVisual,
		scrub: 2,
        markers: true,
    });

};

const initDOMLoaded = () => {
	sceneHero();
	sceneIntro();
    sceneConfig();
};

window.addEventListener("DOMContentLoaded", initDOMLoaded);

