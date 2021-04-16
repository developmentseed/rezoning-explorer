import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import get from 'lodash.get';

import { glsp } from '../../../styles/utils/theme-values';
import { themeVal } from '../../../styles/utils/general';
import { cardSkin } from '../../../styles/skins';
import { COLOR_SCALE } from '../../../styles/zoneScoreColors';
import { ZONES_BOUNDARIES_LAYER_ID } from '../mb-map/mb-map';

import { LegendLinear, LegendItem } from '@visx/legend';
import { scaleLinear } from '@visx/scale';
import colormap from 'colormap';
import MakiIcon from '../maki-icon';

const MapLegendSelf = styled.div`
  ${cardSkin}
  z-index: 10;
  font-size: 0.875rem;
  padding: ${glsp(0.75)};
  margin: ${glsp(0.5)};
  display: grid;
  grid-template-columns: 1rem 1fr;
  grid-gap: 0.75rem;
  width: 14rem;
  svg {
    display: block;
  }
`;

const LegendTitle = styled.div`
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: .5px;
  ${({ type }) => type === 'linear' && css`
    grid-column: span 2;
    border-top: 1px solid ${themeVal('color.baseAlphaC')};
    padding-top: ${glsp(0.75)};
  `};
`;

const LegendLabels = styled.div`
  display: flex;
  flex-direction: row;
`;

const LegendLabelsStyled = styled(LegendLabels)`
  grid-column: span 2;
`;

const InputLabel = styled.span`
  text-align: ${({ align }) => align || 'left'};
  grid-column: ${({ gridColumn }) => gridColumn || 'auto'};
  font-size: 0.75rem;
`;

function RasterLegendItem({ mapLayers, filterRanges, filtersLists }) {
  const visibleRaster = mapLayers.filter(
    (layer) =>
      layer.type === 'raster' &&
      layer.visible &&
      layer.id !== 'FILTERED_LAYER_ID' &&
      layer.id !== 'satellite'
  );

  if (visibleRaster.length === 0) return null;

  const label = visibleRaster[0].title;

  const rasterRange = filterRanges.getData()[visibleRaster[0].id];
  const rasterFilter = filtersLists.find(
    (l) => l.layer === visibleRaster[0].id
  );
  const unit =
    rasterFilter && rasterFilter.unit ? ` (${rasterFilter.unit})` : '';

  // Default legend scale uses colormap with "viridis." Logic allows for custom colormaps passed to legends,
  // and for custom ordinal color scales
  const domain = 50;
  const colorArray = null;

  const scale = scaleLinear({
    domain: Array(domain)
      .fill(0)
      .map((a, i) => i / domain),
    range: colormap({
      colormap: 'viridis',
      nshades: domain
    })
  });

  // Show different legend if filter type is boolean
  if (get(rasterFilter, 'input.type') === 'boolean') {
    return (
      <>
        <LegendItem>
          <svg width={16} height={16}>
            <rect fill={scale(1)} width={16} height={16} />
          </svg>
        </LegendItem>
        <LegendTitle type='boolean'>{label}</LegendTitle>
      </>
    );
  } else {
    return (
      <>
        <LegendTitle type='linear'>
          {label}
          {unit}
        </LegendTitle>
        <LegendLinear scale={scale} steps={domain}>
          {(labels) => (
            <LegendLabelsStyled>
              {labels.map((label, i) => (
                <LegendItem key={`legend-linear-${label.datum}`}>
                  <svg width={4} height={10}>
                    <rect
                      fill={label.value}
                      stroke={colorArray && 'black'}
                      width={4}
                      height={10}
                    />
                  </svg>
                </LegendItem>
              ))}
            </LegendLabelsStyled>
          )}
        </LegendLinear>
        <InputLabel>{rasterRange.min.toFixed(1) || 0}</InputLabel>
        <InputLabel align='right'>{rasterRange.max.toFixed(1)}</InputLabel>
      </>
    );
  }
}

RasterLegendItem.propTypes = {
  mapLayers: T.array,
  filterRanges: T.array,
  filtersLists: T.array
};

function FilteredAreaLegendItem({ mapLayers }) {
  const filteredAreasVisible = mapLayers.filter(
    (layer) =>
      layer.id === 'FILTERED_LAYER_ID' &&
      layer.disabled === false &&
      layer.visible === true
  );
  if (filteredAreasVisible.length === 0) return null;
  else {
  return (
    <>
      <LegendItem>
        <svg width={16} height={16}>
          <rect fill='#ff00a0' width={16} height={16} />
        </svg>
      </LegendItem>
      <LegendTitle type='boolean'>Suitable Areas</LegendTitle>
    </>
  );
}

FilteredAreaLegendItem.propTypes = {
  mapLayers: T.array
};

function ZoneScoreLegendItem({ mapLayers }) {
  const zoneScoreVisible = mapLayers.filter(
    (layer) =>
      layer.id === ZONES_BOUNDARIES_LAYER_ID &&
      layer.disabled === false &&
      layer.visible === true
  );
  const scale = scaleLinear({
    domain: Array(10)
      .fill(0)
      .map((a, i) => i / 2),
    range: COLOR_SCALE
  });
  if (zoneScoreVisible.length === 0) return null;
  return (
    <>
      <LegendTitle type='linear'>Zone Score</LegendTitle>
      <LegendLinear scale={scale} steps={10}>
        {(labels) => (
          <LegendLabelsStyled>
            {labels.map((label, i) => (
              <LegendItem key={`legend-linear-${label.datum}`}>
                <svg width={20} height={10}>
                  <rect
                    fill={label.value}
                    width={20}
                    height={10}
                  />
                </svg>
              </LegendItem>
            ))}
          </LegendLabelsStyled>
        )}
      </LegendLinear>
      <InputLabel>0</InputLabel>
      <InputLabel align='right'>1</InputLabel>
    </>
  );
}

ZoneScoreLegendItem.propTypes = {
  mapLayers: T.array
};

export default function MapLegend({
  selectedResource,
  mapLayers,
  filtersLists,
  filterRanges
}) {
  return (
    <MapLegendSelf>
      {mapLayers
        .filter(({ type, visible }) => type === 'symbol' && visible)
        .map(({ id, symbol, name }) => (
          <>
            <LegendItem>
              <MakiIcon key={id} id={symbol} />
            </LegendItem>
            <LegendTitle>{name}</LegendTitle>
          </>
        ))}
      {selectedResource === 'Off-Shore Wind' && (
        <>
          <LegendItem>
            <svg width={16} height={16}>
              <rect fill='#d5d5d5' stroke='#333333' width={16} height={16} />
            </svg>
          </LegendItem>
          <LegendTitle type='boolean'>Exclusive Economic Zone</LegendTitle>
        </>
      )}
      <FilteredAreaLegendItem
        mapLayers={mapLayers}
      />
      <RasterLegendItem
        mapLayers={mapLayers}
        filterRanges={filterRanges}
        filtersLists={filtersLists}
      />
      <ZoneScoreLegendItem
        mapLayers={mapLayers}
      />
    </MapLegendSelf>
  );
}

MapLegend.propTypes = {
  selectedResource: T.string.isRequired,
  mapLayers: T.array.isRequired,
  filtersLists: T.array.isRequired,
  filterRanges: T.array.isRequired
};
