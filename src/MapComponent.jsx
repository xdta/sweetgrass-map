import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MapComponent.css';
import { Button, Offcanvas } from 'react-bootstrap';
import L from 'leaflet';

// Fix Leaflet's default icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const layerFiles = [
  { name: "Research", file: "/Research.geojson", color: "blue" },
  { name: "Commerce", file: "/Commerce.geojson", color: "red" },
  { name: "Event Sites", file: "/Event_Sites.geojson", color: "green" },
  { name: "Harvesting Sites", file: "/Harvesting_Sites.geojson", color: "purple" },
  { name: "Historical Sites", file: "/Historical_Sites.geojson", color: "orange" },
  { name: "Organizations", file: "/Organizations.geojson", color: "yellow" },
];

const MapComponent = () => {
  const [layers, setLayers] = useState({});
  const [visibleLayers, setVisibleLayers] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    layerFiles.forEach(({ name, file }) => {
      fetch(file)
        .then(response => response.json())
        .then(data => {
          setLayers(prevLayers => ({ ...prevLayers, [name]: data }));
          setVisibleLayers(prevVisibleLayers => ({ ...prevVisibleLayers, [name]: true }));
        })
        .catch(error => console.error(`Error loading ${name} data:`, error));
    });
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  const toggleLayerVisibility = (layerName) => {
    setVisibleLayers(prevVisibleLayers => ({
      ...prevVisibleLayers,
      [layerName]: !prevVisibleLayers[layerName]
    }));
  };

  const createMarkerIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker-icon',
      html: `<div style="background-color:${color}; width:10px; height:10px; border-radius:50%;"></div>`
    });
  };

  const createLabel = (feature, latlng, color) => {
    const { Name, URL } = feature.properties;
    return L.marker(latlng, {
      icon: L.divIcon({
        className: 'custom-label-icon',
        html: `<div style="text-align: center;">
                 <div style="background-color:${color}; width:10px; height:10px; border-radius:50%; margin: auto;"></div>
                 <a href="${URL}" target="_blank" style="text-decoration: none; color: black;">${Name}</a>
               </div>`,
        iconSize: [100, 40], // Adjust size if necessary
        iconAnchor: [50, 40] // Adjust anchor point if necessary
      })
    });
  };

  return (
    <>
      <Button variant="primary" onClick={toggleMenu} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        Toggle Menu
      </Button>

      <Offcanvas show={showMenu} onHide={toggleMenu} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Layers</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {layerFiles.map(({ name }) => (
            <div key={name}>
              <input
                type="checkbox"
                id={`layer-${name}`}
                checked={visibleLayers[name]}
                onChange={() => toggleLayerVisibility(name)}
              />
              <label htmlFor={`layer-${name}`}>{name}</label>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>

      <MapContainer center={[33.8361, -81.1637]} zoom={7} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {layerFiles.map(({ name, color }) => (
          visibleLayers[name] && layers[name] ? (
            <GeoJSON
              key={name}
              data={layers[name]}
              pointToLayer={(feature, latlng) => createLabel(feature, latlng, color)}
            />
          ) : null
        ))}
      </MapContainer>
    </>
  );
};

export default MapComponent;



// // import React from 'react';
// // import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import commerceData from './data/Commerce.geojson';
// // import eventSitesData from './data/Event_Sites.geojson';
// // import harvestingSitesData from './data/Harvesting_Sites.geojson';
// // import historicalSitesData from './data/Historical_Sites.geojson';
// // import organizationsData from './data/Organizations.geojson';
// // import researchData from './data/Research.geojson';

// // function App() {
// //   return (
// //     <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
// //       <TileLayer
// //         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //         attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// //       />
// //       <GeoJSON data={commerceData} />
// //       <GeoJSON data={eventSitesData} />
// //       <GeoJSON data={harvestingSitesData} />
// //       <GeoJSON data={historicalSitesData} />
// //       <GeoJSON data={organizationsData} />
// //       <GeoJSON data={researchData} />
// //     </MapContainer>
// //   );
// // }

// // export default App;




// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix Leaflet's default icon issue in React
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
// });

// const MapComponent = () => {
//   const [geojsonData, setGeojsonData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch('/Historical_Sites.geojson')
//       .then(response => {
//         console.log('Fetching GeoJSON file', response);
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         console.log('GeoJSON Data:', data);
//         setGeojsonData(data);
//       })
//       .catch(error => {
//         console.error('Error loading GeoJSON data:', error);
//         setError(error.message);
//       });
//   }, []);

//   if (error) {
//     return <div>Error loading GeoJSON data: {error}</div>;
//   }

//   if (!geojsonData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <MapContainer center={[33.8361, -81.1637]} zoom={7} style={{ height: '100vh', width: '100%' }}>
//       <TileLayer
//         url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png"
//         attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
//       />
//       {geojsonData.features.map((feature, index) => {
//         const { coordinates } = feature.geometry;
//         const { Name } = feature.properties;

//         return (
//           <Marker key={index} position={[coordinates[1], coordinates[0]]}>
//             <Popup>
//               {Name}
//             </Popup>
//           </Marker>
//         );
//       })}
//     </MapContainer>
//   );
// };

// export default MapComponent;
