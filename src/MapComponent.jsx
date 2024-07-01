import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
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
  { id: "Research", name: "Research", file: "/Research.geojson", color: "#0FA3B1" },
  { id: "Commerce", name: "Commerce", file: "/Commerce.geojson", color: "#B5E2FA" },
  { id: "EventSites", name: "Event Sites", file: "/Event_Sites.geojson", color: "#EDDEA4" },
  { id: "HarvestingSites", name: "Harvesting Sites", file: "/Harvesting_Sites.geojson", color: "#F7A072" },
  { id: "HistoricalSites", name: "Historical Sites", file: "/Historical_Sites.geojson", color: "#1A535C" },
  { id: "Organizations", name: "Organizations", file: "/Organizations.geojson", color: "#A30015" },
];

const countyFile = "/Charleston_County_Boundary.geojson"; // Add your county boundary GeoJSON file here

const MapComponent = () => {
  const [layers, setLayers] = useState({});
  const [countyData, setCountyData] = useState(null);
  const [visibleLayers, setVisibleLayers] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    layerFiles.forEach(({ id, file }) => {
      fetch(file)
        .then(response => response.json())
        .then(data => {
          setLayers(prevLayers => ({ ...prevLayers, [id]: data }));
          setVisibleLayers(prevVisibleLayers => ({ ...prevVisibleLayers, [id]: true }));
        })
        .catch(error => console.error(`Error loading ${id} data:`, error));
    });

    fetch(countyFile)
      .then(response => response.json())
      .then(data => {
        setCountyData(data);
      })
      .catch(error => console.error(`Error loading county data:`, error));
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);

  const toggleLayerVisibility = (layerId) => {
    setVisibleLayers(prevVisibleLayers => ({
      ...prevVisibleLayers,
      [layerId]: !prevVisibleLayers[layerId]
    }));
  };

  const checkAllLayers = () => {
    const allLayersChecked = {};
    layerFiles.forEach(({ id }) => {
      allLayersChecked[id] = true;
    });
    setVisibleLayers(allLayersChecked);
  };

  const uncheckAllLayers = () => {
    const allLayersUnchecked = {};
    layerFiles.forEach(({ id }) => {
      allLayersUnchecked[id] = false;
    });
    setVisibleLayers(allLayersUnchecked);
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

  const countyStyle = {
    color: "blue",
    weight: 2,
    fillColor: "blue",
    fillOpacity: 0.2
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
          <div style={{ marginBottom: '10px' }}>
            <Button variant="success" onClick={checkAllLayers} style={{ marginRight: '10px' }}>
              Check All
            </Button>
            <Button variant="danger" onClick={uncheckAllLayers}>
              Uncheck All
            </Button>
          </div>
          {layerFiles.map(({ id, name, color }) => (
            <div key={id}>
              <input
                type="checkbox"
                id={`layer-${id}`}
                checked={visibleLayers[id]}
                onChange={() => toggleLayerVisibility(id)}
              />
              <label htmlFor={`layer-${id}`} style={{ color: color, marginLeft: '5px' }}>{name}</label>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>

      <MapContainer center={[33.8361, -81.1637]} zoom={7} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {countyData && (
          <GeoJSON
            data={countyData}
            style={countyStyle}
          />
        )}
        {layerFiles.map(({ id, color }) => (
          visibleLayers[id] && layers[id] ? (
            <GeoJSON
              key={id}
              data={layers[id]}
              pointToLayer={(feature, latlng) => createLabel(feature, latlng, color)}
            />
          ) : null
        ))}
      </MapContainer>
    </>
  );
};

export default MapComponent;
