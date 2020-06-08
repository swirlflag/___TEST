const rafList = [];

const rafAdd = (fn) => {
    rafList.push(fn);
}

const raf = () => {
    for(let i = 0, leng = rafList.length; i < leng; ++i){
        rafList[i]();
    }
    requestAnimationFrame(raf);
};

requestAnimationFrame(raf);


const gradientTargets = document.querySelectorAll('#type-3 .backgro')

const liveGradient = class{
    constructor (startColor){
        this.gradientList = [];
        this.startDegree = 0;
        this.init();
    }

    randomRGB() {
        return [
            Math.round(Math.random()*255),
            Math.round(Math.random()*255),
            Math.round(Math.random()*255),
        ];
    }

    add (elements, isText) {
        const leng = elements.length || 1;
        for(let i = 0; i < leng; ++i){
            this.startDegree += 10;
            const obj = {
                target : elements[i] || elements,
                currentColor : [this.randomRGB(), this.randomRGB()],
                targetColor : [this.randomRGB(), this.randomRGB()],
                degree  : this.startDegree,
                SPEED_degree : Math.random() * 0.2,
                // SPEED_color :  1,
                SPEED_color :  0.5 + (Math.random() * 0.5),
            }

            isText && obj.target.classList.add('is-textbackground');

            this.gradientList.push(obj)   ;
        };

    };

    init() {
        const FRAME = () => {
            for(let i = 0; i < this.gradientList.length; ++i){
                const o = this.gradientList[i];
                for(let j = 0; j < o.currentColor.length; ++j){
                    for(let k = 0; k < o.currentColor[j].length; ++k){
                        const current = o.currentColor[j][k];
                        const target  = o.targetColor[j][k];

                        if(current > target){
                            o.currentColor[j][k] -= o.SPEED_color
                        }else if(current < target){
                            o.currentColor[j][k] += o.SPEED_color
                        }

                        if(Math.ceil(current) === target || Math.floor(current) === target){
                            o.currentColor[j][k] = target
                        }

                    }

                    if(o.currentColor[j].join() === o.targetColor[j].join()){
                        o.targetColor = [this.randomRGB(), this.randomRGB()]
                    };

                }

                o.degree += o.SPEED_degree;
                o.target.style.background = `
                -webkit-linear-gradient(
                    ${Math.floor(o.degree)}deg,
                    rgb(${o.currentColor[0].join()}),
                    rgb(${o.currentColor[1].join()})
                `;

            }
        };

        rafAdd(FRAME);
    };

};





