import React, { createContext, useState, useReducer, useEffect, useMemo } from 'react';
import T from 'prop-types';
import { fetchInputLayers, inputLayersReducer } from './reducers/layers';
import { initialApiRequestState } from './contexeed';
import { useContext } from 'react';

const MapContext = createContext({});
export function MapProvider(props) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  //
  // Init map state
  const [map, setMap] = useState(null);
  const [mapLayers, setMapLayers] = useState([]);
  const [focusZone, setFocusZone] = useState(null);

  const [inputLayers, dispatchInputLayers] = useReducer(
    inputLayersReducer,
    initialApiRequestState
  );
  useEffect(() => {
    fetchInputLayers(dispatchInputLayers);
  }, []);

  return (
    <>
      <MapContext.Provider
        value={{
          hoveredFeature,
          setHoveredFeature,

          map,
          setMapLayers,
          setMap,
          mapLayers,
          inputLayers,

          focusZone,
          setFocusZone
        }}
      >
        {props.children}
      </MapContext.Provider>
    </>
  );
}

// Check if consumer function is used properly
export const useMapContext = (fnName) => {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <MapContextuseContext> component's context.`
    );
  }

  return context;
};

export const useMapLayers = () => {
  const { map, mapLayers, setMapLayers } = useMapContext('useMapLAyers');

  return useMemo(
    () => ({
      map,
      mapLayers,
      setMapLayers
    }),
    [map, mapLayers]
  );
};

MapProvider.propTypes = {
  children: T.node
};

export default MapContext;
