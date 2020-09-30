import React, { createContext, useState } from 'react';
import T from 'prop-types';
const MapContext = createContext({});
export function MapProvider (props) {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  return (
    <>
      <MapContext.Provider
        value={
          {
            hoveredFeature,
            setHoveredFeature
          }
        }
      >
        {props.children}
      </MapContext.Provider>
    </>
  );
}

MapProvider.propTypes = {
  children: T.node
};

export default MapContext;
