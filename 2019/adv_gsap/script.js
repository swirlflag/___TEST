const controller = new ScrollMagic.Controller({
    refreshInterval: 0
})

const redCube = document.querySelector('.section-red .cube');

const scene01 = new ScrollMagic.Scene({
    triggerElement: ".section-red",
    offset : 0,
    duration: document.querySelector('.section-red').offsetHeight,
    triggerHook : 0,
    // tweenChanges : true,
})
    .setTween(".section-red .cube", 1, {
        backgroundColor: "green",
        width: "300px" ,
        y : "500",
        ease : 'power2.inout'
    })
    .addIndicators()
    .addTo(controller)
    // .on("progress" , (e) => {
    //     console.log(e);
    //     gsap.to(redCube, 0.5, {
    //         'y' : e.progress * 500 , 'ease' : 'power2.out'
    //     });
    // });















// (() => {

//   let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

//   console.log("is Chrome ? ", isChrome);

//   let scenes = [];
//   let y = 0;

//   // initial smooth-scrollbar
//   let scroll = Scrollbar.init(
//     document.querySelector(".scroll-section")
//   );

//   // initiate ScrollMagic Controller
//   let controller = new ScrollMagic.Controller(
//             {
//                 refreshInterval: 0,
//             }
//       );

//   // update scrollY controller
//   if(isChrome){
//     controller.scrollPos(function () {
//       return y;
//     });
//   }

//   // initiate ScrollMagic Scene each section
//   [...document.querySelectorAll('.scroll-section__inner')].forEach(function(){

//     let tl = new TimelineMax();
//         // tl.to(text, 1, { yPercent: -80, rotation: 0.01 }, "start")
//         // tl.to(chiffre, 1, { yPercent: 60, rotation: 0.01 }, "start")
//         // tl.to(image, 1, { autoAlpha: 1, yPercent: 20, rotation: 0.01 }, "start")

//     scenes.push(
//       new ScrollMagic.Scene({
//           offset: 200 ,
//           triggerHook: "onEnter",
//           triggerElement: document.querySelector('.scroll-section'),
//           duration: window.innerHeight,
//           reverse : true
//         })
//         .setTween(tl)
//         .on("leave", function(){
//             console.log('leave scene');
//         })
//         .on("enter", function(){
//             console.log('enter scene');
//         })
//         .on("progress", function(e){
//             console.log("progress => ", e.progress);
//         })
//         .addTo(controller)
//       );
//     });

//   // listener smooth-scrollbar, update controller
//   scroll.addListener(function(status) {
//     y = status.offset.y;
//     if(isChrome){
//       controller.update();
//     } else {
//       scenes.forEach(function(scene){
//             scene.refresh();
//       });
//     }
//   });



// })()

