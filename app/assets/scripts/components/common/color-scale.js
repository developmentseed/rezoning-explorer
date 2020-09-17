import React from 'react';
import { interpolate } from 'd3-interpolate';
import styled from 'styled-components';
import T from 'prop-types';
import { Subheading } from '../../styles/type/heading';

const COLOR = interpolate('#2d195e', '#5d0863');

const Scale = styled.div`
  display:grid;
  grid-auto-flow: column;
  justify-content: center;
  grid-template-columns: ${({ steps }) => `repeat(${steps}, 1fr)`};
`;
const Step = styled.div`
  height: 1rem;
  /* stylelint-disable-next-line */
  grid-column: ${({ column, steps }) => `${column + 1} / ${column + 2 > steps ? -1 : column + 2}`};
  background-color: ${({ color }) => color}
`;

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display:grid;
  grid-template-rows: 1fr 1.5fr 1fr;
  padding: 0.5rem 0;

`;

function ColorScale ({ min, max, steps, heading }) {
  return (
    <Wrapper>
      <Subheading size='small'>{heading}</Subheading>
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
      <Labels>
        <Subheading>{min}</Subheading>
        <Subheading>{max}</Subheading>
      </Labels>
    </Wrapper>
  );
}

ColorScale.propTypes = {
  min: T.oneOfType([T.number, T.string]),
  max: T.oneOfType([T.number, T.string]),
  steps: T.number,
  heading: T.string
};

export default ColorScale;
