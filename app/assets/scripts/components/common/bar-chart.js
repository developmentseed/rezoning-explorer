import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Subheading } from '../../styles/type/heading';

const ChartWrapper = styled.div`
  display: grid;
  /*grid-template-rows: 1fr 4fr;*/
`;
const ChartBody = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 140px;
`;

function BarChart ({ title }) {
  return (
    <ChartWrapper>
      <Subheading>{title}</Subheading>
      <ChartBody>
        <div>Chart Place Holder</div>
      </ChartBody>
    </ChartWrapper>
  );
}

BarChart.propTypes = {
  title: T.string
};

export default BarChart;
