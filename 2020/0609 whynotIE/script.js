

const el_intro                  = document.querySelector('.section--intro');
const el_introSpinner           = document.querySelector('.intro__spinner');
const el_bluescreenPercent      = document.querySelector('.bluescreen__percent');
const el_contentCards           = document.querySelectorAll('.contents__card');
const el_sectionContents        = document.querySelector('.section--contents');

let isFinishIntro = false;

const ISTEST = false;

const iterElement = (el,fn) => {
    const l = el.length;
    for(let i = 0; i < l; ++i){
        fn(el[i],i);
    };
};

const initIntro = () => {
    const blinkInterval = ISTEST ? [10,10] : [250,400,300,150,600,400,480,300];

    const blink = (pointer = 0) => {
        el_introSpinner.classList[pointer%2 === 0 ? 'add' : 'remove']('st-pause');

        setTimeout(() => {
            if(pointer < blinkInterval.length){
                blink(++pointer);
            }else {
                setTimeout(() => {
                    el_introSpinner.classList.remove('st-pause');
                    el_intro.classList.add('st-crash');
                },ISTEST ? 100 : 1500);
                setTimeout(() => {
                    el_intro.classList.add('st-hide');
                },ISTEST  ? 100 : 3500);
                setTimeout(bluescreenProcess , ISTEST  ? 100 : 4500)
            }
        } , blinkInterval[pointer]);
    }

    const radian = (d) => d * Math.PI / 180;

    const bluescreenProcess = (pointer = 0) => {
        const value = Math.ceil((100 * Math.sin(radian(pointer))));
        if(value < 100){
            el_bluescreenPercent.innerText = value;
            setTimeout(() => {
                bluescreenProcess(++pointer)
            },10+(pointer/2));
        }else {
            el_bluescreenPercent.innerText = 100;
            el_sectionContents.classList.remove('is-hide');
        }
    };

    // setTimeout(blink,1500);
    setTimeout(blink,ISTEST ? 100 : 1500);

}

const cardActiveBind = () => {
    iterElement(el_contentCards , (card) => {
        const title = card.querySelector('.contents__title');
        title.addEventListener('click' , () => {
            card.classList.toggle('is-open')
        });
    });
}

const initPage = () => {
    initIntro();
    cardActiveBind();
}

window.addEventListener('DOMContentLoaded' , initPage);