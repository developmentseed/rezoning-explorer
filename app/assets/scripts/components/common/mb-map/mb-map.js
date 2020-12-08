import React, { useEffect, useRef, useContext } from 'react';
import T from 'prop-types';
import styled, { withTheme } from 'styled-components';
import mapboxgl from 'mapbox-gl';
import config from '../../../config';
import { glsp } from '../../../styles/utils/theme-values';
import { resizeMap } from './mb-map-utils';
import { featureCollection } from '@turf/helpers';

import ExploreContext from '../../../context/explore-context';
import MapContext from '../../../context/map-context';
import theme from '../../../styles/theme/theme';
import { rgba } from 'polished';

const fitBoundsOptions = { padding: 20 };
mapboxgl.accessToken = config.mbToken;
localStorage.setItem('MapboxAccessToken', config.mbToken);

const FILTERED_LAYER_SOURCE = 'FILTERED_LAYER_SOURCE';
const FILTERED_LAYER_ID = 'FILTERED_LAYER_ID';

const LCOE_LAYER_SOURCE_ID = 'LCOE_LAYER_SOURCE_ID';
const LCOE_LAYER_LAYER_ID = 'LCOE_LAYER_LAYERE_ID';

const ZONES_BOUNDARIES_SOURCE_ID = 'ZONES_BOUNDARIES_SOURCE_ID';
export const ZONES_BOUNDARIES_LAYER_ID = 'ZONES_BOUNDARIES_LAYER_ID';
const EEZ_BOUNDARIES_SOURCE_ID = 'EEZ_BOUNDARIES_SOURCE_ID';
const EEZ_BOUNDARIES_LAYER_ID = 'EEZ_BOUNDARIES_LAYER_ID';

export const outputLayers = [
  {
    id: FILTERED_LAYER_ID,
    name: 'Selected Area',
    type: 'raster',
    visible: true
  },
  {
    id: LCOE_LAYER_LAYER_ID,
    name: 'LCOE Tiles',
    type: 'raster'
  },

  {
    id: ZONES_BOUNDARIES_LAYER_ID,
    name: 'Zone Boundaries',
    type: 'vector',
    stops: [
      rgba(theme.main.color.base, 0),
      rgba(theme.main.color.base, 1)
    ],
    visible: true
  }
];

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
  setHoveredFeature,
  setFocusZone
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

    /*
     * Resize map on window size change
     */
    window.addEventListener('resize', resizeMap.bind(null, map));

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
      paint: {
        'raster-opacity': 0.5
      },
      minzoom: 0,
      maxzoom: 22
    });

    map.addSource(LCOE_LAYER_SOURCE_ID, {
      type: 'raster',
      tiles: ['https://placeholder.url/{z}/{x}/{y}.png'],
      tileSize: 256
    });
    map.addLayer({
      id: LCOE_LAYER_LAYER_ID,
      type: 'raster',
      source: LCOE_LAYER_SOURCE_ID,
      layout: {
        visibility: 'none'
      },
      paint: {
        'raster-opacity': 0.5
      },
      minzoom: 0,
      maxzoom: 22
    });
    //

    map.addSource(EEZ_BOUNDARIES_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // Zone boundaries source
    map.addLayer({
      id: EEZ_BOUNDARIES_LAYER_ID,
      type: 'fill',
      source: EEZ_BOUNDARIES_SOURCE_ID,
      layout: {},
      paint: {
        'fill-color': '#efefef',
        'fill-opacity': 0.4,
        'fill-outline-color': '#232323'
      }
    });

    // Zone boundaries source
    map.addSource(ZONES_BOUNDARIES_SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      },
      promoteId: 'id'
    });

    // Zone boundaries layer
    map.addLayer({
      id: ZONES_BOUNDARIES_LAYER_ID,
      type: 'fill',
      source: ZONES_BOUNDARIES_SOURCE_ID,
      layout: {},
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.5,
          0.2
        ]
      }
    });

    map.on('mousemove', ZONES_BOUNDARIES_LAYER_ID, (e) => {
      if (e.features) {
        setHoveredFeature(e.features ? e.features[0].properties.id : null);
      }
    });

    // Set the focused zone to build the zone details panel
    // when map zone bound is clicked
    // This is cleared from the explore-zones component
    map.on('click', ZONES_BOUNDARIES_LAYER_ID, (e) => {
      if (e.features) {
        const ft = e.features[0];
        setFocusZone({
          ...ft,
          properties: {
            ...ft.properties,
            summary: JSON.parse(ft.properties.summary)
          }
        });
      }
    });

    map.resize();
  });
};

const addInputLayersToMap = (map, layers) => {
  layers.forEach(layer => {
    map.addSource(`${layer}_source`, {
      type: 'raster',
      tiles: [`${config.apiEndpoint}/layers/${layer}/{z}/{x}/{y}.png?colormap=cool`],
      tileSize: 256
    });
    map.addLayer({
      id: layer,
      type: 'raster',
      source: `${layer}_source`,
      layout: {
        visibility: 'none'
      },
      paint: {
        'raster-opacity': 0.5
      },
      minzoom: 0,
      maxzoom: 22
    }, ZONES_BOUNDARIES_LAYER_ID);
  });
};

function MbMap (props) {
  const { triggerResize } = props;
  const mapContainer = useRef(null);

  const {
    selectedArea,
    selectedResource,
    filteredLayerUrl,
    currentZones,
    lcoeLayerUrl,
    maxZoneScore
  } = useContext(ExploreContext);

  const {
    hoveredFeature, setHoveredFeature,
    map, setMap,
    inputLayers,
    setMapLayers,
    setFocusZone
  } = useContext(MapContext);

  // Initialize map on mount
  useEffect(() => {
    if (!map) {
      initializeMap({ setMap, mapContainer, selectedArea, setHoveredFeature, setFocusZone });
    }
  }, [map]);

  useEffect(() => {
    if (map && inputLayers.isReady()) {
      const layers = inputLayers.getData();

      setMapLayers([
        ...outputLayers,
        ...layers.map(l => ({
          id: l,
          name: l.split('-').map(w => `${w[0].toUpperCase()}${w.slice(1)}`).join(' '),
          type: 'raster'
        }))
      ]);
      addInputLayersToMap(map, layers);
    }
  }, [map, inputLayers]);

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
  }, [selectedArea, map]);

  useEffect(() => {
    // Map must be loaded
    if (!map) return;
    if (selectedArea && selectedArea.eez && selectedResource === 'Off-Shore Wind') {
      map.getSource(EEZ_BOUNDARIES_SOURCE_ID).setData(featureCollection(selectedArea.eez));
    } else {
      map.getSource(EEZ_BOUNDARIES_SOURCE_ID).setData(featureCollection([]));
    }
  }, [selectedArea, selectedResource, map]);

  // If filtered layer source URL have changed, apply to the map
  useEffect(() => {
    if (!filteredLayerUrl || !map) return;

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

  useEffect(() => {
    if (!lcoeLayerUrl || !map) return;

    const style = map.getStyle();

    map.setStyle({
      ...style,
      sources: {
        ...style.sources,
        [LCOE_LAYER_SOURCE_ID]: {
          ...style.sources[LCOE_LAYER_SOURCE_ID],
          tiles: [lcoeLayerUrl]
        }
      }
    });
  }, [lcoeLayerUrl]);

  // Update zone boundaries on change

  useEffect(() => {
    if (!map || !currentZones.isReady()) return;
    // Update GeoJSON source, applying hover effect if any
    map.getSource(ZONES_BOUNDARIES_SOURCE_ID).setData({
      type: 'FeatureCollection',
      features: currentZones.getData().map(z => ({
        ...z,
        properties: {
          ...z.properties,
          ...z.properties.summary
        }
      }))
    });
  }, [currentZones]);

  useEffect(() => {
    if (!map) return;

    map.setFeatureState({ source: ZONES_BOUNDARIES_SOURCE_ID, id: hoveredFeature || null }, { hover: true });

    return () => {
      map.setFeatureState({ source: ZONES_BOUNDARIES_SOURCE_ID, id: hoveredFeature || null }, { hover: false });
    };
  }, [hoveredFeature]);

  useEffect(() => {
    if (!map) return;

    // Update filter expression for boundaries layer
    map.setFilter(ZONES_BOUNDARIES_LAYER_ID, [
      'all',
      ['>=', ['get', 'zone_score'], maxZoneScore.min],
      ['<=', ['get', 'zone_score'], maxZoneScore.max]
    ]
    );
  }, [maxZoneScore, currentZones]);

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
