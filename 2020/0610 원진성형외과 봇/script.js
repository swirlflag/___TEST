const iterElement = (el, fn) => {
    const l = el.length;
    for(let i = 0; i < l; ++i){
        fn(el[i],i);
    }
}

const Wonjinbot = class {


    el_wonjinbot        = document.querySelector('#wonjinbot');
    el_backgrounds      = null;
    el_items            = null;
    el_focusItem        = null;
    el_talk             = null;
    el_button           = null

    isOpenBot           = false;

    focusBubbleSize     = [];
    focusItemSize       = [];

    botSize             = 34;

    fakePadding         = 20;

    maxLength           = 0;
    curerntNumber       = 0;

    constructor (data) {
        if(!this.el_wonjinbot){
            return
        }
        this.init(data);
    }

    init(data) {
        this.render(data);
        this.maxLength          = data.length;
        this.el_talk            = this.el_wonjinbot.querySelector('#wonjinbot__talk');
        this.el_backgrounds     = this.el_wonjinbot.querySelectorAll('#talk__background span');
        this.el_items           = this.el_wonjinbot.querySelectorAll('.talk__item');
        this.el_focusItem       = this.el_items[this.curerntNumber];
        this.el_button          = this.el_wonjinbot.querySelector('#wonjinbot__button');
        this.eventBind();
    };

    render(data) {

        const maxBubbleLength = Math.max(...data.map(t => t.length));

        this.el_wonjinbot.innerHTML = `
            <div id="wonjinbot__button"></div>
            <div id="wonjinbot__talk">
                <div id="talk__background">
                    ${(() => {
                        let resultBackground = ""
                        for(let i = 0; i < maxBubbleLength; ++i){
                            resultBackground += "<span></span>";
                        }
                        return resultBackground;
                    })()}
                </div>
                <div id="talk__contents">
                    ${(() => {
                        let resultItem = ""
                        for(let i = 0; i < data.length; ++i){
                            const targetItem = data[i];
                            resultItem += `
                                <div class="talk__item">
                                    ${(() => {
                                        let resultBubble = ""
                                        for(let j = 0; j < targetItem.length; ++j){
                                            const targetBubble = targetItem[j];
                                            resultBubble += `
                                                <div class="talk__bubble">
                                                    <div class="talk__title">
                                                        <p>${targetBubble.title}</p>
                                                    </div>
                                                    <div class="talk__links">
                                                        ${(() => {
                                                            let resultLinks = "";
                                                            for(let k = 0; k < targetBubble.links.length; ++k){
                                                                const targetLink = targetBubble.links[k];
                                                                resultLinks += `
                                                                    <a href="${targetLink.href}">${targetLink.name}</a>
                                                                `;
                                                            }
                                                            return resultLinks;
                                                        })()}
                                                    </div>
                                                </div>
                                            `
                                        }
                                        return resultBubble;
                                    })()}
                                </div>
                            `
                        }
                        return resultItem;
                    })()}
                </div>
            </div>
            <div id="wonjinbot__emoji">
            </div>
        `
    }

    eventBind() {
        this.el_button.addEventListener('click' , () => {
            if(!this.isOpenBot){
                this.open();
            }
        })

        const checkBot = (el) => {
            const parnet = el.parentElement;
            if(parnet.nodeName === "HTML"){
                this.close();
            }
            else if(parnet.id === 'wonjinbot'){
                return null
            }
            else {
                checkBot(parnet);
            }
        }

        window.addEventListener('click', (e) => {
            checkBot(e.target);
        })
    }

    change(number) {

        if(0 > number || number >= this.maxLength){
            return null
        }

        this.el_focusItem.classList.remove('is-focus');
        this.el_focusItem = this.el_items[number];
        this.el_focusItem.classList.add('is-focus');

        this.focusItemSize = [this.el_focusItem.offsetWidth, this.el_focusItem.offsetHeight];

        const sizeArray = [];
        for(let i = 0; i < this.el_focusItem.children.length; ++i){
            const target = this.el_focusItem.children[i];
            const tagetheight = [...target.children].reduce((p,c) => p + c.offsetHeight , 0);

            sizeArray.push([target.offsetWidth, tagetheight])
        };
        this.focusBubbleSize = sizeArray;

        this.close();

    }

    open() {
        this.isOpenBot = true;
        this.el_wonjinbot.classList.add('is-open');
        this.sizing();
    }

    close () {
        this.isOpenBot = false;
        this.el_wonjinbot.classList.remove('is-open');
        this.sizing();
    }

    prev() {

    }

    next(){

    }

    sizing() {
        this.el_talk.style.width    = this.focusItemSize[0] + 'px';
        this.el_talk.style.height   = this.focusItemSize[1] + 'px';

        if(this.isOpenBot){
            for(let i = 0; i < this.el_backgrounds.length; ++i){
                const target = this.el_backgrounds[i];
                if(this.el_focusItem.children[i]){
                    target.classList.remove('is-hide');
                    target.style.width  = this.focusBubbleSize[i][0] + this.fakePadding + 'px';
                    target.style.height  = this.focusBubbleSize[i][1] + this.fakePadding +'px';
                }else {
                    target.classList.add('is-hide');
                };
            };
        }else {
            for(let i = 0; i < this.el_backgrounds.length; ++i){
                const target = this.el_backgrounds[i];
                if(i > 0){
                    target.classList.add('is-hide');
                }else {
                    target.classList.remove('is-hide');
                    target.style.width  = this.focusBubbleSize[i][0] + this.fakePadding + 'px';

                    target.style.height = this.botSize + 'px';
                };
            };
        };


        this.el_button.style.width = this.el_backgrounds[this.curerntNumber].offsetWidth + this.botSize + 5 + 'px';
        this.el_button.style.height = this.botSize + 'px';

    };




}


