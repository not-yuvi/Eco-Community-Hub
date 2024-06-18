import React from 'react';
import './App.css';
import Home from './components/Home';
import Calculator from './components/Calculator';
import MapCalculator from './components/Map-Calculator';
import Tips from './components/Tips';
import AboutMe from './components/AboutMe';

function App() {
  return (
    <div className="App">
      <Home />
      <Calculator />
      <MapCalculator /> 
      <Tips />
      <AboutMe />
    </div>
  );
}

export default App;
