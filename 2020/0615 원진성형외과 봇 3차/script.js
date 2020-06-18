const hasClass      = (el,...classNames) => classNames.some((className) => el.classList && el.classList.contains(className));
const everyClass    = (el,...classNames) => classNames.every((className) => el.classList && el.classList.contains(className));
const noneClass     = (el,...classNames) => classNames.every((className) => el.classList && !el.classList.contains(className));
const addClass      = (el,...classNames) => classNames.forEach((className) => el.classList&& el.classList.add(className));
const removeClass   = (el,...classNames) => classNames.forEach((className) => el.classList.remove(className));

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
    focusBeforeItem     = null;
    focusBubbles        = null;
    visibleBubbles      = null;
    focusBubbleStack    = [];
    maxItemLength       = 0;

    is_openBot          = false;
    is_openChange       = false;
    is_animating        = false;
    is_animatingStack   = 0;

    size_distance       = 10;
    size_padding        = 11;
    size_bot            = 34;
    size_loadingType    = 40;

    time_toClose        = 0.5;

    color_wonjinblue    = '#84c3ff';

    aniIncrease () {
        ++this.is_animatingStack;
        this.is_animating = this.is_animatingStack > 0;
    }
    aniDecrease () {
        --this.is_animatingStack;
        this.is_animating = this.is_animatingStack > 0;
    }

    constructor() {
        this.render();
        this.selecting();
        this.getOriginSize();
        this.bindDefaultEvent();
        this.closeBubbleAll(true);
        this.checkIsOpenBot();
    }

    render(){

    }

    selecting() {
        this.el_contents    = this.el_wonjinbot.querySelector('#wonjinbot__contents');
        this.el_items       = this.el_wonjinbot.querySelectorAll('.wonjinbot__item');
        this.el_bubbles     = this.el_wonjinbot.querySelectorAll('.wonjinbot__bubble');
        this.focusingItem(this.focusIndex);
        this.focusBubbles   = this.focusItem.querySelectorAll('.wonjinbot__bubble');
        this.el_background  = this.el_wonjinbot.querySelector('#wonjinbot__background');
        this.maxItemLength  = this.el_items.length;
        iterElement(this.el_items, (item) => addClass(item.querySelector('.wonjinbot__bubble'), 'is-first'));
    }

    getOriginSize() {
        for(let i = 0, l = this.el_bubbles.length; i < l; ++i){
            const bubble = this.el_bubbles[i];

            const title = bubble.querySelector('.wonjinbot__title');
            const content = bubble.querySelector('.wonjinbot__bubblecontent');

            let miniWidth     = title.offsetWidth;
            let openWidth     = content.offsetWidth;
            let openHeight    = content.offsetHeight;

            if(hasClass(bubble, 'type-loading')){
                miniWidth = this.size_loadingType;
            }

            bubble.setAttribute('size-width' , `${miniWidth},${openWidth}`);
            bubble.setAttribute('size-height' , openHeight);
        }
    }

    bindDefaultEvent() {

        window.addEventListener('click' , (e) => {
            const path = e.path || e.composedPath();
            if(path.find((el) => el.id === 'wonjinbot')){
                const bubble = path.find((el) => hasClass(el, 'wonjinbot__bubble'));
                if(bubble){
                    this.toggleBubble(bubble);
                };
            }else {
                if(this.is_openBot){
                    this.closeBubbleAll();
                };
            };
        });
    }

    change(number) {
        if(this.is_animating){
            return
        }

        const isOpenBot = this.is_openBot;
        if(isOpenBot){
            this.is_openChange = true;
        };

        setTimeout(() => {
            this.focusingItem(number);
            this.closeBubbleAll();
        },isOpenBot ? 500 : 0);
    }

    focusingItem(number) {
        this.focusIndex         = number;
        this.focusBeforeItem    = this.focusItem;
        this.focusItem          = this.el_items[this.focusIndex];
        this.focusBubbles       = this.focusItem.querySelectorAll('.wonjinbot__bubble');

        if(this.focusBeforeItem){
            removeClass(this.focusBeforeItem,'is-focus');
            this.focusBeforeItem.style.opacity = 0;
        }

        addClass(this.focusItem,'is-focus');
        this.focusItem.style.opacity = 1;
    }

    checkIsOpenBot() {
        const count = [...this.focusBubbles].reduce((p,c) => {
            p += hasClass(c, 'is-mini') ? 1 : 0;
            p += hasClass(c, 'is-open') ? 10 : 0 ;
            return p;
        }, 0);

        if(count > 1){
            this.is_openBot = true;
            addClass(this.el_wonjinbot , 'is-active');
        }else {
            this.is_openBot = false;
            removeClass(this.el_wonjinbot , 'is-active');
        };

    }

    sizingBackground() {
        // return

        let backgroundDealy = 0;

        if(this.is_openBot){
            this.el_background.style.opacity = 0.3;
        }else if(this.is_openChange){
            backgroundDealy += 0.5;
        }else {
            backgroundDealy += 0.5;
            gsap.to(this.el_background, 0, {
                opacity     : 1,
                delay       : 0.5,
            });
        };

        const focusBubble = this.focusBubbles[0];
        const values = focusBubble.getAttribute('size-width').split(',').map(n => parseInt(n));

        let widthValue = this.size_padding*2 ;

        if(hasClass(focusBubble, 'is-mini')){
            widthValue += values[0];
        }
        else if(hasClass(focusBubble, 'is-open')){
            widthValue += values[1];
        }

        gsap.to(this.el_background, 0.5, {
            onStart     : () => {this.aniIncrease()},
            width       : widthValue,
            ease        : Back.easeOut,
            delay       : backgroundDealy,
            onComplete  : () => {
                this.aniDecrease()
                this.is_openChange = false;
            },
        });
    }

    appearBubble(bubble) {

        const isFirst = hasClass(bubble, 'is-first');
        const duration = isFirst ? 0 : 0.5;

        console.log(duration)

        addClass(bubble, 'is-appear');

        if(isFirst){
            // gsap.to()
            removeClass(bubble, 'is-appear');
        }else {
            gsap.fromTo(bubble, duration, {
                width   : 0,
                height  : this.size_bot,
                padding : 0,
            } , {
                onStart     : () => {this.aniIncrease()},
                // width       : this.size_bot,
                height      : this.size_bot,
                delay       : 0.5,
                onComplete  : () => {
                    removeClass(bubble, 'is-appear');
                    this.aniDecrease();
                }
            });
        }

    }

    miniBubble(bubble) {
        if(hasClass(bubble, 'is-mini') && noneClass(bubble, 'is-first')){
            return;
        };
        if(this.is_animating){
            return;
        };

        let miniWidthDelay  = 0.5;
        let miniHeightDelay = 0;

        if(hasClass(bubble, 'is-first') || noneClass(bubble, 'is-mini' , 'is-open')){
            this.appearBubble(bubble);
            miniWidthDelay  += 0.5;
            miniHeightDelay += 0.5;
        };

        if(hasClass(bubble, 'is-first')){
            miniWidthDelay -= 0.5;
            miniHeightDelay -= 0.5;
        }

        addClass(bubble, 'is-mini');
        removeClass(bubble,'is-open');

        const miniWidth     = bubble.getAttribute('size-width').split(',').map(n => +n)[0] + (this.size_padding*2);
        const miniHeight    = this.size_bot;

        bubble.style.opacity = 1;

        gsap.to(bubble, 0.5, {
            width   : miniWidth,
            delay   : miniWidthDelay,
            ease    : Power2.easeOut,
        });

        gsap.to(bubble, 0.5, {
            onStart     : () => {this.aniIncrease()},
            height      : miniHeight,
            delay       : miniHeightDelay,
            ease        : Power2.easeOut,
            onComplete  : () => {this.aniDecrease()},
        });

        this.checkIsOpenBot();
        this.bubblesPosition();
        if(hasClass(bubble, 'is-first')){
            this.sizingBackground();
        }
    }

    openBubble(bubble) {
        if(hasClass(bubble, 'is-open')){
            return
        }
        if(this.is_animating){
            return
        }

        let appearDelay = 0;

        if(noneClass(bubble, 'is-mini' , 'is-open')){
            this.appearBubble(bubble);
            appearDelay = 1;
        };

        addClass(bubble, 'is-open');
        removeClass(bubble, 'is-mini');

        const openWidth     = bubble.getAttribute('size-width').split(',').map(n => +n)[1] + (this.size_padding*2);
        const openHeight    = +bubble.getAttribute('size-height') + (this.size_padding*2);

        bubble.style.opacity = 1;

        gsap.to(bubble, 0.5, {
            width   : openWidth,
            ease    : Power2.easeOut,
            delay   : appearDelay,
        });

        gsap.to(bubble, 0.5, {
            onStart     : () => {this.aniIncrease()},
            height      : openHeight,
            ease        : Back.easeOut,
            delay       : appearDelay,
            onComplete  : () => {this.aniDecrease()},
        });

        this.checkIsOpenBot();
        this.bubblesPosition();
        if(hasClass(bubble, 'is-first')){
            this.sizingBackground();
        };
    }

    toggleBubble(bubble) {
        if(this.is_animating){
            return;
        };
        if(hasClass(bubble, 'is-open')){
            this.miniBubble(bubble);
        }
        else if(hasClass(bubble, 'is-mini')){
            this.openBubble(bubble);
        }
    }

    closeBubble(bubble) {
        if(this.is_animating){
            return;
        };

        removeClass(bubble,'is-mini' , 'is-open');

        gsap.to(bubble, this.time_toClose , {
            onStart     : () => {this.aniIncrease()},
            height      : 0,
            padding     : 0,
            onComplete  : () => {this.aniDecrease()},
        });

        this.bubblesPosition();
    }

    closeBubbleAll() {

        iterElement(this.focusBubbles , (bubble,i) => {
            this[ i ? 'closeBubble' : 'miniBubble'](bubble, true);
        });

        this.checkIsOpenBot();
        this.sizingBackground();
    }

    bubblesPosition () {

        this.focusBubbleStack = [];

        this.visibleBubbles = this.focusItem.querySelectorAll('.wonjinbot__bubble.is-mini , .wonjinbot__bubble.is-open');

        const reverseBubbles = [...this.visibleBubbles].reverse();

        let stackValue = 0;
        iterElement(reverseBubbles , (bubble) => {
            let addValue = 0;
            if(hasClass(bubble, 'is-mini')){
                addValue = this.size_bot + (this.size_distance);
            }
            else if(hasClass(bubble,'is-open')) {
                addValue = +bubble.getAttribute('size-height') + ((this.size_padding*2) + (this.size_distance));
            }

            this.focusBubbleStack.push(stackValue);
            stackValue -= addValue;
        });

        iterElement(this.visibleBubbles , (bubble,i) => {
            const reverse   = [...this.focusBubbleStack].reverse();
            const yValue    = reverse[i];
            gsap.to(bubble,  0.5,  {
                onStart     : () => {this.aniIncrease()},
                y           : yValue ,
                ease        : Power2.easeOut,
                onComplete  : () => {this.aniDecrease()},
            },);
        });

    }

};