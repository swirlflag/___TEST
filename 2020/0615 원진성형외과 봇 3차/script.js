const iterElement = (el, fn) => {
    const l = el.length;
    for(let i = 0; i < l; ++i){
        fn(el[i],i);
    };
};

const Wonjinbot = class {

    originSize          = [];

    el_wonjinbot        = document.querySelector('#wonjinbot');
    el_bubbles          = null;
    el_items            = null;

    focusIndex          = 0;
    focusItem           = null;
    focusBubbles        = null;
    visibleBubbles      = null;
    focusBubbleStack    = [];
    bubblePadding       = 11;
    bubbleDistance      = 10;
    botSize             = 34;

    constructor() {
        this.render();
        this.selecting();
        this.getOriginSize();
    }

    render(){

    }

    selecting() {
        this.el_items       = this.el_wonjinbot.querySelectorAll('.wonjinbot__item');
        this.el_bubbles     = this.el_wonjinbot.querySelectorAll('.wonjinbot__bubble');
        this.focusItem      = this.el_items[this.focusIndex];
        this.focusBubbles   = this.focusItem.querySelectorAll('.wonjinbot__bubble');
    }

    getOriginSize() {
        for(let i = 0, l = this.el_bubbles.length; i < l; ++i){
            const bubble = this.el_bubbles[i];

            const title = bubble.querySelector('.wonjinbot__title');
            const content = bubble.querySelector('.wonjinbot__bubblecontent');

            bubble.setAttribute('size-width' , `${title.offsetWidth},${content.offsetWidth}`);
            bubble.setAttribute('size-height' , content.offsetHeight);
        }
    }

    change() {

    }

    appearBubble(bubble) {

    }

    miniBubble(bubble) {
        if(bubble.classList.contains('is-mini')){
            return
        }
        bubble.classList.add('is-mini');
        bubble.classList.remove('is-open');

        const miniWidth     = bubble.getAttribute('size-width').split(',').map(n => +n)[0] + (this.bubblePadding*2);
        const miniHeight    = this.botSize;
        const yPoint        = 0;
        gsap.to(bubble, 0.5, {
            width   : miniWidth,
            height  : miniHeight,
        });

        this.bubblesPosition();
    }

    openBubble(bubble) {
        if(bubble.classList.contains('is-open')){
            return
        }
        bubble.classList.add('is-open');
        bubble.classList.remove('is-mini');

        const openWidth     = bubble.getAttribute('size-width').split(',').map(n => +n)[1] + (this.bubblePadding*2);
        const openHeight    = +bubble.getAttribute('size-height') + (this.bubblePadding*2);

        gsap.to(bubble, 0.5, {
            width   : openWidth,
            height  : openHeight,
        });
        this.bubblesPosition();
    }

    toggleBubble(bubble) {
        if(bubble.classList.contains('is-open')){
            this.miniBubble(bubble);
        }
        else if(bubble.classList.contains('is-mini')){
            this.openBubble(bubble);
        }
    }

    closeBubble() {

    }

    bubblesPosition () {

        this.focusBubbleStack = [];

        this.visibleBubbles = this.focusItem.querySelectorAll('.wonjinbot__bubble.is-mini , .wonjinbot__bubble.is-open');

        const reverseBubbles = [...this.visibleBubbles].reverse();

        let stackValue = 0;
        iterElement(reverseBubbles , (bubble) => {
            let addValue = 0;
            if(bubble.classList.contains('is-mini')){
                addValue = this.botSize + (this.bubbleDistance);
            }
            else if(bubble.classList.contains('is-open')) {
                addValue = +bubble.getAttribute('size-height') + ((this.bubblePadding*2) + (this.bubbleDistance));
            }

            this.focusBubbleStack.push(stackValue);
            stackValue -= addValue;
        });

        iterElement(this.visibleBubbles , (bubble,i) => {
            const reverse   = [...this.focusBubbleStack].reverse();
            const yValue    = reverse[i];
            gsap.to(bubble,  0.5,  {y : yValue},);
        });

        // console.log(this.focusBubbleStack);

    }

};