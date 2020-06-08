const dxe = new DX_easeBase();

// let stringList = [];
// let widthList = [];
// let lineList = [];

// let fontSize = 0;

// const screenWidth = window.screen.width;
// const screenHeight = window.screen.height;


// const addWord = (word) => {

// }

// const addLine = (stage,word) => {


//     const el_line = document.createElement('div');
//     el_line.classList.add('line');
//     el_line.style.display = 'block';
//     lineList.push(el_line);

//     setFontSize();
//     stage.style.fontSize = fontSize + 'px';

//     // stage.appendChild(el_line);

//     const checkSpan = document.createElement('span');
//     checkSpan.innerText = word;
//     checkSpan.style.display = 'inline-block';


// }


// const addStringLine = (string) => {
//     stringList.push(string);
// }

// const setFontSize = () => {
//     fontSize = window.innerHeight / stringList.length ;
// }

// const render = (stage) => {
//     setFontSize();
//     stage.style.fontSize = fontSize + 'px';
//     stage.style.lineHeight = '1em';

//     stringList.forEach((string) => {
//         const el_line = document.createElement('div');
//         el_line.style.display = 'flex';
//         el_line.classList.add('line');
//         stage.appendChild(el_line);
//         const checkSpan = document.createElement('span');
//         checkSpan.style.display = 'inline-block';
//         checkSpan.innerText = string;
//         el_line.appendChild(checkSpan);
//         widthList.push(parseInt(getComputedStyle(checkSpan).width));
//         checkSpan.remove();
//     });

//     const lines = stage.querySelectorAll('.line');

//     stringList.forEach((string,idx) => {

//         const width = widthList[idx];
//         const line = lines.item(idx);

//         const count = Math.ceil(screenWidth / width);

//         for(let i = 0; i < 2; ++i){
//             const marquee = document.createElement('span');
//             marquee.classList.add('marquee');
//             marquee.style.display = 'inline-flex';
//             for(let j = 0; j < count; ++j){
//                 const word = document.createElement('span');
//                 word.style.display = 'inline-block';
//                 word.classList.add('word');
//                 word.innerText = string;
//                 marquee.appendChild(word);
//             };
//             line.appendChild(marquee);
//         }

//     });

// }













const CreateStage = class {
    constructor (option){
        this.lines = [];
        this.minFontSize = 80;

        for(let i = 0; i  < option.lines.length; ++i){

            const targetLine = option.lines[i];

            this.lines.push(new CreateLine({
                word : targetLine.word,
                speed : targetLine.speed,
                direction : targetLine.direction,
                stage : option.stage,
            }));
        }

        this.lineHeightPercent = 100/this.lines.length;

    }

    setFontSize(i, size, duration) {


        size = size * this.lineHeightPercent;


        if(100/window.innerHeight * this.minFontSize > size){
            size = 100/window.innerHeight * this.minFontSize;
        }

        const anotherSize = (100-size)/5;

        this.lines.forEach((line , idx) => {

            const thisLineSize = idx === i ? size : anotherSize;

            const thisLineStart = parseFloat(line.element.style.fontSize);

            dxe.addEase({
                duration    : duration || 1000,
                start       : thisLineStart,
                end         : thisLineSize,
                ease        : 'inOutCubic',
                frameFunction : ({progressValue}) => {
                    console.log(1);
                    line.element.style.fontSize = progressValue + 'vh';
                    line.elementWidth = line.element.querySelector('.marquee').offsetWidth;
                },
            });

        });


    }

}


const CreateLine = class {
    constructor(option){
        this.word           = option.word;
        this.element        = null;
        this.elementWidth   = 0;
        this.wordWidth      = 0;
        this.wordCount      = 0;
        this.move           = 0;
        this.direction      = !!option.direction;
        this.speed          = option.speed || 0;
        this.minFontSize    = 100;

        console.log(this.word);
        this.render(option.stage);
        this.play();
    }

    calcWord() {
        const checkSpan = this.element.querySelector('.marquee > .word');
        const checkWidth = checkSpan.offsetWidth;
        this.wordWidth = checkSpan.offsetWidth;
        this.wordCount = Math.ceil(window.innerWidth/this.wordWidth);
    }

    render(stage) {

        const el_line = document.createElement('div');
        el_line.style.display = 'flex';
        el_line.classList.add('line');
        this.fontSize = 100/6;
        el_line.style.fontSize = 100/6 + 'vh';
        el_line.style.direction = this.direction ? 'rtl' : 'ltr'
        this.element = el_line;
        stage.appendChild(el_line);

        const checkSpan = document.createElement('span');
        checkSpan.style.display = 'inline-block';
        checkSpan.style.fontSize = this.minFontSize + 'px';
        checkSpan.innerText = this.word;
        el_line.appendChild(checkSpan);

        this.wordWidth = parseInt(getComputedStyle(checkSpan).width);
        this.wordCount = Math.ceil(window.screen.availWidth/this.wordWidth);
        checkSpan.remove();

        for(let i = 0; i < 2; ++i){
            const marquee = document.createElement('div');
            marquee.classList.add('marquee');
            marquee.style.display = 'flex';
            for(let j = 0 ; j < this.wordCount; ++j){
                const word = document.createElement('span');
                word.classList.add('word');
                word.style.display = 'inline-block';
                word.textContent = this.word;
                word.style.padding = '0 0.2em';
                marquee.appendChild(word);
            }
            el_line.appendChild(marquee);
        }

        this.elementWidth = parseInt(getComputedStyle(this.element.children[0]).width);

    }

    setSpeed (speed, duration) {
        const before = this.speed;
        dxe.addEase({
            duration : duration || 3000,
            start : before,
            end : speed,
            ease : 'outCubic',
            frameFunction : ({progressValue}) => {
                this.speed = Math.round(progressValue);
            }
        })

    }

    setDirection (direction) {
        this.direction = direction;
        this.element && (this.element.style.direction = direction ? 'rtl' : 'ltr');
    }

    play(){
        frameFunctions.push(() => {

            if(Math.abs(this.move) > this.elementWidth){
                this.move = 0;
            }else {
                this.move = this.move - this.speed;
            }

            const value = this.direction ? Math.abs(this.move) : this.move;
            this.element.style.transform = `translateX(${value}px)`;

        })
    }

}

let frameFunctions = [];

const frameRender = () => {
    for(let i = 0; i < frameFunctions.length; ++i){
        frameFunctions[i]();
    }
    requestAnimationFrame(frameRender);
}

requestAnimationFrame(frameRender)