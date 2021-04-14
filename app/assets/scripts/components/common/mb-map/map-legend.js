import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { glsp } from '../../../styles/utils/theme-values';
import { cardSkin } from '../../../styles/skins';

import { LegendLinear, LegendItem } from '@visx/legend';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import colormap from 'colormap';

const MapLegendSelf = styled.div`
  ${cardSkin}
  z-index: 10;
  font-size: 0.875rem;
  padding: ${glsp(0.75)};
  margin: ${glsp(0.5)};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${glsp(0.25)};
  svg {
    display: block;
  }
`;

const LegendTitle = styled.div`
  grid-column: span 2;
  text-align: center;
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

export default function MapLegend (props) {
  // Default legend scale uses colormap with "viridis." Logic allows for custom colormaps passed to legends, and for custom ordinal color scales
  let scale;
  if (props.scale.colorArray) {
    scale = scaleOrdinal({
      domain: Array(props.scale.domain).fill(0).map((a, i) => i / props.scale.domain),
      range: props.scale.colorArray
    });
  } else {
    scale = scaleLinear({
      domain: Array(props.scale.domain).fill(0).map((a, i) => i / props.scale.domain),
      range: colormap({ colormap: props.scale.colorMap, nshades: props.scale.domain })
    });
  }

  const min = props.min !== undefined ? props.min.toFixed(1) : '';
  const max = props.max !== undefined ? props.max.toFixed(1) : '';

  const { units } = props;

  return (
    <MapLegendSelf>
      <LegendLinear
        scale={scale}
        steps={props.scale.domain}
      >
        {labels => (
          <LegendLabelsStyled>
            {labels.map((label, i) => (
              <LegendItem key={`legend-linear-${label.datum}`}>
                <svg width={props.width || 4} height={10}>
                  <rect fill={label.value} stroke={props.scale.colorArray && 'black'} width={props.width || 4} height={10} />
                </svg>
              </LegendItem>
            ))}
          </LegendLabelsStyled>
        )}
      </LegendLinear>
      <InputLabel>{min}</InputLabel>
      <InputLabel align='right'>{max}</InputLabel>
      <LegendTitle>{props.description}{units ? ` (${units})` : ''}</LegendTitle>
    </MapLegendSelf>
  );
}

MapLegend.propTypes = {
  description: T.string,
  min: T.number,
  max: T.number,
  width: T.oneOfType([T.string, T.number]),
  scale: T.shape({
    domain: T.number,
    colorMap: T.string,
    colorArray: T.array
  }),
  units: T.string
};

MapLegend.defaultProps = {
  scale: {
    domain: 50,
    colorMap: 'viridis',
    colorArray: null
  }
};
