const slideNumber = 4;


const mainSlider = document.querySelector('#main_slider');

const mainHeaders = document.querySelectorAll('#slider_header > .header_item');
const mainSources = document.querySelectorAll('#slider_source > .source_item');

mainSlider.style.height = slideNumber * 100 + 'vh'


window.addEventListener('scroll' , () => {

    const winH = window.innerHeight;
    const maxH = mainSlider.offsetHeight;
    const nowSt = window.scrollY;
    const nowIndex = parseInt(nowSt / winH)

    // console.log(nowIndex);

    for(let i = 0; i < slideNumber; ++i){
        if(nowIndex === i){
            mainHeaders[i].classList.add('is-active');
            mainSources[i].classList.add('is-active');
        }else {
            mainHeaders[i].classList.remove('is-active');
            mainSources[i].classList.remove('is-active');
        }
    }

});