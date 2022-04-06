import './style.scss';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

new ScrollTrigger.create({
    trigger: '.sec1',
    pin: true,
    pinSpacing: false,
    start: '0% 0%',
    end: '100% 0%',
});

new ScrollTrigger.create({
    trigger: '.sec2',
    pin: true,
    pinSpacing: true,
    start: '0% 0%',
    end: '100% 0%',
});

new ScrollTrigger.create({
    trigger: '.sec3',
    pin: true,
    pinSpacing: true,
    start: '0% 0%',
    end: '100% 0%',
});