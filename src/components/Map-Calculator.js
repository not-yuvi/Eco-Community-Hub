/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapCalculator = () => {
    
    const [waypoints, setWaypoints] = useState([]);
    const [carbonResult, setCarbonResult] = useState(null);
    const [route, setRoute] = useState(null);

    // Then in your icon definition
    const icon = new L.Icon({
        iconUrl: markerIconPng,
        shadowUrl: markerShadowPng,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    // Then in your Marker component
    waypoints.map((wp, index) => (
        <Marker key={index} position={wp} icon={icon}>
            <Popup>Waypoint {index + 1}</Popup>
        </Marker>
    ));
    // Handle adding a waypoint on map click
    const handleMapClick = (e) => {
        if (waypoints.length < 2) {
            setWaypoints([...waypoints, e.latlng]);
        } else {
            const updatedWaypoints = [...waypoints];
            updatedWaypoints.shift(); // Remove the first waypoint
            updatedWaypoints.push(e.latlng); // Add the new waypoint
            setWaypoints(updatedWaypoints);
        }
    };

    const calculateEmissions = async (mode) => {
        if (waypoints.length !== 2) {
            alert('Please add exactly two waypoints to calculate emissions.');
            return;
        }
    
        const waypointsStr = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
        const routingUrl = `https://router.project-osrm.org/route/v1/driving/${waypointsStr}?overview=false`;
    
        try {
            const response = await fetch(routingUrl);
            const data = await response.json();
            console.log(data);
            if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                const routeData = data.routes[0];
                if (routeData.distance) {
                    const distance = routeData.distance / 1000; // distance in km
                    let carbonFootprint;
                    if (mode === 'car') {
                        carbonFootprint = distance * 0.12; // carbon emission factor for car travel in kg CO2 per km
                    } else if (mode === 'flight') {
                        carbonFootprint = distance * 0.257; // carbon emission factor for flights in kg CO2 per km
                    }

                    setCarbonResult(carbonFootprint.toFixed(2));

                    // Draw route on map
                    const routeCoordinates = data.waypoints.map(wp => wp.location.reverse());
                    setRoute(routeCoordinates);
                } else {
                    alert('Error: Route distance not found.');
                }
            } else {
                alert('Error: Unable to retrieve route data. Please try again.');
            }
        } catch (error) {
            console.error('Error calculating route:', error);
            alert('Failed to calculate route. Please try again later.');
        }
};

    // MapEventsHandler component to handle map click events
    function MapEventsHandler() {
        const map = useMapEvents({
            click: handleMapClick,
        });
        return null;
    }

    return (
        <div className="container">
            <h2>Map Calculator</h2>
            <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px' }}>
                <MapEventsHandler />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {waypoints.map((wp, index) => (
                    <Marker key={index} position={wp}>
                        <Popup>Waypoint {index + 1}</Popup>
                    </Marker>
                ))}
                {route && <Polyline positions={route} color="blue" />}
            </MapContainer>
            <br />
            <button onClick={() => calculateEmissions('car')}>Calculate Car Emissions</button>
            <button onClick={() => calculateEmissions('flight')}>Calculate Flight Emissions</button>
            {carbonResult && (
                <div id="result">
                    <h3>Emissions Result:</h3>
                    <p>{carbonResult} kg CO2 equivalent</p>
                </div>
            )}
        </div>
    );
}

export default MapCalculator;
