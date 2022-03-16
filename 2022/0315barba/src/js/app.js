import barba from '@barba/core';
import Home from './pages/home';
import About from './pages/detail-page';
import gsap from 'gsap';
import { revealProject, leaveToProject, leaveFromProject, animationEnterMask, animationLeaveMask } from './animations';

history.scrollRestoration = 'manual';

class IO {
    constructor() {
        if(!window.IntersectionObserver) {
            throw 'IntersectionObserver를 실행할수 없는 환경입니다'
        }

        this.isObserve = false;

        this._setupObject();
    }

    _setupObject() {
        const io = new IntersectionObserver((entries, observer) => {
            if(!this.isObserve) {
                return;
            }
            entries.forEach((entry) => {
                this.intersectAction(entry,entries,observer);
            });
        });

        this.io = io;
    }

    intersectAction() {};

    observeOn() {
        this.isObserve = true;
    }
    observeOff() {
        this.isObserve = false;
    }

    add(elements) {
        if(!elements) {
            return;
        }

        if(typeof elements === 'string') {
            elements = document.querySelectorAll(elements);
        }

        if(elements && elements.nodeName) {
            elements = [elements];
        }

        [...elements].map((el) => {
            this.io.observe(el);
        })
    }
}

class IOautoPlayVideo extends IO {
    constructor(props) {
        super(props);
    }
    intersectAction(entry) {
        const { target } = entry;

        if(entry.isIntersecting) {
            target.play();
        }else {
            target.pause();
        }
    }
    addVideo() {
        const videos = document.querySelectorAll("[data-io]");

        const yetTargets = [...videos].filter((t) => {
            if(t.dataset.io === '') {
                t.dataset.io = 'true';
                return true;
            }
        });

        this.add(yetTargets);
    };
}

const IOvideo = new IOautoPlayVideo();

IOvideo.observeOn();
IOvideo.addVideo();

barba.init({
    // debug: true,
    views: [Home],
    transitions: [
		{
			name: 'general-transition',
			once: ({ next }) => {
                console.log(next);

                const contents = next.container.querySelector('.contents');

                gsap.fromTo(contents, {
                    opacity: 0,
                }, {
                    duration: 1,
                    ease : 'power2.out',
                    opacity: 1,
                });
			},
			leave: (data) => {

                if(data.trigger === 'back') {
                    console.log('is back');
                    const prevContainer = data.current.container;
                    const nextContainer = data.next.container;
                    const prevSource = prevContainer.querySelector('.imagebox-top .imagewrap');
                    const prevContent = prevContainer.querySelector('.contents');

                    // console.log(prevSource);

                    // const wantY = window.innerHeight - 500 + document.scrollingElement.scrollTop;
                    let wantY = window.innerHeight - 500 + document.scrollingElement.scrollTop;

                    console.log(wantY);

                    const tl = new gsap.timeline();

                    prevSource.classList.add('st-fly');

                    tl.to(prevSource, {
                        ease: 'power3.out',
                        duration: 0.9,
                        y: wantY,
                    },0);

                    tl.to(prevSource, {
                        ease: 'power3.out',
                        duration: 1,
                        height: '500px',
                        onComplete() {
                            prevSource.classList.remove('st-fly');
                        }
                    },0);

                    tl.to(prevContent , {
                        ease : 'power2.out',
                        duration: 0.7,
                        opacity:0,
                    },0);

                    return tl;

                }else {

                    const prevContainer = data.current.container;

                    const prevSource = prevContainer.querySelector('.imagebox-bottom .imagewrap');

                    const prevContents = prevContainer.querySelector('.contents');

                    prevContents.classList.add('st-hide');

                    const { height, y } = prevSource.getBoundingClientRect();

                    const scrollGap = window.innerHeight - y - height;

                    const wantY = -1 * (window.innerHeight - height) + scrollGap;

                    const tl = new gsap.timeline();

                    prevSource.classList.add('st-fly');

                    tl.to(prevContainer,{
                        ease: 'power4.out',
                        duration: 0.6,
                        y: wantY,
                        onComplete: () => {
                            prevSource.classList.remove('st-fly');
                        }
                    },0);

                    tl.to(prevSource , {
                        ease : 'power4.out',
                        duration : 0.6,
                        height: window.innerHeight,
                    },0);

                    return tl;
                }
            },
            enter: (data) => {
                const prevContainer = data.current.container;
                const nextContainer = data.next.container;
                // const prevSource = prevContainer.querySelector('.imagebox-bottom');
                // const nextSource =  nextContainer.querySelector('.imagebox-top');

                let prevSource = null;
                let nextSource = null;

                if(data.trigger === 'back') {
                    const contents = nextContainer.querySelector('.contents');
                    window.scrollTo(0,document.scrollingElement.scrollHeight);
                    prevSource = prevContainer.querySelector('.imagebox-top .imagewrap');
                    nextSource = nextContainer.querySelector('.imagebox-bottom .imagewrap');

                    gsap.fromTo(contents , {
                        opacity: 0,
                    }, {
                        opacity: 1,
                        duration: 0.3,
                        ease : 'power2.out',
                    })
                }else {
                    window.scrollTo(0,0);
                    prevSource = prevContainer.querySelector('.imagebox-bottom .imagewrap');
                    nextSource = nextContainer.querySelector('.imagebox-top .imagewrap');
                }
                nextSource.innerHTML = '';

                [...prevSource.children].map((el) => {
                    // console.log(el);
                    nextSource.appendChild(el);
                });
                IOvideo.addVideo();
            }
		},
	]
});


// const resetActiveLink = () => gsap.set('a.is-active span', {
// 	xPercent: -100, 
// 	transformOrigin: 'left'
// });

// barba.hooks.enter(() => {
// 	window.scrollTo(0, 0);
// });

// barba.init({
// 	debug: true,
// 	views: [Home, About],
// 	transitions: [
// 		{
// 			name: 'general-transition',
// 			once: ({ next }) => {
// 				resetActiveLink();
// 				gsap.from('header a', {
// 					duration: 0.6, 
// 					yPercent: 100, 
// 					stagger: 0.2,
// 					ease: 'power1.out',
// 					onComplete: () => animationEnterMask(next.container)
// 				});
// 			},
// 			leave: ({ current }) => animationLeaveMask(current.container),
// 			enter: ({ next }) => {
// 				animationEnterMask(next.container)
// 			}
// 		}, {
// 			name: 'detail',
// 			to: {
// 				namespace: ['detail']
// 			},
// 			once: ({ next }) => {
// 				revealProject(next.container);
// 			},
// 			leave: ({ current }) => leaveToProject(current.container),
// 			enter: ({ next }) => {
// 				revealProject(next.container)
// 			}
// 		}, {
// 			name: 'from-detail',
// 			from: {
// 				namespace: ['detail']
// 			},
// 			to: {
// 				namespace: ['home', 'architecture']
// 			},
// 			leave: ({ current }) => leaveFromProject(current.container),
// 			enter: ({ next }) => {
// 				resetActiveLink();
// 				gsap.from('header a', {
// 					duration: 0.6, 
// 					yPercent: 100, 
// 					stagger: 0.2,
// 					ease: 'power1.out'
// 				});
// 				animationEnterMask(next.container);
// 			}
// 		} 
// 	]
// });