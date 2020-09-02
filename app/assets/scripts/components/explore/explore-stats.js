import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import StatSummary from '../common/table';
import BarChart from '../common/bar-chart';
import { themeVal } from '../../styles/utils/general';

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
  ${({ active }) => active && css`
    pointer-events:none;
    opacity: 0.4;
  `}

`;

const parseZones = (zones) => {
  const stats = zones.reduce((stats, zone) => (
    {
      zoneCount: stats.zoneCount + 1,
      kwhm2_year: stats.kwhm2_year + zone.details['kWh-m2/year'],
      gwh_year: stats.gwh_year + zone.details['GWh/year'],
      kw_day: stats.kw_day + zone.details['kw/day']
    }
  ), {
    zoneCount: 0,
    kwhm2_year: 0,
    gwh_year: 0,
    kw_day: 0
  });

  return [
    { label: 'Matching Zones', data: stats.zoneCount },
    { label: 'kWh/m2 per year', data: stats.kwhm2_year },
    { label: 'GWh per year', data: stats.gwh_year },
    { label: 'kWh/m2 per year', data: stats.kw_day }
  ];
};

function ExploreStats (props) {
  const { zones, active } = props;
  const statData = parseZones(zones.isReady() ? zones.getData() : []);
  return (
    <StatsWrapper active={active}>
      {
        zones.isReady() &&
          <BarChart
            title='Calculated Zone Scores'
          />
      }
      <StatSummary
        title='Total Output'
        data={statData}
        dimension={[2, 2]}
        gap={1}
        renderCell={datum => (
          <dl>
            <dd>{Math.floor(datum.data) === datum.data ? Math.floor(datum.data) : datum.data.toFixed(2)}</dd>
            <dt>{datum.label}</dt>
          </dl>
        )}
      />
    </StatsWrapper>
  );
}

ExploreStats.propTypes = {
  zones: T.object,
  active: T.bool
};
export default ExploreStats;
