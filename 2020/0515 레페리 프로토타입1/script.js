


// type1


var type1 = document.querySelector('#type-1 .text');



// console.log(getComputedStyle(type1).backgroundImage)

// type1.style.background = `-webkit-linear-gradient(#d3d, #ff0)`;

const makeRandomColor = () => {
    return [
        Math.round(Math.random()*255),
        Math.round(Math.random()*255),
        Math.round(Math.random()*255),
    ];
};

const initType3 = () => {

    const area = document.querySelector('#type-3');
    const text = area.querySelector('.text');
    const backgrounds = area.querySelectorAll('.background span');

    let currentColor    = [0,0,0];
    let targetColor     = makeRandomColor();

    let currentColor2    = [0,0,0];
    let targetColor2     = makeRandomColor();

    let currentColor3    = [0,0,0];
    let targetColor3     = makeRandomColor();

    let currentColor4    = [0,0,0];
    let targetColor4     = makeRandomColor();


    setInterval(() => {

        currentColor.forEach((c,i) => {
            if(targetColor[i] === currentColor[i]){
                return
            }else{
                if(targetColor[i] > currentColor[i]){
                    currentColor[i]++;
                }else {
                    currentColor[i]--;
                }
            }
        })

        currentColor2.forEach((c,i) => {
            if(targetColor2[i] === currentColor2[i]){
                return
            }else{
                if(targetColor2[i] > currentColor2[i]){
                    currentColor2[i]++;
                }else {
                    currentColor2[i]--;
                }
            }
        })

        currentColor3.forEach((c,i) => {
            if(targetColor3[i] === currentColor3[i]){
                return
            }else{
                if(targetColor3[i] > currentColor3[i]){
                    currentColor3[i]++;
                }else {
                    currentColor3[i]--;
                }
            }
        })

        currentColor4.forEach((c,i) => {
            if(targetColor4[i] === currentColor4[i]){
                return
            }else{
                if(targetColor4[i] > currentColor4[i]){
                    currentColor4[i]++;
                }else {
                    currentColor4[i]--;
                }
            }
        })

        if(currentColor.join() === targetColor.join()){
            targetColor = makeRandomColor();
        }
        if(currentColor2.join() === targetColor2.join()){
            targetColor2 = makeRandomColor();
        }
        if(currentColor3.join() === targetColor3.join()){
            targetColor3 = makeRandomColor();
        }
        if(currentColor4.join() === targetColor4.join()){
            targetColor4 = makeRandomColor();
        }

        backgrounds[0].style.background = `
        -webkit-linear-gradient(
            90deg,
            rgb(${currentColor.join(',')}),
            rgb(${currentColor2.join(',')})
        `;
        backgrounds[1].style.background = `
        -webkit-linear-gradient(
            180deg,
            rgb(${currentColor3.join(',')}),
            rgb(${currentColor4.join(',')})
        `;

    },16);

};

initType3();
