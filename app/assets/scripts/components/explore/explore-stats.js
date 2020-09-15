import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import StatSummary from '../common/table';
import BarChart from '../common/bar-chart';
import { themeVal } from '../../styles/utils/general';
import { formatThousands } from '../../utils/format';

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
  ${({ active }) =>
    active &&
    css`
      pointer-events: none;
      opacity: 0.4;
    `}
`;

const zonesSummary = (zones) => {
  const stats = zones.reduce(
    (stats, { properties: {summary} }) => {
      if (!summary) return stats;
      return {
        zonesCount: stats.zonesCount + 1,
        zonesOutput: stats.zonesOutput + summary.zone_output,
        zonesArea:
          stats.zonesArea + summary.zone_output / summary.zone_output_density
      };
    },
    {
      zonesCount: 0,
      zonesOutput: 0,
      zonesArea: 0
    }
  );

  return [
    { label: 'Matching Zones', data: stats.zonesCount },
    {
      label: 'Total Area',
      unit: 'km²',
      data:
        stats.zonesArea > 0
          ? formatThousands(stats.zonesArea / 10, { decimals: 0 })
          : '--'
    },
    {
      label: 'Output by Year',
      unit: 'GWh',
      data:
        stats.zonesOutput > 0
          ? formatThousands(stats.zonesOutput / 1000, { decimals: 0 })
          : '--'
    },
    {
      label: 'Output Density',
      unit: 'MWh/km²',
      data:
        stats.zonesOutput > 0
          ? formatThousands(stats.zonesOutput / stats.zonesArea, {
            decimals: 2
          })
          : '--'
    }
  ];
};

function ExploreStats (props) {
  const { zones, active } = props;
  const statData = zonesSummary(zones || []);
  return (
    <StatsWrapper active={active}>
      {zones && <BarChart title='Calculated Zone Scores' />}
      <StatSummary
        title='Summary'
        data={statData}
        dimension={[2, 2]}
        gap={1}
        renderCell={(datum) => (
          <dl>
            <dd>{datum.data || '--'}</dd>
            <dt>{datum.label}</dt>
            <dt>{datum.unit}</dt>
          </dl>
        )}
      />
    </StatsWrapper>
  );
}

ExploreStats.propTypes = {
  zones: T.array,
  active: T.bool
};
export default ExploreStats;
