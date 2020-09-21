import React , { usaState , useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';


function App() {
    const [ apiResponse , setApiResponse ] = useState("1");

    const callAPI = () => {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => {
                setApiResponse(res)
            })
            .catch(error => console.log(error))
    };

    useEffect(() => {
        callAPI()
    }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
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
        <p className="App-intro">{ apiResponse }</p>
      </header>
    </div>
  );

}

export default App;
