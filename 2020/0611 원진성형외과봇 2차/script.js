const iterElement = (el, fn) => {
    const l = el.length;
    for(let i = 0; i < l; ++i){
        fn(el[i],i);
    }
}

const Wonjinbot = class {


    el_wonjinbot        = document.querySelector('#wonjinbot');
    el_background       = null;
    el_items            = null;
    el_focusItem        = null;
    el_beforeItem       = null;

    isOpenBot           = false;


    focusBubbleSize     = [];
    focusItemSize       = [];

    botSize             = 34;

    fakePadding         = 20;

    maxLength           = 0;
    curerntNumber       = 0;

    distance            = 10;

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
                                        <div class="wonjinbot__bubble">
                                            <div class="wonjinbot__bubblecircle"></div>
                                            <div class="wonjinbot__bubblecontent">
                                                <div class="wonjinbot__title">
                                                    <p>${targetBubble.title}</p>
                                                </div>
                                                <div class="wonjinbot__links">
                                                    ${(() => {
                                                        let resultLinks = ""
                                                        for(let k = 0; k < targetBubble.links.length; ++k){
                                                            const targetLink = targetBubble.links[k];
                                                            resultLinks += `
                                                                <a href="${targetLink.href}">${targetLink.name}</a>
                                                            `
                                                        }
                                                        return resultLinks;
                                                    })()}
                                                </div>
                                            </div>
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

        `
    }

    eventBind() {

        const checkBot = (el) => {
            const parent = el.parentElement;
            if(el.nodeName === "HTML" || parent.nodeName === "HTML"){
                this.close();
            }
            else if(parent.id === 'wonjinbot'){
                this.open();
                return null;
            }
            else {
                checkBot(parent);
            }
        }

        window.addEventListener('click', (e) => {
            checkBot(e.target);
        })
    }

    focusing(number) {
        this.curerntNumber  = number;
        this.el_beforeItem  = this.el_focusItem;
        this.el_focusItem   = this.el_items[this.curerntNumber];
        this.el_beforeItem.classList.remove('is-focus');
        this.el_focusItem.classList.add('is-focus');
    }

    sizingBackground () {
        this.el_background.style.width  = this.el_focusItem.offsetWidth + 'px';
    }

    change(number) {
        this.focusing(number);

        setTimeout(() => {
            this.sizingBackground();
        }, this.isOpenBot ? 500: 0);

        this.close();
    }

    open () {
        this.isOpenBot = true;
        this.el_wonjinbot.classList.add('is-open');

        const bubbles = this.el_focusItem.querySelectorAll('.wonjinbot__bubble');
        let fullheight = 0;
        iterElement(bubbles , (bubble) => {
            const content = bubble.querySelector('.wonjinbot__bubblecontent');
            bubble.style.height = content.offsetHeight + 'px';
            fullheight += content.offsetHeight + this.distance
        });

        this.el_focusItem.style.height = fullheight + 'px';

    }

    close () {
        this.isOpenBot = false;
        this.el_wonjinbot.classList.remove('is-open');
        this.el_beforeItem.style.height  = this.botSize + 'px';
        this.el_focusItem.style.height  = this.botSize + 'px';

        const bubbles = this.el_focusItem.querySelectorAll('.wonjinbot__bubble');
        iterElement(bubbles , (bubble) => {
            bubble.style.height = this.botSize + 'px';
        });

    }

}
