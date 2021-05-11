import React, { useState, useEffect, useRef, useContext } from 'react';
import T from 'prop-types';
import styled, { withTheme } from 'styled-components';
import mapboxgl from 'mapbox-gl';
import config from '../../../config';
import { glsp } from '../../../styles/utils/theme-values';
import { resizeMap } from './mb-map-utils';
import MapPopover from '../mb-popover';
import { featureCollection } from '@turf/helpers';

import ExploreContext from '../../../context/explore-context';
import FormContext from '../../../context/form-context';
import MapContext from '../../../context/map-context';
import theme from '../../../styles/theme/theme';
import { rgba } from 'polished';
import { RESOURCES } from '../../explore/panel-data';
import MapLegend from './map-legend';
import { renderZoneDetailsList } from './../../explore/focus-zone';

const fitBoundsOptions = { padding: 20 };
mapboxgl.accessToken = config.mbToken;
localStorage.setItem('MapboxAccessToken', config.mbToken);

const FILTERED_LAYER_SOURCE = 'FILTERED_LAYER_SOURCE';
const FILTERED_LAYER_ID = 'FILTERED_LAYER_ID';

const LCOE_LAYER_SOURCE_ID = 'LCOE_LAYER_SOURCE_ID';
export const LCOE_LAYER_LAYER_ID = 'LCOE_LAYER_LAYER_ID';

const ZONE_SCORE_SOURCE_ID = 'ZONE_SCORE_SOURCE_ID';
const ZONE_SCORE_LAYER_ID = 'ZONE_SCORE_LAYER_ID';

const ZONES_BOUNDARIES_SOURCE_ID = 'ZONES_BOUNDARIES_SOURCE_ID';
export const ZONES_BOUNDARIES_LAYER_ID = 'ZONES_BOUNDARIES_LAYER_ID';
const EEZ_BOUNDARIES_SOURCE_ID = 'EEZ_BOUNDARIES_SOURCE_ID';
const EEZ_BOUNDARIES_LAYER_ID = 'EEZ_BOUNDARIES_LAYER_ID';
const SATELLITE = 'satellite';

export const outputLayers = [
  {
    id: SATELLITE,
    name: 'Satellite',
    type: 'raster',
    nonexclusive: true,
    visible: false,
    info: 'Satellite layer'
  },
  {
    id: FILTERED_LAYER_ID,
    name: 'Suitable Areas',
    type: 'raster',
    visible: true,
    category: 'output',
    info: 'Filtered suitable area',
    disabled: true
  },
  {
    id: LCOE_LAYER_LAYER_ID,
    name: 'LCOE Value (pixel)',
    type: 'raster',
    category: 'output',
    info: 'The LCOE value for every 500m pixel in the selected "Suitable Areas." Pixel LCOE values may be higher or lower than the aggregate LCOE value per zone, which averages all pixels in the defined zone area',
    disabled: true,
    units: 'USD/MWh'
  },
  {
    id: ZONE_SCORE_LAYER_ID,
    name: 'Zone Score (pixel)',
    type: 'raster',
    category: 'output',
    info: 'The zone score value for every 500m pixel in the selected "Suitable Areas." Pixel zone score values may be higher or lower than the aggregate zone score, which averages all pixels in the defined zone area',
    disabled: true,
    range: { min: 0, max: 1 }
  },
  {
    id: ZONES_BOUNDARIES_LAYER_ID,
    name: 'Zone Score',
    type: 'vector',
    category: 'output',
    info: 'The boundaries for the zones selected in "Zone Size and Type," with the aggregate score associated with each zones.',
    stops: [
      rgba(theme.main.color.base, 0),
      rgba(theme.main.color.base, 1)
    ],
    visible: true,
    disabled: true
  }
];
const getResourceLayerName = resource => {
  switch (resource) {
    case RESOURCES.SOLAR:
      return 'gsa-pvout';
    case RESOURCES.WIND:
    case RESOURCES.OFFSHORE:
      return 'gwa-speed-100';
  }
};

const layerDefaultVisibility = id => {
  return id === ZONES_BOUNDARIES_LAYER_ID || id === FILTERED_LAYER_ID;
};

const MapsContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  flex-flow: column;
  align-items: flex-end;
  padding-bottom: 2.125rem;
  /* Styles to accommodate the partner logos */
  .mapboxgl-ctrl-bottom-left {
    display: flex;
    align-items: start;
    flex-direction: column;
    justify-content: space-between;
    > .mapboxgl-ctrl {
      margin-bottom: ${glsp(0.5)};
    }
    /* > .mapboxgl-ctrl-scale:first-child {
      margin-bottom: -2px;
      border-top: none;
    }
    > .mapboxgl-ctrl-scale:nth-of-type(2) {
      border-bottom: none;
      border-top: 2px solid #333;
    } */
  }
  .mapboxgl-ctrl-top-right {
    margin-top: 2.625rem;
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
  setPopoverCoords,
  setFocusZone
}) => {
  const map = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/wbg-cdrp/ckhwwisf207qz1ap9hl2vlulj',
    center: [0, 0],
    zoom: 5,
    bounds: selectedArea && selectedArea.bounds,
    fitBoundsOptions,
    preserveDrawingBuffer: true // required for the map's canvas to be exported to a PNG
  });

  // Disable map rotation using right click + drag.
  map.dragRotate.disable();

  // Disable map rotation using touch rotation gesture.
  map.touchZoomRotate.disableRotation();

  // Add zoom controls
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  // Add scale
  map.addControl(new mapboxgl.ScaleControl({ maxWidth: 224, unit: 'metric' }), 'bottom-left');

  map.on('load', () => {
    // This map style has a 'background' layer underneath the satellite layer
    // which is completely black. Was not able to remove this via mapbox studio
    // so removing it on load. Removing before setMap ensures that the satellite map does not flash on load.
    map.removeLayer('background');
    map.setLayoutProperty('satellite', 'visibility', 'none');

    /*
     * Resize map on window size change
     */
    window.addEventListener('resize', resizeMap.bind(null, map));

    /**
     * Add placeholder map source and a hidden layer for the filtered layer,
     * which will be displayed on "Apply" click
     */

    map.setPaintProperty('land', 'background-opacity', 0.75);

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
        'raster-opacity': 0.75
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
        'raster-opacity': 0.75
      },
      minzoom: 0,
      maxzoom: 22
    });
    //
    map.addSource(ZONE_SCORE_SOURCE_ID, {
      type: 'raster',
      tiles: ['https://placeholder.url/{z}/{x}/{y}.png'],
      tileSize: 256
    });
    map.addLayer({
      id: ZONE_SCORE_LAYER_ID,
      type: 'raster',
      source: ZONE_SCORE_SOURCE_ID,
      layout: {
        visibility: 'none'
      },
      paint: {
        'raster-opacity': 0.75
      },
      minzoom: 0,
      maxzoom: 22
    });

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
        'fill-opacity': 0.75,
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
          0.75,
          0.25
        ]
      }
    });

    map.on('mousemove', ZONES_BOUNDARIES_LAYER_ID, (e) => {
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        setHoveredFeature(feature.id);
        setPopoverCoords({
          zoneFeature: feature,
          coords: [e.lngLat.lng, e.lngLat.lat]
        });
      } else {
        setPopoverCoords(null);
      }
    });

    map.on('mouseleave', ZONES_BOUNDARIES_LAYER_ID, () => {
      setPopoverCoords(null);
      setHoveredFeature(null);
    });

    // Set the focused zone to build the zone details panel
    // when map zone bound is clicked
    // This is cleared from the explore-zones component
    map.on('click', ZONES_BOUNDARIES_LAYER_ID, (e) => {
      if (e.features) {
        const ft = e.features[0];
        setFocusZone(ft);
      }
    });

    map.resize();

    setMap(map);
  });
};

const addInputLayersToMap = (map, layers, selectedArea, resource) => {
  // Off-shore mask flag
  const offshoreWindMask = resource === RESOURCES.OFFSHORE ? '&offshore=true' : '';

  // If area of country type, prepare path string to add to URL
  const countryPath = selectedArea.type === 'country' ? `/${selectedArea.id}` : '';

  layers.forEach((layer) => {
    const { id: layerId, tiles: layerTiles, symbol, type: layerType } = layer;
    const source = map.getSource(`${layerId}_source`);

    let tiles;
    if (layerTiles && !layerTiles.includes('/layers/')) {
      tiles = layerTiles;
    } else {
      tiles = `${config.apiEndpoint}/layers${countryPath}/${layerId}/{z}/{x}/{y}.png?colormap=viridis${offshoreWindMask}`;
    }

    /* If source exists, replace the tiles and return */
    if (source) {
      source.tiles = [tiles];
      if (layer.visible) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      } else {
        map.setLayoutProperty(layerId, 'visibility', 'none');
      }
      return;
    }

    /* existing tiles are vectors */
    if (layerType !== 'raster') {
      // Add source
      map.addSource(`${layerId}_source`, {
        type: 'vector',
        tiles: [tiles],
        tileSize: 512
      });

      if (symbol) {
        // Add a symbol layer with maki icon available in styles
        map.addLayer({
          id: layerId,
          type: 'symbol',
          source: `${layerId}_source`,
          'source-layer': layer.id,
          layout: {
            visibility: layer.visible ? 'visible' : 'none',
            'icon-image': symbol,
            'icon-size': 2
          },
          paint: {
            'icon-color': layer.color
          },
          minzoom: 0,
          maxzoom: 22
        });
      } else {
        // Add line layer
        map.addLayer({
          id: layerId,
          type: 'line',
          source: `${layerId}_source`,
          'source-layer': layer.id,
          layout: {
            visibility: layer.visible ? 'visible' : 'none'
          },
          paint: {
            'line-color': layer.color,
            'line-width': 1.5
          },
          minzoom: 0,
          maxzoom: 22
        });
      }
    } else {
      map.addSource(`${layerId}_source`, {
        type: 'raster',
        tiles: [tiles],
        tileSize: 256
      });

      map.addLayer({
        id: layerId,
        type: 'raster',
        source: `${layerId}_source`,
        layout: {
          visibility: layer.visible ? 'visible' : 'none'
        },
        paint: {
          'raster-opacity': 0.75
        },
        minzoom: 0,
        maxzoom: 22
      }, ZONES_BOUNDARIES_LAYER_ID);
    }
  });
};

function MbMap (props) {
  const { triggerResize } = props;
  const mapContainer = useRef(null);
  const [popoverCoods, setPopoverCoords] = useState(null);

  const {
    selectedArea,
    selectedResource,
    filteredLayerUrl,
    currentZones,
    outputLayerUrl,
    maxZoneScore,
    maxLCOE
  } = useContext(ExploreContext);

  const {
    hoveredFeature, setHoveredFeature,
    map, setMap,
    inputLayers,
    mapLayers,
    setMapLayers,
    setFocusZone
  } = useContext(MapContext);

  const { filtersLists, filterRanges } = useContext(FormContext);

  // Initialize map on mount
  useEffect(() => {
    if (!map) {
      initializeMap({ setMap, mapContainer, selectedArea, setPopoverCoords, setHoveredFeature, setFocusZone });
    }
  }, [map]);

  /*
   * Initialize map layers on receipt of input layers
  */
  useEffect(() => {
    if (map && inputLayers.isReady() && selectedArea) {
      const layers = inputLayers.getData();
      const initializedLayers = [
        ...layers.map(l => ({
          ...l,
          name: l.title,
          type: l.type,
          info: l.description,
          category: l.category || 'Uncategorized',
          visible: l.id === getResourceLayerName(selectedResource)
        }))
      ];
      addInputLayersToMap(map, initializedLayers, selectedArea, selectedResource);
      setMapLayers([...outputLayers, ...initializedLayers]);
    }
  }, [map, selectedArea, /* selectedResource, */ inputLayers]);

  /*
   * This function updates the visible resource layer when
  */
  useEffect(() => {
    if (map && inputLayers.isReady() && mapLayers.length) {
      const rLayerName = getResourceLayerName(selectedResource);

      /* If resouce is wind, we may need to update the
       * tiles url because
       * wind and offshore wind use the same layer,
       * but with a mask param for offshore
       */
      const offshoreWindMask = selectedResource === RESOURCES.OFFSHORE ? '&offshore=true' : '';

      const countryPath = selectedArea.type === 'country' ? `/${selectedArea.id}` : '';

      const tiles = `${config.apiEndpoint}/layers${countryPath}/${rLayerName}/{z}/{x}/{y}.png?colormap=viridis${offshoreWindMask}`;

      const sourceId = `${rLayerName}_source`;
      const source = map.getSource(sourceId);
      if (!source) {
        return;
      }
      source.tiles = [tiles];
      map.style.sourceCaches[sourceId].clearTiles();
      map.style.sourceCaches[sourceId].update(map.transform);
      map.triggerRepaint();

      setMapLayers(
        mapLayers.map(l => {
          if (l.id === rLayerName) {
            map.setLayoutProperty(l.id, 'visibility', 'visible');
            return { ...l, visible: true };
          } else {
            map.setLayoutProperty(l.id, 'visibility', 'none');
            return { ...l, visible: false };
          }
        })
      );
    }
  }, [map, selectedResource, selectedArea, mapLayers.length]);

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

    setMapLayers(mapLayers.map(layer => {
      if (layer.category === 'output') {
        layer.disabled = false;
        if (layer.visible) {
          map.setLayoutProperty(layer.id, 'visibility', 'visible');
          layer.visible = true;
        }
      }
      return layer;
    })
    );
  }, [filteredLayerUrl]);

  useEffect(() => {
    if (!outputLayerUrl || !map) return;

    const style = map.getStyle();

    map.setStyle({
      ...style,
      sources: {
        ...style.sources,
        [LCOE_LAYER_SOURCE_ID]: {
          ...style.sources[LCOE_LAYER_SOURCE_ID],
          tiles: [`${config.apiEndpoint}/lcoe/${outputLayerUrl}`]
        },
        [ZONE_SCORE_SOURCE_ID]: {
          ...style.sources[ZONE_SCORE_SOURCE_ID],
          tiles: [`${config.apiEndpoint}/score/${outputLayerUrl}`]
        }

      }
    });
  }, [outputLayerUrl]);

  // Update zone boundaries on change

  /*
   * Update visibility of layers on new zones
  */
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

    // Disable all layers besides zones boundaries
    setMapLayers(mapLayers.map(layer => {
      const visible = layerDefaultVisibility(layer.id);
      map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
      return {
        ...layer,
        visible
      };
    }));
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
      ['>=', ['get', 'zone_score'], maxZoneScore.input.value.min],
      ['<=', ['get', 'zone_score'], maxZoneScore.input.value.max],
      ...(maxLCOE.active ? [
        ['>=', ['get', 'lcoe'], maxLCOE.input.value.min],
        ['<=', ['get', 'lcoe'], maxLCOE.input.value.max]
      ] : [])
    ]
    );
  }, [maxZoneScore, maxLCOE, currentZones]);
  return (
    <MapsContainer>
      {
        selectedResource &&
        mapLayers &&
        filtersLists &&
        filterRanges &&
        mapLayers.some(({ visible, disabled, id }) =>
          (visible === true) &&
          (!disabled) &&
          (id !== 'satellite')
        ) && (
          <MapLegend
            selectedResource={selectedResource}
            filtersLists={filtersLists}
            mapLayers={mapLayers}
            filterRanges={filterRanges}
            currentZones={currentZones}
          />
        )
      }
      <SingleMapContainer ref={mapContainer} />
      {map && popoverCoods && (
        <MapPopover
          mbMap={map}
          lngLat={popoverCoods.coords}
          closeButton={false}
          offset={[15, 15]}
          content={
            <>
              {renderZoneDetailsList(popoverCoods.zoneFeature, [
                'lcoe',
                'zone_score'
              ])}
            </>
          }
          footerContent={
            <a>Click zone to view more details in the right panel.</a>
          }
        />
      )}
    </MapsContainer>
  );
}
MbMap.propTypes = {
  triggerResize: T.bool
};

export default withTheme(MbMap);
