const ScrollArea = class {
    constructor(option) {

        this.wrap           = option.target;
        this.sections       = option.sections;

        this.init();
    }

    types = ['circle' , 'rect' , 'triangle' , 'oval'];


    addSection(section) {
        const el_section = document.createElement('div');
        el_section.classList.add('section');
        const htmlString = `
            <div class="section_title">
                <div className="titletext">
                    <strong>${section.strong}</strong>
                    <span>${section.title}</span>
                </div>
            </div>
            <div class="section_particle">
                ${(() => {
                    let result = "";
                    for(let i = 0; i < section.particleFrequency; ++i){

                        const itemClassName     = `particle_item${section.particleType ? ` type-${section.particleType}`: ''}`;

                        const perspectiveLevel  = Math.random();

                        const particleSize = perspectiveLevel * section.particleMaxsize;

                        const itemInlineStyle = `
                            width               : ${particleSize}vw;
                            height               : ${particleSize}vw;
                            top                 : ${Math.random() * 100 }%;
                            left                : ${Math.random() * 100 }%;
                            transform           :
                                translate3d(0,0,0)
                            ;
                            opacity             : ${perspectiveLevel+0.1};
                            z-index             : ${parseInt(perspectiveLevel * 100)};
                        `

                        const shapeInlineStyle = `
                            background-color    : ${section.particleColor};

                        `

                        result += `

                            <div    class="${itemClassName}"
                                    style="${itemInlineStyle}"
                            >
                                <div class="particle_itemshape" style="${shapeInlineStyle}">

                                </div>
                            </div>
                        `
                    }
                    return result;
                }
               )()}
            </div>
        `

        el_section.innerHTML = htmlString;
        this.wrap.appendChild(el_section);

        // const el_particles = el_section.querySelectorAll('.particle_item');

        // for(let i = 0, l = el_particles.length; i < l; ++i){
        //     this.particleObserver.observe(el_particles[i]);
        // };

    }

    particleInterSectionObsever() {

    }


    init() {
        this.particleInterSectionObsever();

        for(let i = 0; i < this.sections.length; ++i){
            this.addSection(this.sections[i]);
        }

    }

}


const el_wrap = document.querySelector('#wrap');

const scrollOptions = {
    target : el_wrap,

    sections : [
        {
            strong              : 'VEL',
            title               : 'VULPUTATE',
            sectionHeight       : 100,
            particleType        : 'circle',
            particleMaxsize     : 35,
            particleFrequency   : 15,
            particleColor       : 'rgb(52, 160, 255)',
        }
        ,
        {
            strong              : 'DONEC',
            title               : 'GRAVIDA',
            sectionHeight       : 100,
            particleType        : 'rect',
            particleMaxsize     : 25,
            particleFrequency   : 12,
            particleColor       : 'rgb(255, 97, 163)',
        }
        ,
        {
            strong              : 'SUSCIPT',
            title               : 'NUNC QUIS',
            sectionHeight       : 100,
            particleType        : 'oval',
            particleMaxsize     : 5,
            particleFrequency   : 65,
            particleColor       : 'rgb(226, 255, 97)',
        }
        ,
        {
            strong              : 'AUGUE',
            title               : 'ULTRICES',
            sectionHeight       : 100,
            particleType        : 'diamond',
            particleMaxsize     : 8,
            particleFrequency   : 42,
            particleColor       : 'rgb(78, 255, 217)'
        }
        ,
        {
            strong              : 'TIRA',
            title               : 'DAPIBUS',
            sectionHeight       : 100,
            particleType        : 'triangle',
            particleMaxsize     : 15,
            particleFrequency   : 25,
            particleColor       : 'rgb(231, 133, 255)',
        }
        ,
    ]
}

const myScrollArea = new ScrollArea(scrollOptions);


let targetSt    = 0;
let currentSt   = 0;
let isWheeling = false;

const scrollElement = document.scrollingElement;


window.addEventListener('wheel' , (e) => {
    if(!isWheeling){
        currentSt = window.scrollY;
        targetSt =  window.scrollY
    }
    isWheeling = true;

    targetSt += e.deltaY;

    if(targetSt > scrollElement.scrollHeight - window.innerHeight){

        targetSt = scrollElement.scrollHeight - window.innerHeight
    }
    if(targetSt <= 0){
        targetSt = 0;
    }

    e.preventDefault();
},{passive: false});

window.addEventListener('mousedown' , (e) => {
    isWheeling = false;
})

const getElementTop = (element) => {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while(current){
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}

const test = () => {
    const items = document.querySelectorAll('.particle_item');
    const winH  = window.innerHeight;
    const nowSt = window.scrollY;

    for(let i = 0; i < items.length; ++i){
        const item = items[i];
        const elementSt = nowSt + winH - getElementTop(item) ;
        const end =  winH + item.offsetHeight;
        if(0 < elementSt && elementSt < end){
            const percent = elementSt/end * 100;


            // item.setAttribute('data-target-y', 'hey');
            const value = ((50-percent)*8) ;

            item.style.transform = `translateY(${value}%)`;
        }
    }
}

const frameSmoothScroll = () => {
    if(!isWheeling){
        return;
    }

    currentSt = currentSt + ((targetSt - currentSt) * 0.05);
    scrollElement.scrollTop = currentSt;
    if(parseInt(targetSt) === parseInt(currentSt)){
        isWheeling = false;
    }
}

const frame = () => {
    test();
    frameSmoothScroll();
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
