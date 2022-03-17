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
	const tlInit = new gsap.timeline({paused: true,});

	tlInit.from(elVisual, { duration: 0.6, ease: "power1.out", y: -200 }, 0);
	tlInit.from(elVisual, { duration: 1, ease: "power2.out", scale: 0.7 }, '<');
	tlInit.from(elVisual, { duration: 0.4, ease: "power1.out", opacity: 0 }, '<');

	tlInit.play();
	tlInit.delay(0.5);
};

const sceneIntro = () => {
	const elSection = elPage.querySelector("section.intro");
	const elVisual = elSection.querySelector(".intro__visual");
	const elH2 = elSection.querySelector("h2");
	const elText = elSection.querySelector("p");
	const elPointWords = elText.querySelectorAll("span");

	gsap.set(elSection, { css: { height: "200vh" } });

	const tlIntro = new gsap.timeline({ paused: true });

	tlIntro.addLabel("h2", "+=0");
	tlIntro.from(elH2, { duration: 1, opacity: 0 }, "h2");
	tlIntro.from(elH2, { duration: 5, y: 30 }, "<");
	tlIntro.to(elH2, { duration: 2, opacity: 0 }, "-=3");

	tlIntro.addLabel("visual", ">-=3");
	tlIntro.from(elVisual, { duration: 1, opacity: 0 }, "visual");

	tlIntro.addLabel("p", "h2>");
	tlIntro.from(elText, { duration: 1, opacity: 0 }, "p");
	tlIntro.from(elText, { duration: 5, y: 30 }, "<");

	tlIntro.addLabel("pointword", "p+=0.5");
	iterElement(elPointWords, (el, i) => {
		tlIntro.add(() => {
			const labelTime = tlIntro.labels.pointword + i;
			const time = tlIntro.time();
			el.classList[labelTime > time ? "remove" : "add"]("st-point");
		}, `pointword+=${i}`);
	});

	tlIntro.to(elText, { duration: 1.5, opacity: 0 }, "-=1");

	new ScrollTrigger.create({
		animation: tlIntro,
		trigger: elSection,
		start: "0% 0%",
		end: "100% 50%",
		pin: true,
		// pinSpacing: false,
		markers: true,
		scrub: 1,
		// onUpdate: {
		//     console.log(1);
		// }
	});

	// tlIntro.from(elText, {
	//     opacity : 0,
	//     y: 30,
	//     duration: 0.1,
	// });

	// tlIntro.to(elText, {
	//     opacity : 0,
	//     duration: 0.1,
	//     delay: 1,
	// });

	// // h2
	// gsap.fromTo(elH2, {
	//     y: 200,
	// } , {
	//     scrollTrigger: {
	//         trigger: elSection,
	//         // markers: true,
	//         start: "0% 0%",
	//         end: "100% 100%",
	//         // end: "100% 50%",
	//         scrub: 1,
	//     },
	//     y: 0,
	// });

	// gsap.fromTo(elH2, {
	//     y: 200,
	// } , {
	//     scrollTrigger: {
	//         trigger: '.intro__trigger',
	//         endTrigger: elVisual,
	//         markers: true,
	//         start: "0% 0%",
	//         end: "100% 50%",
	//         // end: "100% 50%",
	//         scrub: 1,
	//     },
	//     y: 0,
	//     delay : 1,
	// });

	// const tl = new gsap.timeline({
	//     scrollTrigger: {
	//         trigger: elSection,
	//         // endTrigger: "#page--product-cex .hero",
	//         start: "0% 0%",
	//         // end: "bottom 50%+=100px",
	//         end: "100% 0%",
	//         pin: elSection,
	//         // pinSpacing: false,
	//         markers: true,
	//         scrub: 0.1,
	//     }
	// });

	// tl.from(elH2 , {
	//     opacity: 0,
	//     duration: 0.1,
	// });

	// tl.from(elH2 , {
	//     opacity: 0,
	//     duration: 0.1,
	// });

	// tl.fromTo( elVisual, {
	//     opacity: 0,
	// },{
	//    opacity: 1,
	// },0);

	// new ScrollTrigger.create({
	// 	trigger: elSection,
	// 	start: "0% 0%",
	// 	end: "100% 0%",
	// 	markers: true,
	//     scrub: 0.4,
	// 	animation: gsap.fromTo(elH2, {
	// 		opacity: 0,
	// 	}, {
	// 	    opacity: 1,
	// 	    ease: 'none',
	// 	}),
	//     onUpdate: () => {
	//         console.log(1);
	//     }
	// });
};

const initDOMLoaded = () => {
	sceneHero();
	sceneIntro();
};

window.addEventListener("DOMContentLoaded", initDOMLoaded);

//  gsap.timeline().to("#test", {
// 	scrollTrigger: {
// 		trigger: "#test", // start the animation when ".box" enters the viewport (once)
// 		x: 500,
// 		markers: true,
// 		scrub: true,
// 	},
// });

// const scene = ScrollTrigger.create({
// 	trigger: "#test",
// 	start: "top top",
// 	// endTrigger: "#otherID",
// 	end: "bottom 50%+=100px",
//     markers: true,
// 	onToggle: (self) => console.log("toggled, isActive:", self.isActive),
// 	onUpdate: (self) => {
//         // console.log(scene);
// 		console.log(
// 			"progress:",
// 			self.progress.toFixed(3),
// 			"direction:",
// 			self.direction,
// 			"velocity",
// 			self.getVelocity()
// 		);
// 	},

// });

// window.scene = scene;
