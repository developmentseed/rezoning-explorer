import React from 'react';
import styled from 'styled-components';
import StatSummary from '../common/table';
import BarChart from '../common/bar-chart';
import { themeVal } from '../../styles/utils/general';

const STATS = [
  { label: 'Matching Zones', data: 26 },
  { label: 'kWh/m2 per year', data: 2309 },
  { label: 'GWh per year', data: 1.223 },
  { label: 'kWh/m2 per year', data: 2309 }
];

const StatsWrapper = styled.section`
  display: grid;
  /*grid-template-rows: 1.5fr 1fr;*/
  padding: 0 1.5rem;
  dd {
    font-family: ${themeVal('type.mono.family')};
    font-size: 1.25rem;
    line-height: 1;
    color: ${themeVal('color.primary')};
  }
  dt {
    font-size: 0.875rem;
  }
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
        gap={1}
        renderCell={datum => (
          <dl>
            <dd>{datum.data}</dd>
            <dt>{datum.label}</dt>
          </dl>
        )}
      />
    </StatsWrapper>
  );
}
export default ExploreStats;
