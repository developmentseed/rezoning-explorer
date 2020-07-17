import React from 'react';
import styled from 'styled-components';

const StatsWrapper = styled.section`
  height: 12rem;
`;

const LineChart = styled.div`
  height: 50%;
`;
const StatSummary = styled.div`
  height: 50%;
`;
function ExploreStats () {
  return (
    <StatsWrapper>
      <LineChart />
      <StatSummary />
    </StatsWrapper>
  );
}
export default ExploreStats;
