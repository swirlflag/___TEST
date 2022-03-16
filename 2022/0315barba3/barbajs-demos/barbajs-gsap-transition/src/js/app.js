import barba from '@barba/core';
import Home from './pages/home';
import About from './pages/detail-page';
import gsap from 'gsap';
import { revealProject, leaveToProject, leaveFromProject, animationEnterMask, animationLeaveMask } from './animations';

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
    debug: true,
    views: [Home],
    transitions: [
		{
			name: 'general-transition',
			once: ({ next }) => {
                console.log('once!');
			},
			leave: (data) => {
                const beforeContainer = data.current.container;

                const beforeSource = beforeContainer.querySelector('.imagebox-next');

                const { height, y } = beforeSource.getBoundingClientRect();

                const scrollGap = window.innerHeight - y - height;

                const wantY = -1 * (window.innerHeight - height) + scrollGap;

                const tl = new gsap.timeline();

                tl.to(beforeContainer,{
                    ease: 'power4.out',
                    duration: 0.8,
                    y: wantY,
                    onComplete: () => {

                    }
                },0);
                console.log(beforeSource);

                beforeSource.classList.remove('imagebox-next');
                beforeSource.classList.add('imagebox-fly');

                tl.to(beforeSource , {
                    ease : 'power4.out',
                    duration : 0.7,
                    height: window.innerHeight,
                },0);

                return tl;
            },
            enter: (data) => {
            window.scrollTo(0,0);
                const beforeContainer = data.current.container;
                const afterContainer = data.next.container;
                const beforeSource = beforeContainer.querySelector('.imagebox-next');
                const afterSource =  afterContainer.querySelector('.imagebox-prev');

                afterSource.innerHTML = '';

                [...beforeSource.children].map((el) => {
                    afterSource.appendChild(el);
                    IOvideo.addVideo();
                });

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