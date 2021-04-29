import React, { useState } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import get from 'lodash.get';

import { AccordionFoldTrigger } from '../../../components/accordion';
import { glsp } from '../../../styles/utils/theme-values';
import { themeVal } from '../../../styles/utils/general';
import { truncated } from '../../../styles/helpers/index';
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
  padding: ${glsp()} ${glsp(0.75)};
  margin: ${glsp(0.5)};
  display: grid;
  grid-template-rows: 1fr;
  grid-auto-rows: 0;
  overflow: hidden;
  grid-gap: 0.75rem;
  width: ${({ wide }) => (wide ? '26.5rem' : '14rem')};
  svg {
    display: block;
  }
  > *:not(:first-child) {
    display: none;
  }
  ${({ isExpanded }) =>
    isExpanded &&
    css`
      grid-auto-rows: max-content;
      /* stylelint-disable no-duplicate-selectors */
      > *:not(:first-child) {
        display: inherit;
      }
      /* stylelint-enable no-duplicate-selectors */
    `}
`;

const LegendTitle = styled.div`
  ${null}
`;

const LegendItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 1rem 1fr;
  grid-gap: 0.75rem;
  width: 100%;
  ${({ type }) =>
    type === 'linear' &&
    css`
      &:not(:only-of-type) {
        border-top: 1px solid ${themeVal('color.baseAlphaC')};
        padding-top: ${glsp(0.75)};
      }
      ${LegendTitle} {
        grid-column: span 2;
      }
    `}
  ${({ type }) =>
    type === 'multiselect' &&
    css`
      grid-template-columns: 1rem 1fr 1rem 1fr;
      grid-template-rows: 1.5rem;
      grid-auto-rows: 1rem;
      grid-gap: 0.5rem 0.75rem;
      /* stylelint-disable no-duplicate-selectors */
      ${LegendTitle} {
        ${truncated}
        text-transform: none;
        letter-spacing: 0;
        align-self: center;
      }
      /* stylelint-enable no-duplicate-selectors */
    `}
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

const LegendFoldTrigger = styled(AccordionFoldTrigger)`
  text-transform: uppercase;
  font-weight: ${themeVal('type.heading.weight')};
  &:after {
    transform: ${({ isExpanded }) =>
      isExpanded ? 'rotate(0)' : 'rotate(180deg)'};
  }
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

  const label = visibleRaster[0].title || visibleRaster[0].name;

  const rasterRange = filterRanges.getData()[visibleRaster[0].id] || visibleRaster[0].range;
  const rasterFilter = filtersLists.find(
    (l) => l.layer === visibleRaster[0].id
  );
  const unit =
    rasterFilter && rasterFilter.unit
      ? ` (${rasterFilter.unit})`
      : visibleRaster[0].units
        ? ` (${visibleRaster[0].units})`
        : '';

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

  const landCoverColor = [
    [0, 0, 0],
    [255, 255, 100],
    [170, 240, 240],
    [220, 240, 100],
    [200, 200, 100],
    [0, 100, 0],
    [0, 160, 0],
    [0, 60, 0],
    [40, 80, 0],
    [120, 130, 0],
    [140, 160, 0],
    [190, 150, 0],
    [150, 100, 0],
    [255, 180, 50],
    [255, 220, 210],
    [255, 235, 175],
    [0, 120, 90],
    [0, 150, 120],
    [0, 220, 130],
    [195, 20, 0],
    [255, 245, 215],
    [0, 70, 200],
    [255, 255, 255]
  ];

  // Show different legend if filter type is boolean
  if (get(rasterFilter, 'input.type') === 'boolean') {
    return (
      <LegendItemWrapper>
        <LegendItem>
          <svg width={16} height={16}>
            <rect fill={scale(1)} width={16} height={16} />
          </svg>
        </LegendItem>
        <LegendTitle>{label}</LegendTitle>
      </LegendItemWrapper>
    );
  } else if (visibleRaster[0].id === 'land-cover') {
    return (
      <LegendItemWrapper type='multiselect'>
        <LegendTitle
          style={{
            gridColumn: 'span 4'
          }}
        >
          Land Cover
        </LegendTitle>
        {rasterFilter.options.map((option, i) => (
          <>
            <LegendItem key={option} title={option}>
              <svg width={16} height={16}>
                <rect
                  fill={`rgb(${landCoverColor[i]})`}
                  width={16}
                  height={16}
                />
              </svg>
            </LegendItem>
            <LegendTitle title={option}>{option}</LegendTitle>
          </>
        ))}
      </LegendItemWrapper>
    );
  } else {
    return (
      <LegendItemWrapper type='linear'>
        <LegendTitle>
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
        {rasterRange && (
          <>
            <InputLabel>{rasterRange.min.toFixed(1) || 0}</InputLabel>
            <InputLabel align='right'>
              {rasterRange.max.toFixed(1) || 1}
            </InputLabel>
          </>
        )}
      </LegendItemWrapper>
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
      <LegendItemWrapper>
        <LegendItem>
          <svg width={16} height={16}>
            <rect fill='#ff00a0' width={16} height={16} />
          </svg>
        </LegendItem>
        <LegendTitle type='boolean'>Suitable Areas</LegendTitle>
      </LegendItemWrapper>
    );
  }
}

FilteredAreaLegendItem.propTypes = {
  mapLayers: T.array
};

function ZoneScoreLegendItem({ mapLayers, wide }) {
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
    <LegendItemWrapper type='linear'>
      <LegendTitle>Zone Score</LegendTitle>
      <LegendLinear scale={scale} steps={10}>
        {(labels) => (
          <LegendLabelsStyled>
            {labels.map((label, i) => (
              <LegendItem key={`legend-linear-${label.datum}`}>
                <svg width={wide ? 40 : 20} height={10}>
                  <rect fill={label.value} width={wide ? 40 : 20} height={10} />
                </svg>
              </LegendItem>
            ))}
          </LegendLabelsStyled>
        )}
      </LegendLinear>
      <InputLabel>0</InputLabel>
      <InputLabel align='right'>1</InputLabel>
    </LegendItemWrapper>
  );
}

ZoneScoreLegendItem.propTypes = {
  mapLayers: T.array,
  wide: T.bool
};

export default function MapLegend({
  selectedResource,
  mapLayers,
  filtersLists,
  filterRanges
}) {
  const [showMapLegend, setShowMapLegend] = useState(true);
  const landCoverVisible =
    mapLayers.filter(({ id, visible }) => id === 'land-cover' && visible)
      .length > 0;
  return (
    <MapLegendSelf wide={landCoverVisible} isExpanded={showMapLegend}>
      <LegendFoldTrigger
        onClick={() => setShowMapLegend(!showMapLegend)}
        isExpanded={showMapLegend}
      >
        Legend
      </LegendFoldTrigger>
      {mapLayers
        .filter(({ type, visible }) => type === 'symbol' && visible)
        .map(({ id, symbol, name }) => (
          <LegendItemWrapper key={id}>
            <LegendItem>
              <MakiIcon id={symbol} />
            </LegendItem>
            <LegendTitle>{name}</LegendTitle>
          </LegendItemWrapper>
        ))}
      {mapLayers
        .filter(({ type, visible }) => type === 'line' && visible)
        .map(({ id, name, color }) => (
          <LegendItemWrapper key={id}>
            <LegendItem>
              <svg width={16} height={16}>
                <rect fill={color} width={16} height={16} />
              </svg>
            </LegendItem>
            <LegendTitle>{name}</LegendTitle>
          </LegendItemWrapper>
        ))}
      {selectedResource === 'Off-Shore Wind' && (
        <LegendItemWrapper>
          <LegendItem>
            <svg width={16} height={16}>
              <rect fill='#d5d5d5' stroke='#333333' width={16} height={16} />
            </svg>
          </LegendItem>
          <LegendTitle type='boolean'>Exclusive Economic Zone</LegendTitle>
        </LegendItemWrapper>
      )}
      <FilteredAreaLegendItem mapLayers={mapLayers} />
      <RasterLegendItem
        mapLayers={mapLayers}
        filterRanges={filterRanges}
        filtersLists={filtersLists}
      />
      <ZoneScoreLegendItem mapLayers={mapLayers} wide={landCoverVisible} />
    </MapLegendSelf>
  );
}

MapLegend.propTypes = {
  selectedResource: T.string.isRequired,
  mapLayers: T.array.isRequired,
  filtersLists: T.array.isRequired,
  filterRanges: T.array.isRequired
};
