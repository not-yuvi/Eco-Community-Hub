import React, { useState } from 'react';

const Calculator = () => {
    const [travelType, setTravelType] = useState('car');
    const [miles, setMiles] = useState('');
    const [carbonResult, setCarbonResult] = useState('');
    const [harmLevel, setHarmLevel] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        calculateCarbonFootprint(travelType, miles);
    }

    const calculateCarbonFootprint = (travelType, miles) => {
        let carbonFootprint = 0;

        switch (travelType) {
            case 'car':
                carbonFootprint = miles * 0.404;
                break;
            case 'flight':
                carbonFootprint = miles * 0.257;
                break;
            case 'bus':
                carbonFootprint = miles * 0.089;
                break;
            case 'train':
                carbonFootprint = miles * 0.049;
                break;
            default:
                carbonFootprint = 0;
        }

        setCarbonResult(carbonFootprint.toFixed(2));
        calculateHarm(carbonFootprint); // Calculate harm based on carbon footprint
    };

    const calculateHarm = (carbonFootprint) => {
        const thresholds = {
            low: 1000,
            moderate: 5000,
            high: 10000
        };

        const carbonEmission = parseFloat(carbonFootprint);
        if (carbonEmission < thresholds.low) {
            setHarmLevel("Low harm: Minimal impact on the environment and health.");
        } else if (carbonEmission < thresholds.moderate) {
            setHarmLevel("Moderate harm: Significant environmental impact and potential health risks.");
        } else if (carbonEmission < thresholds.high) {
            setHarmLevel("High harm: Severe environmental damage and health hazards.");
        } else {
            setHarmLevel("Very high harm: Critical environmental degradation and severe health consequences.");
        }
    };

    return (
        <div className="container">
            <h2>Carbon Footprint Calculator</h2>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="travelType">Travel Type:</label>
                <select id="travelType" name="travelType" value={travelType} onChange={(e) => setTravelType(e.target.value)}>
                    <option value="car">Car Travel (miles)</option>
                    <option value="flight">Flight (miles)</option>
                    <option value="bus">Bus Travel (miles)</option>
                    <option value="train">Train Travel (miles)</option>
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
            {harmLevel && (
                <div id="harm">
                    <h3>Harm Level:</h3>
                    <p>{harmLevel}</p>
                </div>
            )}
        </div>
    );
};

export default Calculator;
