import React , { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';


import gsap , {TweenMax as Tween , TimelineMax as Timeline} from 'gsap';
import ScrollMagic from 'scrollmagic';
import { ScrollMagicPluginGsap } from "scrollmagic-plugin-gsap";

ScrollMagicPluginGsap(ScrollMagic, Tween, Timeline ,gsap);


function App() {

  useEffect(() => {
    console.log('app');

    const controller = new ScrollMagic.Controller();

    const sc1 = new ScrollMagic.Scene({
      triggerElement : '.App-link',
      duration : 500,
    })
    .setTween('.ppp' , 1  ,{x : 500})
    .addTo(controller);

    const sc2 = new ScrollMagic.Scene({
      triggerElement : '#test',
      duration : 500,
    })
    .setTween('#test' , 1  ,{x : 500})
    .addTo(controller);


    window.sc1 = sc1;
    window.sc2 = sc2;

  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="ppp">
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div id="test"></div>
      </header>
    </div>
  );
}

export default App;
