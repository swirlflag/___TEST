import "./style.css";
import gsap from "gsap";

window.gsap = gsap;

class TextSplitMotion {

	constructor(options) {
        if(!options.target) {
            return
        }
        this._init(options);
        this._setupTemplate();
    }

    _init(options) {
        const {
            splitType = 'letter', // word, letter
            target = null,
            stagger = 0,
            mask = false,
            to = null,
            from = null,
            fromTo = null,
        } = options;

        this.parent = target;
        this.stagger = stagger;

        this.strings = this.parent.innerText;
        this.mask = mask;

        this.el_fragment = null;
        this.el_splits = null;
        this.el_moves = null;

        this.isPlay = false;
        this.tl = new gsap.timeline();

        this.action = to || from || fromTo;
        this.actionType = from ? 'from'
                        : fromTo ? 'fromTo'
                        : 'to';

        this.splitType = splitType;
    }

    _setupTemplate() {
        this.el_fragment = document.createElement('div');
        this.el_fragment.classList.add('tm-fragment');

        const splitTypeDict = {
            'letter' : '',
            'word' : ' ',
        }

        const splitType = splitTypeDict[this.splitType];

        let splitMap = this.strings.split(splitType);

        if(this.splitType === 'word') {
            const spliter = '|||';
            splitMap = splitMap.join(`${spliter} ${spliter}`).split(spliter);
        }

        let template = splitMap.map((string,idx) => {
            string = string.charCodeAt() === 32 ? '&nbsp;' : string;
            return `
                <span data-tm-split data-tm-index="${idx}" class="tm-split ${this.mask ? 'usemask' : ''}">
                    <span data-tm-frame class="tm-frame">${string}</span>
                    <span data-tm-move class="tm-move">${string}</span>
                </span>
            `;
        })

        template = template.join('');

        this.el_fragment.innerHTML = template;
        this.el_splits = this.el_fragment.querySelectorAll('.tm-split');
        this.el_splits = this.el_fragment.querySelectorAll('.tm-move');
    }

    setTimeline() {
        this.tl.pause().clear();

        this.tl.eventCallback('onComplete' , () => {
            this.isPlay = false;
            this.reset();
        });

        this.parent.innerHTML = '';
        this.parent.appendChild(this.el_fragment);

        [...this.el_splits].map((el, idx) => {
            const option = {
                duration: 0.6,
                ease: 'power2.out',
                ...this.action,
            }
            console.log(this.action);
            this.tl[this.actionType](el, option,this.stagger * idx);
        });
    }

	play() {
        if(this.isPlay) {
            return;
        }

        this.isPlay = true;

        this.setTimeline();

        this.tl.play(0);
    }

    reset() {
        console.log('reset');
        // this.parent.innerHTML = this.strings;
    }

}


// use ?
const span1 = document.querySelector("#span1");
const span2 = document.querySelector("#span2");
const span3 = document.querySelector("#span3");

const maskTextSpan1 = new TextSplitMotion({
	target: span1,
    mask: true,
    stagger : 0.15,
    from : {
        duration: 0.8,
        xPercent : 101,
    }
});

const maskTextSpan2 = new TextSplitMotion({
	target: span2,
    stagger : 0.05,
    from : {
        yPercent : 30,
        duration: 0.7,
        opacity : 0,
    }
});

const maskTextSpan3 = new TextSplitMotion({
	target: span3,
    // stagger : 0.018,
    stagger : 0.1,
    splitType: 'word',
    mask: true,
    from : {
        yPercent : 101,
        duration: 0.6,
    }
});

const p1 = document.querySelector('#p1');

const maskTextP1 = new TextSplitMotion({
	target: p1,
    splitType: 'word',
    stagger : 0.01,
    mask:true,
    from : {
        dynamic() {
            return {
                y : 10,
            }
        },
        xPercent (a,b,c) {
            // console.log(a.parentElement);
            // console.log(c);
            return Math.random() > 0.5 ? 101 : -101;
        },
        duration: 1,
    }
});

const textScene01 = () => {
    // maskTextSpan1.play();
    // maskTextSpan2.play();
    // maskTextSpan3.play();
    maskTextP1.play();
}

window.textScene01 = textScene01;

// TODO
// dynamic value
// from, to, fromto
// maskorigin

