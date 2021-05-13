import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import StatSummary from '../common/table';
import { themeVal } from '../../styles/utils/general';
import { formatThousands } from '../../utils/format';
import area from '@turf/area';

const StatsWrapper = styled.section`
  display: grid;
  /*grid-template-rows: 1.5fr 1fr;*/
  dd {
    font-size: 1.5rem;
    font-weight: ${themeVal('type.heading.weight')};
    line-height: 1;
    color: ${themeVal('color.primary')};
  }
  dt {
    font-size: 0.875rem;

    span {
      margin-left: 2px;
    }
  }
  ${({ active }) =>
    active &&
    css`
      pointer-events: none;
      opacity: 0.4;
    `}
`;

export const zonesSummary = (zones) => {
  const stats = zones.reduce(
    (stats, zone) => {
      const { properties: { summary } } = zone;
      if (!summary || !summary.zone_score) return stats;
      return {
        zonesCount: stats.zonesCount + 1,
        zonesOutput: stats.zonesOutput + summary.generation_potential,
        zonesArea:
          stats.zonesArea + area(zone) / 1000000
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
          ? formatThousands(stats.zonesArea, { decimals: 0 })
          : '--'
    },
    {
      label: 'Annual Energy Output Potential',
      unit: 'GWh',
      data:
        stats.zonesOutput > 0
          ? formatThousands(stats.zonesOutput / 1000, { decimals: 0 })
          : '--'
    },
    {
      label: 'Annual Energy Output Density',
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
      <StatSummary
        title='Summary'
        data={statData}
        dimension={[2, 0]}
        gap={0.5}
        renderCell={(datum) => (
          <dl>
            <dd>{datum.data || '--'}</dd>
            <dt>
              {datum.label}
              {
                datum.unit &&
                <span>({datum.unit})</span>
              }
            </dt>
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
