import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { Subheading } from '../../styles/type/heading';

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
  background-color: ${({ color }) => color};
`;

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display:grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: 0.25rem;
  padding: 0.5rem 0;
`;

function ColorScale ({ min, max, steps, heading, colorFunction }) {
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
                color={colorFunction((i + 1) / steps)}
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
  heading: T.string,
  colorFunction: T.func
};

export default ColorScale;
