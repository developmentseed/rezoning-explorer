import React, { createContext, useState, useReducer, useEffect } from 'react';
import T from 'prop-types';
import { fetchInputLayers, inputLayersReducer } from './reducers/layers';

import { useResource } from './explore-context';
import { initialApiRequestState } from './contexeed';

const MapContext = createContext({});
export function MapProvider (props) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Init map state
  const [map, setMap] = useState(null);
  const [mapLayers, setMapLayers] = useState([]);
  const [focusZone, setFocusZone] = useState(null);

  const [inputLayers, dispatchInputLayers] = useReducer(
    inputLayersReducer,
    initialApiRequestState
  );
  useEffect(() => {
    fetchInputLayers(dispatchInputLayers)
  }, []);

  return (
    <>
      <MapContext.Provider
        value={
          {
            hoveredFeature,
            setHoveredFeature,

            map,
            setMapLayers,
            setMap,
            mapLayers,
            inputLayers,

            focusZone,
            setFocusZone

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
