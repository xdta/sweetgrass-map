import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ layers, toggleLayer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sidebar-container">
      <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close' : 'Open'} Layers
      </button>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-content">
          <h2>Layers</h2>
          <ul>
            {layers.map((layer, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => toggleLayer(layer.name)}
                />
                <span style={{ color: layer.color }}>{layer.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
