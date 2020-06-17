const E = {
    sineIn      : Sine.easeIn,
    sineOut     : Sine.easeOut,
    sineInOut   : Sine.InOut,

    cubicIn      : Power2.easeIn,
    cubicOut     : Power2.easeOut,
    cubicInOut   : Power2.InOut,

    quartIn      : Power3.easeIn,
    quartOut     : Power3.easeOut,
    quartInOut   : Power3.easeInOut,

    quintIn      : Power4.easeIn,
    quintOut     : Power4.easeOut,
    quintInOut   : Power4.easeInOut,

    circIn      : Circ.easeIn,
    circOut     : Circ.easeOut,
    circInOut   : Circ.easeInOut,

    expoIn      : Expo.easeIn,
    expoOut     : Expo.easeOut,
    expoInOut   : Expo.easeInOut,

    bounceIn      : Bounce.easeIn,
    bounceOut     : Bounce.easeOut,
    bounceInOut   : Bounce.easeInOut,

    elasticIn      : Elastic.easeIn,
    elasticOut     : Elastic.easeOut,
    elasticInOut   : Elastic.easeInOut,

}

const makeScrollAction = (makeOptions = {}) => {
    const controller = new ScrollMagic.Controller();

    const {
        isTest,
    } = makeOptions;

    return (...options) => {
        let [
            targets,
            duration,
            tweenOptions = {},
            sceneOptions = {},
        ] = options;

        if(!tweenOptions.ease){
            tweenOptions.ease = 'linear';
        }

        if(typeof targets === "string"){
            targets = document.querySelectorAll(targets)
        }else if(targets instanceof HTMLElement){
            targets = [targets];
        }

        if(!targets[0]){
            console.warn('no target');
            return
        }

        const findTriggerLine = (inheritTarget, originTarget, canAttributeSearch = true , sceneOptions) => {
            if(sceneOptions && sceneOptions.triggerElement){
                return sceneOptions.triggerElement
            }
            originTarget || (originTarget = inheritTarget);
            if(canAttributeSearch){
                const triggerTarget = originTarget.getAttribute('trigger-target');
                if(triggerTarget){
                    return document.querySelector(`[trigger-pointer="${triggerTarget}"]`);
                }
            }

            const parent = inheritTarget.parentElement;

            if(parent.classList.contains('trigger-box')){
                const trigger = parent.querySelector('.trigger-line');
                return trigger;
            }
            else if(inheritTarget.nodeName === "HTML" || parent.nodeName === 'HTML'){
                return originTarget;
            }
            else {
                findTriggerLine(parent, originTarget, false);
            }
        }

        const targetLength = targets.length;

        const sceneList = [];

        for(let i = 0; i < targetLength; ++i){
            const target = targets[i];
            const trigger = findTriggerLine(target);

            const scene = new ScrollMagic.Scene({
                    triggerElement : trigger,
                    duration : duration,
                    ...sceneOptions,
                })
                .setTween(TweenMax.to(target,true, tweenOptions))
                .addTo(controller)
            ;

            if(isTest){
                scene.addIndicators();
            };

            sceneList.push(scene);
        };

        return sceneList.length > 1 ? sceneList : sceneList[0];

    }
}
