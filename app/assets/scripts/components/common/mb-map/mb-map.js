import React, { useEffect, useState, useRef, useContext } from 'react';
import T from 'prop-types';
import styled, { withTheme } from 'styled-components';
import mapboxgl from 'mapbox-gl';
import config from '../../../config';
import { glsp } from '../../../styles/utils/theme-values';
import { resizeMap } from './mb-map-utils';
import throttle from 'lodash.throttle';

import ExploreContext from '../../../context/explore-context';

const fitBoundsOptions = { padding: 20 };
mapboxgl.accessToken = config.mbToken;
localStorage.setItem('MapboxAccessToken', config.mbToken);

const FILTERED_LAYER_SOURCE = 'FILTERED_LAYER_SOURCE';
const FILTERED_LAYER_ID = 'FILTERED_LAYER_ID';
const ZONES_BOUNDARIES_SOURCE_ID = 'ZONES_BOUNDARIES_SOURCE_ID';
const ZONES_BOUNDARIES_LAYER_ID = 'ZONES_BOUNDARIES_LAYER_ID';

const MapsContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  /* Styles to accommodate the partner logos */
  .mapboxgl-ctrl-bottom-left {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    > .mapboxgl-ctrl {
      margin: 0 ${glsp(0.5)} 0 0;
    }
  }
  .partner-logos {
    display: flex;
    img {
      display: block;
      height: 3rem;
    }
    a {
      display: block;
    }
    > *:not(:last-child) {
      margin: 0 ${glsp(0.5)} 0 0;
    }
  }
`;

const SingleMapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const initializeMap = ({
  selectedArea,
  setMap,
  mapContainer,
  setHoveredFeatures
}) => {
  const map = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/light-v10',
    center: [0, 0],
    zoom: 5,
    bounds: selectedArea && selectedArea.bounds,
    fitBoundsOptions
  });

  map.on('load', () => {
    setMap(map);

    /**
     * Add placeholder map source and a hidden layer for the filtered layer,
     * which will be displayed on "Apply" click
     */
    map.addSource(FILTERED_LAYER_SOURCE, {
      type: 'raster',
      tiles: ['https://placeholder.url/{z}/{x}/{y}.png'],
      tileSize: 256
    });
    map.addLayer({
      id: FILTERED_LAYER_ID,
      type: 'raster',
      source: FILTERED_LAYER_SOURCE,
      layout: {
        visibility: 'none'
      },
      minzoom: 0,
      maxzoom: 22
    });

    // Zone boundaries source
    map.addSource(ZONES_BOUNDARIES_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // Zone boundaries source
    map.addLayer({
      id: ZONES_BOUNDARIES_LAYER_ID,
      type: 'fill',
      source: ZONES_BOUNDARIES_SOURCE_ID,
      layout: {},
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': [
          'case',
          ['boolean', ['get', 'hover'], false],
          0.5,
          0.2
        ]
      }
    });

    const highlighFeature = throttle(
      (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [ZONES_BOUNDARIES_LAYER_ID]
        });
        const nextHoveredFeatures = features.map((f) => f.properties.id);
        setHoveredFeatures(nextHoveredFeatures);
      },
      100,
      {
        leading: true
      }
    );
    map.on('mousemove', highlighFeature);

    map.resize();
  });
};

function MbMap (props) {
  const { triggerResize } = props;
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const {
    selectedArea,
    filteredLayerUrl,
    currentZones,
    hoveredFeatures,
    setHoveredFeatures
  } = useContext(ExploreContext);

  // Initialize map on mount
  useEffect(() => {
    if (!map) {
      initializeMap({ setMap, mapContainer, selectedArea, setHoveredFeatures });
      return;
    }

    if (selectedArea && selectedArea.bounds) {
      map.fitBounds(selectedArea.bounds, fitBoundsOptions);
    }
  }, [map]);

  // Watch window size changes
  useEffect(() => {
    if (map) {
      resizeMap(map);
    }
  }, [triggerResize]);

  // Update view port on area change
  useEffect(() => {
    // Map must be loaded
    if (!map) return;

    if (selectedArea && selectedArea.bounds) {
      map.fitBounds(selectedArea.bounds, fitBoundsOptions);
    }
  }, [selectedArea]);

  // If filtered layer source URL have changed, apply to the map
  useEffect(() => {
    if (!filteredLayerUrl) return;

    const style = map.getStyle();
    map.setStyle({
      ...style,
      sources: {
        ...style.sources,
        [FILTERED_LAYER_SOURCE]: {
          ...style.sources[FILTERED_LAYER_SOURCE],
          tiles: [filteredLayerUrl]
        }
      }
    });

    map.setLayoutProperty(FILTERED_LAYER_ID, 'visibility', 'visible');
  }, [filteredLayerUrl]);

  // Update zone boundaries on change
  useEffect(() => {
    if (!map || !currentZones) return;
    // Update GeoJSON source, applying hover effect if any
    map.getSource(ZONES_BOUNDARIES_SOURCE_ID).setData({
      type: 'FeatureCollection',
      features: currentZones
    });
  }, [currentZones]);

  useEffect(() => {
    const [hovered] = hoveredFeatures;
    if (!map) return;
    map.setPaintProperty(ZONES_BOUNDARIES_LAYER_ID, 'fill-opacity',
      [
        'case',
        ['==', ['get', 'id'], hovered || null],
        0.5,
        0.2
      ]);
  }, [hoveredFeatures]);

  return (
    <MapsContainer>
      <SingleMapContainer ref={mapContainer} />
    </MapsContainer>
  );
}
MbMap.propTypes = {
  triggerResize: T.bool
};

export default withTheme(MbMap);
