
const FRAMES_PER_SECOND = 60;  // Valid values are 60,30,20,15,10...
// set the mim time to render the next frame
const FRAME_MIN_TIME = ((1000/60) * (60 / FRAMES_PER_SECOND)) - ((1000/60) * 0.5);
var lastFrameTime = 0;  // the last frame time
function update(time){
    if(time-lastFrameTime < FRAME_MIN_TIME){ //skip the frame if the call is too early
        requestAnimationFrame(update);
        return; // return as there is nothing to do
    }
    lastFrameTime = time;
    // render the frame
    requestAnimationFrame(update); // get next farme

}
requestAnimationFrame(update); // start animation







const MakeWord = class {
    constructor(word){
        this.checkword();
    }

    checkword(word) {

    }


}

const MakeLine = class {
    constructor(word,stage){
        this.word = word;
        this.el = this.createLine(word,stage);
        this.wordList = [];
    }

    createLine(word,stage) {
        const el_line = document.createElement('div');
        el_line.classList.add('line');
        el_line.style.display = 'flex';
        // el_line.textContent = word;

        const checkword = document.createElement('span');
        checkword.style.display = 'inline-block';
        checkword.style.fontSize = 
        checkword.innerText = word;
        stage.appendChild(checkword);

        for(let i = 0; i < 2; ++i){
            const el_marquee = document.createElement('div');
            el_marquee.classList.add('marquee');
            el_marquee.style.display = 'inline-block';
            el_line.appendChild(el_marquee);
        }
        return el_line;
    }

}

const MakeStage = class {
    constructor(element){

        this.stage  = element;
        this.lineList  = [];

        window.addEventListener('resize' , MakeStage.resize);
    }

    addLine(word) {
        const el_line = new MakeLine(word,this.stage);
        this.lineList.push(el_line);
    }

    renderLine() {
        this.stage.innerHTML = null;
        this.stage.style.fontSize = window.innerHeight / (this.lineList.length) + 'px';
        this.lineList.forEach((line) => {

            this.stage.appendChild(line.el);

        })
    }

    static resize(e){

    }
}

