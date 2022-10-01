<template>
	<div id="app">
		<div class="cover">
			<VueDraggableResizable
        :active="true"
        :min-width="0"
				:w="w || 1"
        axis="x"
        :draggable="false"
        :resizable="true"
        :prevent-deactivation="true"
				:parent="true"
        @resizing="resizeRect"
			>
        <div class="vdr__wrap">
          <div class="plate plate--over" :class="{'-active' : pointIndex === 2}">
            <h2>RED</h2>
            <p>Red is the color at the long wavelength end of the visible spectrum of light, next to orange and opposite violet. It has a dominant wavelength of approximately 625–740 nanometres. It is a primary color in the RGB color model and a secondary color (made from magenta and yellow) in the CMYK color model, and is the complementary color of cyan. Reds range from the brilliant yellow-tinged scarlet and vermillion to bluish-red crimson, and vary in shade from the pale red pink to the dark red burgundy.</p>
          </div>
        </div>
			</VueDraggableResizable>

			<div class="plate plate--under" :class="{'-active' : pointIndex === 0}">
        <h2>BLUE</h2>
        <p>Blue is one of the three primary colours in the RYB colour model (traditional colour theory), as well as in the RGB (additive) colour model. It lies between violet and cyan on the spectrum of visible light. The eye perceives blue when observing light with a dominant wavelength between approximately 450 and 495 nanometres. Most blues contain a slight mixture of other colours; azure contains some green, while ultramarine contains some violet. The clear daytime sky and the deep sea appear blue because of an optical effect known as Rayleigh scattering. An optical effect called Tyndall effect explains blue eyes. Distant objects appear more blue because of another optical effect called aerial perspective.</p>
      </div>

		</div>
	</div>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
import gsap from "gsap";

export default {
	name: "App",
	components: {
		VueDraggableResizable,
	},
	data() {
    const wPercent = 50;
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
		return {
      wPercent,
      screen,
      points: [33,66],
		};
	},
  computed: {
    w: (_this) => (_this.screen.width/100) * _this.wPercent,
    pointIndex: (_this) => {
      const index = _this.points.findIndex((c) => _this.wPercent < c);
      return index > -1 ? index : _this.points.length;
    }
  },
	methods: {
		resizeWindow() {
      this.screen = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
		},
		resizeRect(x,y,width) {
      const wPercent = width/this.screen.width * 100;
      this.wPercent = wPercent;
		},
	},
	mounted() {
		window.addEventListener("resize", this.resizeWindow);
    gsap.fromTo(this, {wPercent: 0},{wPercent: 50, ease: "power3.inOut" , duration:2});
	},
	beforeDestroyed() {
		window.addEventListener("resize", this.resizeWindow);
	},
}
</script>

<style>
:root {
  --red: rgb(255, 82, 82);
  --blue: rgb(27, 104, 218);
}
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700;900&display=swap');
* {
	padding: 0;
	margin: 0;
}
html,
body {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	overflow: hidden;
  font-family: 'Roboto', sans-serif;
  line-height: 1.4;
  letter-spacing: normal;
}
#app {
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	display: inline-block;
	overflow: hidden;
}


.cover {
	width: 100%;
	height: 600px;
	position: relative;
  box-sizing: border-box;
}
.cover .vdr {
	width: auto; height: 100% !important;
	position: absolute;
	left: 0 !important;
	z-index: 2 !important;
  will-change: width;
}
.cover .vdr__wrap {
  width: 100%; height: 100%;
  overflow: hidden;
  display: inline-block;
  position: relative;
}
.plate {
  width: 100%; height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}
.cover .plate--over{
  width: 100vw;
  position: absolute;
}
.cover .plate--under {
  overflow: hidden;
	position: absolute;
	z-index: 1;
	width: 100%;
	height: 100%;
}
.handle.handle-mr {
  position: absolute;
  right: 0; top: 0;
  height: 100%;
  width: 50px;
  cursor: col-resize;
  transform: translateX(50%);
  backdrop-filter: blur(20px);
  background-color: rgba(255,255,255,0.2);
  border-right: 1px solid rgba(100,100,100,0.2);
  border-left: 1px solid rgba(100,100,100,0.2);
  box-sizing: border-box;
  z-index: 10;
}
.handle.handle-mr::before {
  content:"";
  display: inline-block;
  position: absolute;
  top: 0;
  left: 50%;
  right: 0;
  background-color: #333;
  width: 2px;
  height: 100%;
}

















.cover {
  border: 1px solid #000;
}
.plate {
  background-color: #fff;
}
.plate h2 {
  font-size: min(40vw, 300px);
  color: transparent;
  transition: color 200ms ease, letter-spacing 900ms cubic-bezier(0.33, 1, 0.68, 1);
  color: #fff;
  position: relative;
  z-index: 1;
}
.plate p {
  font-size: 16px;
  position: absolute;
  word-break: break-all;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  max-width: 500px;
  width: 60vw;
  z-index: 2;
  transform: translate3d(0,50px,0);
  opacity: 0;
  font-weight: 700;
  transition: transform 800ms cubic-bezier(0.33, 1, 0.68, 1), opacity 200ms cubic-bezier(0.33, 1, 0.68, 1);
  transition-delay: 300ms;
}
.plate.-active h2 {
  letter-spacing: 30px;
}
.plate.-active p {
  opacity: 1;
  transform: translate3d(0,0%,0);
}

.plate--over h2{
  -webkit-text-stroke: 1px var(--red);
}
/* .plate--over p{
  color: var(--red);
} */
.plate--over p {
  right: min(10vw,100px);
}
.plate--over::before{
  content: "";
  width: 100%; height: 100%;
  position: absolute;
  left: 0;
  bottom: -100%;
  display: inline-block;
  z-index: 1;
  background-color: var(--red);
  transform: translate3d(0,0,0);
  transition: transform 600ms cubic-bezier(0.645, 0.045, 0.355, 1);
}
.plate--over.-active::before{
  transform: translate3d(0,-100%,0);
}
.plate--under p {
  left: min(10vw,100px);
}
.plate--under h2{
  -webkit-text-stroke: 1px var(--blue);
}
.plate--under.-active h2{
  color: var(--blue)
}

</style>
