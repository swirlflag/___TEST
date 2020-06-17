const iterElement = (el, fn) => {
    const l = el.length;
    for(let i = 0; i < l; ++i){
        fn(el[i],i);
    }
}

const onceEvent = (target , action ,event) => {
    const fn = () => {
        event();
        target.addEventListener(target , action, fn);
    };

    target.addEventListener(target , action, fn);
}

const outCubic      = `cubic-bezier(0.33, 1, 0.68, 1)`;
const inCubic       = `cubic-bezier(0.32, 0, 0.67, 0)`;
const inOutcubic    = `cubic-bezier(0.65, 0, 0.35, 1)`;

const Wonjinbot = class {

    el_wonjinbot        = document.querySelector('#wonjinbot');
    el_background       = null;
    el_items            = null;
    el_focusItem        = null;
    el_beforeItem       = null;
    el_bubbles          = null;

    isOpenBot           = false;

    focusBubbleSize     = [];
    focusItemSize       = [];

    botSize             = 34;
    loadingSize         = 60;

    fakePadding         = 20;

    maxLength           = 0;
    curerntNumber       = 0;

    distance            = 10;

    originSize          = []

    openBubbleFunctionList  = [];

    constructor (data) {
        if(!this.el_wonjinbot){
            return
        }
        this.init(data);
    }

    init(data) {
        this.render(data);
        this.maxLength          = data.length;
        this.el_background      = this.el_wonjinbot.querySelector('#wonjinbot__background');
        this.el_items           = this.el_wonjinbot.querySelectorAll('.wonjinbot__item');
        this.el_focusItem       = this.el_items[this.curerntNumber];
        this.el_beforeItem      = this.el_focusItem;
        this.el_bubbles         = this.el_wonjinbot.querySelectorAll('.wonjinbot__bubble');

        this.setOriginSize();
        this.eventBind();
    };

    render(data) {
        const maxBubbleLength = Math.max(...data.map(t => t.length));

        this.el_wonjinbot.innerHTML = `
            <div id="wonjinbot__background"></div>
            <div id="wonjinbot__contents">

            ${(() => {
                let resultItem = "";
                for(let i = 0; i < data.length; ++i){
                    const targetItem = data[i];
                    resultItem += `
                        <div class="wonjinbot__item">
                            ${(() => {
                                let resultBubble = "";
                                for(let j = 0; j < targetItem.length; ++j) {
                                    const targetBubble = targetItem[j];
                                    resultBubble += `
                                        <div class="wonjinbot__bubble ${targetBubble.className || '' }">
                                            <div class="wonjinbot__bubblecircle"></div>
                                            <div class="wonjinbot__bubblecontent">
                                                <div class="wonjinbot__title">
                                                    <p>${targetBubble.title}</p>
                                                </div>
                                                <div class="wonjinbot__innercontents">
                                                    ${(() => {
                                                        let resultLinks = "";
                                                        if(!targetBubble.contents){
                                                            return resultLinks
                                                        }
                                                        for(let k = 0; k < targetBubble.contents.length; ++k){
                                                            const targetLink = targetBubble.contents[k];
                                                            resultLinks += targetLink;
                                                        }
                                                        return resultLinks;
                                                    })()}
                                                </div>
                                            </div>
                                            ${(() => {
                                                if(targetBubble.className === 'loading'){
                                                    return (`
                                                        <div class="wonjinbot__bubbleloading">
                                                            <span></span>
                                                            <span></span>
                                                            <span></span>
                                                        </div>
                                                    `)
                                                }
                                            })()}
                                        </div>
                                    `
                                }
                                return resultBubble;
                            })()}
                        </div>
                    `
                };
                return resultItem;
            })()}
            </div>
            <div id="wonjinbot__emoji"></div>

        `;
    }

    eventBind() {

        const checkBot = (el,path) => {
            const parent = el.parentElement;
            if(el.nodeName === "HTML" || parent.nodeName === "HTML"){
                this.closeAll();
            }
            else if(parent.id === 'wonjinbot'){
                for(let i = 0, l = path.length; i < l;++i){
                    const target = path[i] || {};
                    if(target.classList && target.classList.contains('wonjinbot__bubble')){
                        this.toggleBubble(target);
                        return null;
                    }
                }
                return null;
            }
            else {
                checkBot(parent,path);
            }
        }

        window.addEventListener('click', (e) => {
            checkBot(e.target ,e.path);
        })
    }

    setOriginSize() {
        for(let i = 0, l = this.el_bubbles.length; i < l; ++i ){
            const bubble        = this.el_bubbles[i];
            const title         = bubble.querySelector('.wonjinbot__title');
            const innerContents = bubble.querySelector('.wonjinbot__innercontents');

            const size = [title.offsetWidth , Math.max(title.offsetWidth, innerContents.offsetWidth)];
            this.originSize.push(size);

        };

        console.log(this.originSize)
    }

    focusing(number) {
        this.curerntNumber  = number;
        this.el_beforeItem  = this.el_focusItem;
        this.el_focusItem   = this.el_items[this.curerntNumber];
        this.el_beforeItem.classList.remove('is-focus');
        this.el_focusItem.classList.add('is-focus');
    }

    sizingBackground (finishAction) {
        const currentWidth = this.el_background.offsetWidth;
        const targetWidth = this.el_focusItem.offsetWidth;

        const easeBackFixPixel = 25;
        // const easeBackRatio = targetWidth >= currentWidth ? 1.2 : 0.8;
        const easeBackWidth = targetWidth + (easeBackFixPixel * (targetWidth >= currentWidth ?1:-0.3));

        const inEase = outCubic;
        const outEase = inOutcubic;

        const delay = 0;
        const inDuration = 170;
        const outDuration = 300;
        const earlyDuration = 0;

        // setTimeout(() => {
        //     this.el_background.style.transition =  `
        //         width ${inDuration}ms ${inEase}
        //     `;
        //     this.el_background.style.width = easeBackWidth + 'px';
        //     setTimeout(() => {
        //         this.el_background.style.transition =  `
        //             width ${outDuration}ms ${outEase}
        //             ,background-color 0ms ease ${500}ms
        //         `;
        //         this.el_background.style.width  = targetWidth + 'px';
        //     },inDuration - earlyDuration);
        // },delay);

        const tl = new gsap.timeline();


        tl.to(this.el_background , 1, {width :100});
        tl.to(this.el_background , 1, {width :200});
        tl.eventCallback('onComplete' , () => {
            finishAction();
        })

    }

    change(number) {
        this.focusing(number);

        setTimeout(() => {
            this.sizingBackground();
        }, this.isOpenBot ? 500 : 0);

        this.closeAll();
    }


    openBubble (target) {
        if(target.classList.contains('no-open') || target.classList.contains('is-open')){
            return
        }
        target.classList.add('is-open');
        target.classList.remove('is-mini');

        const content = target.querySelector('.wonjinbot__bubblecontent');
        target.style.height = content.offsetHeight + 'px';
        // target.style.width = 'auto';

        this.resizeItem();

        for(let i = 0, l = this.openBubbleFunctionList.length; i < l; ++i){
            this.openBubbleFunctionList[i]();
        };

    }

    miniBubble(target) {
        if(target.classList.contains('is-mini')){
            console.log('hasmini')
            return
        }
        target.classList.add('is-mini');
        target.classList.remove('is-open');

        target.style.height = this.botSize + 'px';

        if(target.classList.contains('loading')){
            const content = target.querySelector('.wonjinbot__bubblecontent');
            this.saveOriginWidth = target.offsetWidth;
        }

        this.resizeItem();

    }

    closeBubble (target) {
        target.classList.remove('is-mini');
        target.classList.remove('is-open');

        target.style.height = 0;
        this.resizeItem();
    }

    toggleBubble(target) {
        if(target.classList.contains('is-open')){
            this.miniBubble(target);
        }else if(target.classList.contains('is-mini')){
            this.openBubble(target);
        }
    }

    closeAll () {
        this.isOpenBot = false;
        // this.el_wonjinbot.classList.remove('is-open');
        // this.el_beforeItem.style.height  = this.botSize + 'px';
        // this.el_focusItem.style.height  = this.botSize + 'px';

        // const bubbles = this.el_focusItem.querySelectorAll('.wonjinbot__bubble');
        // iterElement(bubbles , (bubble) => {
        //     bubble.style.height = this.botSize + 'px';
        //     bubble.classList.remove('is-open');
        // });

        iterElement(this.el_bubbles , (bubble) => {
            this.closeBubble(bubble);
        });

        const firstFocusBubble = this.el_focusItem.querySelector('.wonjinbot__bubble');

        this.miniBubble(firstFocusBubble);
    }


    resizeItem () {
        const bubbles = this.el_focusItem.querySelectorAll('.wonjinbot__bubble');
        let fullheight = 0;
        let openCount = 0;
        let miniCount = 0;
        iterElement(bubbles , (bubble) => {
            if(bubble.classList.contains('is-open')){
                const content = bubble.querySelector('.wonjinbot__bubblecontent');
                fullheight += content.offsetHeight;
                ++openCount;
            }else if(bubble.classList.contains('is-mini')){
                fullheight += this.botSize;
                ++miniCount;
            }
        });

        if(openCount === 0 && miniCount === 1){
            this.el_wonjinbot.classList.remove('is-active');
            this.isOpenBot = false;
        }else {
            this.el_wonjinbot.classList.add('is-active');
            this.isOpenBot = true;
        };

        fullheight += (openCount+miniCount-1)*this.distance;

        // this.el_beforeItem.style.height = this.botSize + 'px';
        this.el_beforeItem.style.height = 0;
        this.el_focusItem.style.height = fullheight + 'px';
    }

    openBubbleFunction(fn) {
        this.openBubbleFunctionList.push(fn);
    }

}
