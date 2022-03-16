import barba from "@barba/core";
import barbaCss from "@barba/css";
import gsap from "gsap";

// tell Barba to use the css plugin
barba.use(barbaCss);

// const body = document.querySelector("body");

// barba.hooks.before((data) => {
//   const background = data.current.container.dataset.background;
//   body.style.setProperty("--page-background", background);
// });

barba.init({
  transitions: [
    {
      name: "opacity-transition",
      sync: true,
      leave() {
        console.log(1);
      }
      //   leave(data) {
      //     console.log(data);
      //     // return gsap.to(data.current.container, {
      //     //   opacity: 0,
      //     // });
      //   },
      //   enter(data) {
      //     console.log(data);
      //     // return gsap.from(data.next.container, {
      //     //   opacity: 0,
      //     // });
      //   },
    },
  ],
});

// barba.init({
//   transitions: [
//     {
//       name: 'home',
//       sync: true,
//       to: { namespace: ['home'] },
//       once() {},
//       leave() {},
//       enter() {},
//     }, {
//       name: 'fade',
//       to: { namespace: ['fade'] },
//       leave() {},
//       enter() {},
//     }, {
//       name: 'clip',
//       sync: true,
//       to: { namespace: ['clip'] },
//       leave() {},
//       enter() {},
//     }, {
//       name: 'with-cover',
//       to: { namespace: ['with-cover'] },
//       leave() {},
//       enter() {},
//     },
//   ],
// });
