import "./style.scss";
import gsap from "gsap";
import LocomotiveScroll from "locomotive-scroll";
import { iterElement } from "./utils.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import * as dat from 'dat.gui';
const gui = new dat.GUI();

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

    // new ScrollTrigger.create({
    //     trigger: sections[0],
    //     start: '50% 50%',
    //     end: '150% 50%',
    //     pin: true,
    //     pinSpacing: true,
    //     markers: true,
    // });

    // const a = new ScrollTrigger.create({
    //     trigger: sections[1],
    //     start: '50% 50%',
    //     end: '150% 50%',
    //     pin: true,
    //     pinSpacing: false,
    //     markers: true,
    // });

    // window.aa = a;

    // const world = {
    //     plane: {
    //         triggerStar: 400,
    //         height: 400,
    //         widthSegments: 50,
    //         heightSegments: 50,
    //     },
    // };

    const world = [...sections].map((el,i) => {
        const data = {
            triggerStart : 50,
            scrollStart : 50,
            triggerEnd : 150,
            scrollEnd : 50,
        }

        // el.style.height = window.innerHeight * 2 +'px';

        const st = new ScrollTrigger.create({
            trigger: el,
            pin: true,
            pinSpacing: false,
            start: `${data.triggerStart}% ${data.scrollStart}%`,
            end: `${data.triggerEnd}% ${data.scrollEnd}%`,
            markers: true,
        });

        return {
            data,st
        }
    });
    window.world = world;

    // const refresh = () => {

    // };

    world.map((item,idx) => {
        gui.addFolder(`section ${idx+1}`);
        Object.entries(item.data).map(([k,v]) => {
            gui.add(item.data, k, 0, 150).onChange(() => {
                const { triggerStart , triggerEnd , scrollStart, scrollEnd } = world[idx].data;
                world[idx].st.vars.start =  `${triggerStart}% ${scrollStart}%`;
                world[idx].st.vars.end =  `${triggerEnd}% ${scrollEnd}%`;
                world[idx].st.update();
                world[idx].st.refresh();
            }).step(10);
        })
    });



    // gui.add(world.plane, "object 1 trigger start", 0, 200).onChange(() => {
    // });
    // gui.add(world.plane, "height", 1, 500).onChange(() => {
    //     generatePlane();
    // });

	// [...sections].forEach((el, i) => {
	// 	const beforeSpacing = i > 0 ? isSpacingMap[i-1] : false;
	// 	const nowSpacing = isSpacingMap[i];

    //     // if(nowSpacing) {
    //     //     el.classList.add('use-spacing');
    //     // }

    //     const start = `${100 * (i+1) }% 50%`;
    //     const end = `${nowSpacing ? '100%': '200%'} 0%`;

	// 	new ScrollTrigger.create({
	// 		trigger: el,
    //         start: '50% 50%',
    //         end: '150% 50%',
	// 		pin: true,
    //         // start: '50% 50%',
    //         // // start,
    //         // end: '250% 50%',
    //         pinSpacing: true,
	// 		// pinSpacing: nowSpacing,
	// 		// markers: !nowSpacing,
	// 		markers: true,
	// 	});
	// });

    // pinSpacing default => true
};

window.addEventListener("DOMContentLoaded", initDOMLoaded);
