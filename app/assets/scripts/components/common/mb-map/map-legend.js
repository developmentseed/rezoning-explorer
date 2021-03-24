import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { themeVal } from '../../../styles/utils/general';
import { glsp } from '../../../styles/utils/theme-values';

import { LegendLinear, LegendItem } from '@visx/legend';
import { scaleLinear } from '@visx/scale';
import colormap from 'colormap';

const MapLegendSelf = styled.div`
  position: absolute;
  right: 0.5rem;
  bottom: 2.5rem;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: ${themeVal('shape.rounded')};
  font-size: 0.874rem;
  padding: ${glsp(0.5)};
  margin: ${glsp(0.5)};
  display: grid;
  grid-template-columns: 1fr 1fr;
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
      <LegendTitle>{props.description}</LegendTitle>
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
  })
};

MapLegend.defaultProps = {
  scale: {
    domain: 50,
    colorMap: 'viridis',
    colorArray: null
  }
};
