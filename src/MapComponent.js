import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/Historical_Sites.geojson')
      .then(response => {
        console.log('Fetching GeoJSON file', response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('GeoJSON Data:', data);
        setGeojsonData(data);
      })
      .catch(error => {
        console.error('Error loading GeoJSON data:', error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error loading GeoJSON data: {error}</div>;
  }

  if (!geojsonData) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer center={[33.8361, -81.1637]} zoom={7} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
      />
      {geojsonData.features.map((feature, index) => {
        const { coordinates } = feature.geometry;
        const { Name } = feature.properties;

        return (
          <Marker key={index} position={[coordinates[1], coordinates[0]]}>
            <Popup>
              {Name}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
