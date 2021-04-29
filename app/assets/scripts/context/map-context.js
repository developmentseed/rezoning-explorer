import React, {
  createContext,
  useState,
  useReducer,
  useEffect,
  useMemo,
  useContext
} from 'react';
import T from 'prop-types';
import { fetchInputLayers, inputLayersReducer } from './reducers/layers';
import { initialApiRequestState } from './contexeed';

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

export const useMap = () => {
  const { map, setMap } = useMapContext('useMap');

  return useMemo(
    () => ({
      map,
      setMap
    }),
    [map, setMap]
  );
};

export const useMapLayers = () => {
  const { mapLayers, setMapLayers } = useMapContext('useMapLayers');

  return useMemo(
    () => ({
      mapLayers,
      setMapLayers
    }),
    [mapLayers]
  );
};

export const useInputLayers = () => {
  const { inputLayers } = useMapContext('useInputLayers');

  return useMemo(
    () => ({
      inputLayers
    }),
    [inputLayers]
  );
};

export const useHoveredFeature = () => {
  const { hoveredFeature, setHoveredFeature } = useMapContext(
    'useHoveredFeature'
  );

  return useMemo(
    () => ({
      hoveredFeature,
      setHoveredFeature
    }),
    [hoveredFeature]
  );
};

export const useFocusZone = () => {
  const { focusZone, setFocusZone } = useMapContext('useFocusZone');

  return useMemo(
    () => ({
      focusZone,
      setFocusZone
    }),
    [focusZone]
  );
};

MapProvider.propTypes = {
  children: T.node
};
