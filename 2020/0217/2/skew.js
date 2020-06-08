
const dxe = new DX_easeBase();


const Slider_fxnt = class {

    constructor(stage) {
        this.stage          = stage;

        this.maskItems      = null;
        this.maskContents    = null;
        this.beforeImages   = null;
        this.currentImages  = null;

        this.sourceList     = [];
        this.sliderLength   = this.sourceList.length;

        this.currentIndex   = 0;
        this.beforeIndex    = 0;

        this.blockHeight    = 8;
        this.skewDegree     = 23.5;
        this.minSplitPercent   = 1;
        this.maxSplitPercent   = 15;
        this.scaleCorrection = 1.008;
    }

    makeItem(index) {

        const item      = document.createElement('div');
        const content   = document.createElement('div');
        const current   = document.createElement('div');
        const before    = document.createElement('div');
        item.classList.add('mask-item');
        item.style.height = this.blockHeight + 'vmax';
        item.style.transform = `skewY(${-this.skewDegree}deg) scale(${this.scaleCorrection})`;
        if(index === 0){
            item.style.marginTop = (index-1) * this.blockHeight + 'vmax';
        }
        // item.style.top = -(index-1) * 2 + 'px';
        content.style.marginTop = (index-1) * this.blockHeight * -1 + 'vmax';
        content.style.transform = `skewY(${this.skewDegree}deg)`
        content.classList.add('mask-content');
        current.classList.add('mask-image');
        current.classList.add('current');
        before.classList.add('mask-image');
        before.classList.add('before');
        content.appendChild(before);
        content.appendChild(current);
        item.appendChild(content);
        return item;

    }

    useSlider() {
        for(let i = 0; i < Math.round(130/this.blockHeight); ++i){
            const newItem = this.makeItem(i);
            this.stage.appendChild(newItem);
        }
        this.maskItems      = this.stage.querySelectorAll('.mask-item');
        this.maskContents      = this.stage.querySelectorAll('.mask-content');
        this.currentImages  = this.stage.querySelectorAll('.mask-image.current');
        this.beforeImages   = this.stage.querySelectorAll('.mask-image.before');

        for(let i = 0; i < this.currentImages.length; ++i){
            const target = this.sourceList[0];
            this.currentImages[i].style.backgroundImage = `url(${target.url})`;
            this.stage.style.backgroundColor = target.backgroundColor;
        }
    }

    addImage(source){
        this.sourceList.push(source);
        this.sliderLength = this.sourceList.length ;
    }

    currentControler(bool = true) {
        this.beforeIndex = this.currentIndex;
        if(bool){
            this.currentIndex += 1;
            if(this.currentIndex >= this.sliderLength){
               this.currentIndex = 0;
            }
        }else {
            this.currentIndex -= 1;
            if(this.currentIndex < 0){
                this.currentIndex = this.sliderLength - 1;
            }
        }
    }

    chnageSlide() {

        const beforeItem = this.sourceList[this.beforeIndex];
        const currentItem = this.sourceList[this.currentIndex];

        this.stage.style.backgroundColor = currentItem.backgroundColor;

        for(let i = 0; i < this.maskItems.length; ++i){
            this.beforeImages[i].style.backgroundImage = `url(${beforeItem.url})`;
            this.currentImages[i].style.backgroundImage = `url(${currentItem.url})`;

        //  투명도
            dxe.addEase({
                duration : 700,
                ease : 'inExpo',
                frameFunction : (eo) => {
                    this.beforeImages[i].style.opacity = 1 - eo.progress;
                    this.currentImages[i].style.opacity = eo.progress;
                }
            });


        // 쪼개기

        const random = Math.abs(this.minSplitPercent + (Math.random() * this.maxSplitPercent));

            dxe.addEase({
                duration : 350,
                ease: 'inCubic',
                start : 0,
                end : random,
                frameFunction : (eo) => {
                    const x = (eo.progressValue) * (i%2 ? -1 : 1);
                    this.maskItems[i].style.transform = `skewY(${-this.skewDegree}deg) translateX(${x}%) scale(${this.scaleCorrection})`;
                },
                finishFunction : (eo) => {
                    dxe.addEase({
                        duration : 500,
                        start : random,
                        end : 0,
                        ease : 'outCubic',
                        frameFunction : (eo) => {
                            const x = (eo.progressValue) * (i%2 ? -1 : 1);
                            this.maskItems[i].style.transform = `skewY(${-this.skewDegree}deg) translateX(${x}%) scale(${this.scaleCorrection})`;
                        }
                    });

                }
            });


        // before 내부마스킹

        dxe.addEase({
            duration : 500,
            ease : 'inOutCubic',
            start : 0,
            end: 50,
            frameFunction : (eo) => {
                this.beforeImages[i].style.transform = `translateX(${-eo.progressValue * (i%2?-1:1)}px)`;
            }
        })

        //  current 내부마스킹
            dxe.addEase({
                duration : 1300,
                ease  : 'outCubic',
                start : 200,
                end : 0 ,
                frameFunction : (eo) => {
                    // this.currentImages[i].style.top = `${eo.progressValue * (i%2?-1:1)}px`;
                    this.currentImages[i].style.transform = `translateY(${eo.progressValue *  (i%2?-1:1)}px)`;
                    // this.currentImages[i].style.left = `${eo.progressValue * (i%2?-1:1)}px`;
                }
            });

        }

        // this.stage.style.backgroundColor = this.colorset[this.currentIndex];

    }

    prevSlide() {
        this.currentControler(false);
        this.chnageSlide();
    }

    nextSlide() {
        this.currentControler(true);
        this.chnageSlide();
    }

}
