
const Slider = class {
    constructor(object) {
        this.make(object);
        this.init(object);
    }

    make(object) {
        const  {
            target,
            images,
            active
        } = object;

        const el_slider = document.createElement('div');
        el_slider.classList.add('slider');

        const makeArrow = () => {
            const el_sliderArrow = document.createElement('div');
            const el_sliderArrowPrev = document.createElement('div');
            const el_sliderArrowNext = document.createElement('div');

            el_sliderArrow.classList.add('slider-arrow');
            el_sliderArrowPrev.classList.add('slider-arrow-prev');
            el_sliderArrowNext.classList.add('slider-arrow-next');

            el_sliderArrow.appendChild(el_sliderArrowPrev);
            el_sliderArrow.appendChild(el_sliderArrowNext);

            el_slider.appendChild(el_sliderArrow);
        }

        const makeView = () => {

            const el_sliderView = document.createElement('div');
            el_sliderView.classList.add('slider-view')

            images.forEach((image, idx) => {

                const el_sliderViewItem = document.createElement('div');
                el_sliderViewItem.classList.add('slider-item')
                el_sliderView.appendChild(el_sliderViewItem);
            });

            el_slider.appendChild(el_sliderView);


        }

        const makeControl = () => {

            const el_sliderControl = document.createElement('div');
            el_sliderControl.classList.add('slider-control')

            images.forEach((image, idx) => {
                const el_sliderControlDot = document.createElement('span');
                el_sliderControlDot.classList.add('slider-dot')
                el_sliderControl.appendChild(el_sliderControlDot);
            });

            el_slider.appendChild(el_sliderControl);


        }

        makeView()
        makeArrow();
        makeControl();

        target.appendChild(el_slider);
    }


    init(object) {
        const  {
            target,
            images
            ,
            active
        } = object;

        this.viewItems = document.querySelectorAll('.slider-item');
        this.controls = document.querySelectorAll('.slider-dot');

        this.prev = document.querySelector('.slider-arrow-prev');
        this.next = document.querySelector('.slider-arrow-next');

        this.max = images.length - 1;
        this.min = 0;

        this.current = active;
        this.before = this.current;

        this.getTarget();


        this.currentItem.classList.add('in');
    }

    getTarget () {
        this.currentItem = this.viewItems[this.current];
        this.beforeItem  = this.viewItems[this.before];
    }

    slideTo(direction) {

        this.getTarget();

        [...this.viewItems].forEach((item) => {
            item.classList.remove('right' , 'left' , 'active' , 'before' , 'out' ,'in')
        });

        this.currentItem.classList.add(direction ? 'left' : 'right','in');
        this.beforeItem.classList.add(direction ? 'left' : 'right','out');

    }

    goPrev () {
        this.before = this.current;

        --this.current;

        if(this.current < this.min){
            this.current = this.max;
        }

        this.slideTo(false);

    }

    goNext () {
        this.before = this.current;

        ++this.current ;

        if(this.current > this.max){
            this.current = this.min;
        }

        this.slideTo(true);

    }

}

