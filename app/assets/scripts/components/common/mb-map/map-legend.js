import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { themeVal } from '../../../styles/utils/general';
import { glsp } from '../../../styles/utils/theme-values';

import { LegendLinear, LegendItem, LegendLabel } from '@visx/legend';
import { scaleLinear } from '@visx/scale';
import colormap from 'colormap';

const MapLegendSelf = styled.div`
  position: absolute;
  right: 8rem;
  bottom: 1rem;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: ${themeVal('shape.rounded')};
  font-size: 0.874rem;
  padding: ${glsp(0.5)};

  svg {
    display: block;
  }
`;

export default function MapLegend (props) {
  const scale = scaleLinear({
    domain: Array(50).fill(0).map((a, i) => i / 50),
    range: colormap({ colormap: 'viridis', nshades: 50 })
  });

  const min = props.min ? props.min.toFixed(1) : ''
  const max = props.max ? props.max.toFixed(1) : ''

  return (
    <MapLegendSelf>
      <LegendLinear
        scale={scale}
        steps={50}
      >
        {labels => (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
          {labels.map((label, i) => (
            <LegendItem key={`legend-linear-${i}`}>
              <svg width={4} height={10}>
                <rect fill={label.value} width={4} height={10} />
              </svg>
            </LegendItem>
          ))}
          </div>
        )}
      </LegendLinear>
      <span>{min}</span>
      <span style={{float: 'right'}}>{max}</span>
      <div style={{textAlign: 'center'}}>{props.description}</div>
    </MapLegendSelf>
  );
}

MapLegend.propTypes = {};
