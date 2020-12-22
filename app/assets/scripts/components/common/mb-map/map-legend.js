import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { themeVal } from '../../../styles/utils/general';
import { glsp } from '../../../styles/utils/theme-values';

import { LegendThreshold } from '@visx/legend';
import { scaleThreshold } from '@visx/scale';

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
  const threshold = scaleThreshold({
    domain: [0.02, 0.04, 0.06, 0.08, 0.1],
    range: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f']
  });

  return (
    <MapLegendSelf>
      <LegendThreshold
        scale={threshold}
        direction='column-reverse'
        itemDirection='row-reverse'
        labelMargin='0 20px 0 0'
        shapeMargin='1px 0 0'
      />
    </MapLegendSelf>
  );
}

MapLegend.propTypes = {};
