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

  const scale = scaleLinear({
    domain: Array(50).fill(0).map((a, i) => i / 50),
    range: colormap({ colormap: 'viridis', nshades: 50 })
  });

  const min = props.min ? props.min.toFixed(1) : '';
  const max = props.max ? props.max.toFixed(1) : '';

  return (
    <MapLegendSelf>
      <LegendLinear
        scale={scale}
        steps={50}
      >
        {labels => (
          <LegendLabelsStyled>
            {labels.map((label, i) => (
              <LegendItem key={`legend-linear-${label.datum}`}>
                <svg width={4} height={10}>
                  <rect fill={label.value} width={4} height={10} />
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
  max: T.number
};
