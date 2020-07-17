import React from 'react';
import styled from 'styled-components';
import StatSummary from '../common/table';
import BarChart from '../common/bar-chart';
import Heading from '../../styles/type/heading';

const STATS = [
  { label: 'Matching Zones', data: 26 },
  { label: 'kWh/m2 per year', data: 2309 },
  { label: 'GWh per year', data: 1.223 },
  { label: 'kWh/m2 per year', data: 2309 }
];

const StatsWrapper = styled.section`
  height: 20rem;
  display: grid;
  grid-template-rows: 1fr 1fr;
`;

const CellData = styled(Heading)`
`;
const CellLabel = styled.div`
  font-size: 0.75rem;
`;

function ExploreStats () {
  return (
    <StatsWrapper>
      <BarChart
        title='Calculated Zone Scores'
      />
      <StatSummary
        title='Total Output'
        data={STATS}
        dimension={[2, 2]}
        renderCell={datum => (
          <>
            <CellData>{datum.data}</CellData>
            <CellLabel>{datum.label}</CellLabel>
          </>
        )}
      />
    </StatsWrapper>
  );
}
export default ExploreStats;
