import React, { useState } from 'react';

const Calculator = () => {
    const [travelType, setTravelType] = useState('car');
    const [miles, setMiles] = useState('');
    const [carbonResult, setCarbonResult] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        calculateCarbonFootprint(travelType, miles);
    }

    const calculateCarbonFootprint = (travelType, miles) => {
        let carbonFootprint = 0;

        switch (travelType) {
            case 'car':
                carbonFootprint = miles * 0.404; // Carbon emission factor for car travel in kg CO2 per mile
                break;
            case 'flight':
                carbonFootprint = miles * 0.257; // Carbon emission factor for flights in kg CO2 per mile
                break;
            default:
                carbonFootprint = 0;
        }

        setCarbonResult(carbonFootprint.toFixed(2));
  };

  return (
    <div className="container">
      <h2>Carbon Footprint Calculator</h2>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="travelType">Travel Type:</label>
        <select id="travelType" name="travelType" value={travelType} onChange={(e) => setTravelType(e.target.value)}>
          <option value="car">Car Travel (miles)</option>
          <option value="flight">Flight (miles)</option>
          {/* Add more options for different travel types */}
        </select>
        <br /><br />
        <label htmlFor="miles">Miles:</label>
        <input type="number" id="miles" name="miles" value={miles} onChange={(e) => setMiles(e.target.value)} required />
        <br /><br />
        <button type="submit">Calculate Carbon Footprint</button>
      </form>
      {carbonResult && (
        <div id="result">
          <h3>Carbon Footprint Result:</h3>
          <p>{carbonResult} kg CO2 equivalent</p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
