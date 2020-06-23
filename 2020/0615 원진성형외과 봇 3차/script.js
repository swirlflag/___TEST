const hasClass      = (el,...classNames) => classNames.some((className) => el.classList && el.classList.contains(className));
const everyClass    = (el,...classNames) => classNames.every((className) => el.classList && el.classList.contains(className));
const noneClass     = (el,...classNames) => classNames.every((className) => el.classList && !el.classList.contains(className));
const addClass      = (el,...classNames) => classNames.forEach((className) => el.classList&& el.classList.add(className));
const removeClass   = (el,...classNames) => classNames.forEach((className) => el.classList.remove(className));

const iterElement = (el, fn) => {for(let i = 0,l = el.length; i < l; ++i){fn(el[i],i)}};

const Wonjinbot = class {

    originSize              = [];

    el_wonjinbot            = document.querySelector('#wonjinbot');
    el_bubbles              = null;
    el_items                = null;
    el_background           = null;
    el_eyes                 = null;

    focusIndex              = 0;
    focusItem               = null;
    focusBeforeItem         = null;
    focusBubbles            = null;
    visibleBubbles          = null;
    focusBubbleStack        = [];
    maxItemLength           = 0;

    eyesSightDefalutTime    = 500;
    eyesSightRandomTime     = 1500;
    eyesBlinkDefalutTime    = 100;
    eyesBlinkRandomTime     = 3000;
    eyesMoveMaxPercent      = 87;

    is_openBot              = false;
    is_openChange           = false;
    is_animating            = false;
    is_animatingStack       = 0;

    size_distance           = 10;
    size_padding            = 11;
    size_paddingW           = 20;
    size_paddingH           = 8;
    size_paddingOpenH       = 16;
    size_bot                = 34;
    size_loadingType        = 26;

    time_toClose            = 0.5;

    color_wonjinblue        = '#84c3ff';
    color_openBackground    = '#faa';
    color_openText          = '#000';
    color_miniText          = '#fff';
    color_transparent       = 'transparent';

    saveAction              = () => {};

    aniIncrease () {
        ++this.is_animatingStack;
        this.is_animating = this.is_animatingStack > 0;
    }
    aniDecrease () {
        --this.is_animatingStack;
        this.is_animating = this.is_animatingStack > 0;
        if(!this.is_animating){
            this.saveAction();
            this.saveAction = () => {};
        }
    }

    constructor() {
        this.render();
        this.selecting();
        this.getOriginSize();
        this.bindDefaultEvent();
        this.closeBubbleAll(this.focusItem);
        this.sizingBackground(this.focusBubbles[0]);
        this.checkIsOpenBot();
        this.runEyes();
    }

    render(){

    }

    selecting() {
        this.el_contents        = this.el_wonjinbot.querySelector('#wonjinbot__contents');
        this.el_items           = this.el_wonjinbot.querySelectorAll('.wonjinbot__item');
        this.el_bubbles         = this.el_wonjinbot.querySelectorAll('.wonjinbot__bubble');
        this.focusingItem(this.focusIndex);
        this.focusBeforeItem    = this.focusItem;
        this.focusBubbles       = this.focusItem.querySelectorAll('.wonjinbot__bubble');
        this.el_background      = this.el_wonjinbot.querySelector('#wonjinbot__background');
        this.el_eyes            = this.el_wonjinbot.querySelector('.wonjinbot__emojieyes');
        this.maxItemLength      = this.el_items.length;
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

            // if(hasClass(bubble, 'type-loading')){
            //     miniWidth = this.size_loadingType;
            // }

            bubble.setAttribute('size-width' , `${miniWidth},${openWidth}`);
            bubble.setAttribute('size-height' , openHeight);

            bubble.style.width = miniWidth + (this.size_paddingW *2) + 'px';
            // bubble.style.height = this.size_bot + 'px';
            bubble.style.height = 0 + 'px';
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
                    // this.closeBubbleAll();
                };
            };
        });
    }

    runEyes() {

        const loopSight = () => {
            const nextTime  = this.eyesSightDefalutTime + (Math.random() * this.eyesSightRandomTime);
            const randomX   = this.eyesMoveMaxPercent - (Math.random() * (this.eyesMoveMaxPercent*2));
            const randomY   = this.eyesMoveMaxPercent - (Math.random() * (this.eyesMoveMaxPercent*2));
            const randomEaseTime = Math.random() + 0.3;
            gsap.to(this.el_eyes , randomEaseTime,  {
                xPercent : randomX,
                yPercent : randomY,
                ease     : Power4.easeOut,
            });
            setTimeout(loopSight,nextTime);
        }

        const loopBlink = () => {
            const nextTime  = this.eyesBlinkDefalutTime + (Math.random() * this.eyesBlinkRandomTime);
            const tl = new gsap.timeline();
            tl.to(this.el_eyes, 0.11,   {scaleY : 0 , ease : Power2.easeIn});
            tl.to(this.el_eyes, 0.2,    {scaleY : 1, ease : Power2.easeOut});
            setTimeout(loopBlink,nextTime);
        }

        loopSight();
        loopBlink();
    }

    change(number) {
        if(this.is_animating){
            this.saveAction = () => {
                this.change(number);
            }
            return;
        }

        this.is_change = true;
        if(this.is_openBot){
            this.is_openChange = true;
        }

        this.focusingItem(number);

        const focusFirstBubble = this.focusBubbles[0];

        this.closeBubbleAll(this.focusBeforeItem);
        this.closeBubbleAll(this.focusItem);
        this.checkIsOpenBot();
        this.sizingBackground(focusFirstBubble);

    }

    focusingItem(number) {
        this.focusIndex         = number;
        this.focusBeforeItem    = this.focusItem;
        this.focusItem          = this.el_items[this.focusIndex];
        this.focusBubbles       = this.focusItem.querySelectorAll('.wonjinbot__bubble');

        if(this.focusBeforeItem){
            removeClass(this.focusBeforeItem,'is-focus');
            // this.focusBeforeItem.style.opacity = 0;
        }

        addClass(this.focusItem,'is-focus');
        // this.focusItem.style.opacity = 1;
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

    sizingBackground(focusBubble) {

        focusBubble = focusBubble || this.focusBubbles[0];

        let backgroundWidthDealy = 0;

        if(this.is_openBot){
            this.el_background.style.opacity = 0;
            backgroundWidthDealy += 0.5;
        }else if(this.is_openChange){
            backgroundWidthDealy += 0.5;
        }else {
            backgroundWidthDealy += 0.5;
            gsap.to(this.el_background, 0, {
                opacity     : 1,
                delay       : 0.5,
            });
        };

        if(!hasClass(focusBubble, 'is-first')){
            return
        }

        focusBubble = focusBubble || this.focusBubbles[0];

        const values = focusBubble.getAttribute('size-width').split(',').map(n => parseInt(n));

        let widthValue = this.size_paddingW*2 ;

        if(hasClass(focusBubble, 'is-open')){
            widthValue += values[1];
        }else {
            widthValue += values[0];
        };

        gsap.to(this.el_background, 0.5, {
            onStart     : () => {this.aniIncrease()},
            width       : widthValue,
            ease        : Back.easeOut.config(2),
            delay       : backgroundWidthDealy,
            onComplete  : () => {
                this.aniDecrease()
                this.is_openChange = false;
                this.is_change =  false;
            },
        });
    }

    appearBubble(bubble) {

        const isFirst = hasClass(bubble, 'is-first');
        const duration = isFirst ? 0 : 0.5;

        // console.log(duration)

        addClass(bubble, 'is-appear');

        if(isFirst){
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

    miniBubble(bubble, nocalc) {
        if(hasClass(bubble, 'is-mini') && noneClass(bubble, 'is-first')){
            return;
        };
        if(this.is_animating){
            return;
        };

        const item = bubble.parentElement;

        let miniWidthDelay  = 0.5;
        let miniHeightDelay = 0;
        const fromOpenBubble = hasClass(bubble,'is-open');
        const fromOpenBot   = this.is_openBot;

        if(hasClass(bubble, 'is-first') || noneClass(bubble, 'is-mini' , 'is-open')){
            this.appearBubble(bubble);
            if(this.is_change || fromOpenBubble){
                miniWidthDelay  += 0.5;
                miniHeightDelay += 0.5;
            }
        };

        if(hasClass(bubble, 'is-first')){
            miniWidthDelay -= 0.5;
            miniHeightDelay -= 0.5;
        }

        addClass(bubble, 'is-mini');
        removeClass(bubble,'is-open');

        this.checkIsOpenBot();
        const isOpenBot = this.is_openBot;

        let miniWidth     = bubble.getAttribute('size-width').split(',').map(n => +n)[0] + (this.size_paddingW*2);
        const miniHeight    = this.size_bot ;

        if(hasClass(bubble, 'type-loading')){
            miniWidth = this.size_loadingType + (this.size_paddingW*2);
        }

        gsap.to(bubble, 0.5, {
            width   : miniWidth,
            delay   : miniWidthDelay,
            ease    : Back.easeOut.config(1.4),
            opacity : 1,
        });

        gsap.fromTo(bubble, 0.5 , {
            backgroundColor : fromOpenBubble ? this.color_openBackground : this.color_transparent,
        }, {
            backgroundColor : isOpenBot || fromOpenBot ? this.color_wonjinblue : this.color_transparent ,
        });

        gsap.to(bubble, 0.5, {
            onStart     : () => {this.aniIncrease()},
            height      : miniHeight,
            delay       : miniHeightDelay,
            ease        : Power2.easeOut,
            color       : this.color_miniText,
            onComplete  : () => {this.aniDecrease();},
        });

        if(!nocalc){
            this.checkIsOpenBot();
            this.bubblesPosition(item);
            this.sizingBackground();
        };
    }

    openBubble(bubble, nocalc) {
        if(hasClass(bubble, 'is-open')){
            return
        }
        if(this.is_animating){
            return
        }

        let appearDelay = 0;
        const item = bubble.parentElement;

        if(noneClass(bubble, 'is-mini' , 'is-open')){
            this.appearBubble(bubble);
            appearDelay = 1;
        };

        if(hasClass(bubble, 'type-loading')){
            removeClass(bubble, 'type-loading');
        }

        addClass(bubble, 'is-open');
        removeClass(bubble, 'is-mini');

        this.checkIsOpenBot();

        const openWidth     = bubble.getAttribute('size-width').split(',').map(n => +n)[1] + (this.size_paddingW*2);
        const openHeight    = +bubble.getAttribute('size-height') + (this.size_paddingOpenH*2);

        bubble.style.opacity = 1;

        gsap.to(bubble, 0.5, {
            width           : openWidth,
            ease            : Power2.easeOut,
            delay           : appearDelay,
            color           : this.color_openText,
        });

        gsap.fromTo(bubble, 0.5 , {
            backgroundColor : this.color_wonjinblue,
        },{
            backgroundColor : this.color_openBackground,
        })

        gsap.to(bubble, 0.5, {
            onStart     : () => {this.aniIncrease()},
            height      : openHeight,
            ease        : Back.easeOut,
            delay       : appearDelay,
            onComplete  : () => {this.aniDecrease()},
        });

        if(!nocalc){
            this.checkIsOpenBot();
            this.bubblesPosition(item);
            this.sizingBackground();
        }
    }

    toggleBubble(bubble) {

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

        const item = bubble.parentElement;

        removeClass(bubble,'is-mini' , 'is-open');

        this.checkIsOpenBot();

        gsap.to(bubble, this.time_toClose , {
            onStart     : () => {this.aniIncrease()},
            height      : 0,
            padding     : 0,
            onComplete  : () => {this.aniDecrease()},
        });

        this.bubblesPosition(item);
    }

    closeBubbleAll(item) {

        if(this.is_animating){
            return
        }

        item = item || this.focusItem;

        const bubbles = item.querySelectorAll('.wonjinbot__bubble');

        iterElement(bubbles , (bubble,i) => {
            if(i === 0 && item === this.focusItem){
                this.miniBubble(bubble, true)
            }else {
                const isFirst = hasClass(bubble, 'is-first');

                gsap.to(bubble, 0.5, {
                    height      : isFirst ? this.size_bot : 0,
                    y           : 0,
                    opacity     : isFirst ? 1 : 0,
                    backgroundColor : this.color_wonjinblue,
                });

                removeClass(bubble,'is-mini' , 'is-open');
                this.sizingBackground();

                const isBeforeItem = item === this.focusBeforeItem;

                setTimeout(() => {
                    if(isBeforeItem){
                        const miniWidth = 0;
                        bubble.style.width = miniWidth + 'px';
                    }
                    bubble.style.opacity = 0;
                    this.el_background.style.opacity = 1;
                },500);

            };
        });

        const isCloseAll = item === this.focusBeforeItem;

        this.checkIsOpenBot();
        this.bubblesPosition(item,isCloseAll);
    }

    bubblesPosition (item, closeAll = false) {

        item = item || this.focusItem;

        closeAll && (item = this.focusBeforeItem);

        const positionStack = [];

        const visibleBubbles = item.querySelectorAll('.wonjinbot__bubble.is-mini , .wonjinbot__bubble.is-open');

        const reverseBubbles = [...visibleBubbles].reverse();

        let stackValue = 0;
        iterElement(reverseBubbles , (bubble) => {
            let addValue = 0;
            if(hasClass(bubble, 'is-mini')){
                addValue = this.size_bot + (this.size_distance);
            }
            else if(hasClass(bubble,'is-open')) {
                addValue = +bubble.getAttribute('size-height') + ((this.size_paddingOpenH*2) + (this.size_distance));
            }

            positionStack.push(stackValue);
            stackValue -= addValue;
        });

        iterElement(visibleBubbles , (bubble,i) => {
            const reverse   = [...positionStack].reverse();
            let yValue    = reverse[i];
            if(closeAll){
                yValue = 0;
            }

            // let giveColor = this.color_transparent;
            let giveColor = this.color_wonjinblue;

            if(this.is_openBot){
                if(hasClass(bubble, 'is-open')){
                    giveColor = this.color_openBackground;
                }
                else if(hasClass(bubble, 'is-mini')){
                    giveColor = this.color_wonjinblue;
                }
            }

            bubble.style.backgroundColor = giveColor;

            gsap.to(bubble,  0.5,  {
                onStart     : () => {this.aniIncrease()},
                y           : yValue ,
                ease        : Back.easeOut,
                onComplete  : () => {this.aniDecrease()},
            },);
        });

    }

};