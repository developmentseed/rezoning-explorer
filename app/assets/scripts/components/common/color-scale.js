import React from 'react';
import { interpolate } from 'd3-interpolate';
import styled from 'styled-components';
import T from 'prop-types';

const COLOR = interpolate('#2d195e', '#5d0863');

const Scale = styled.div`
  display:grid;
  grid-auto-flow: column;
  justify-content: center;
  grid-template-columns: ${({ steps }) => `repeat(${steps}, 1fr)`};
  padding: 0.5rem;
`;
const Step = styled.div`
  height: 1rem;
  grid-column: ${({ column, steps }) => `${column + 1} / ${column + 2 > steps ? -1 : column + 2}`};
  background-color: ${({ color }) => color}
`;

function ColorScale ({ min, max, steps }) {
  return (
    <Scale steps={steps}>
      {
        [...new Array(steps)].map((_, i) => {
          return (
            <Step
              /* eslint-disable-next-line */
              key={`${i}-step`}
              column={i}
              steps={steps}
              color={COLOR(i / steps)}
            />
          );
        })
      }
    </Scale>
  );
}

ColorScale.propTypes = {
  min: T.string,
  max: T.string,
  steps: T.number
};

export default ColorScale;
