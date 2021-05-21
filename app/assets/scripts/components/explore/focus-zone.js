import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import Button from '../../styles/button/button';
import Dl from '../../styles/type/definition-list';
import ShadowScrollbar from '../common/shadow-scrollbar';
import { themeVal } from '../../styles/utils/general';
import { formatThousands, toTitleCase } from '../../utils/format.js';
import config from '../../config';
const { indicatorsDecimals } = config;

const Details = styled.div`
  /* stylelint-disable */
  dd {
    font-weight: ${themeVal('type.base.bold')};
    color: ${themeVal('color.primary')};
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  gap: 0.5rem;
  > ${Button} {
    text-align: left;
    margin-left: -1.5rem;
    padding-left: 1.5rem;
    width: calc(100% + 3rem);
  }
`;
const FocusZoneFooter = styled.div`
  /*display: flex;
  flex-flow: column nowrap;
  justify-content: stretch;*/

  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-gap: 0.25rem;
`;

export const formatIndicator = function (id, value) {
  if (typeof value !== 'number') return value;

  switch (id) {
    case 'zone_score':
      return formatThousands(value, {
        forceDecimals: true,
        decimals: indicatorsDecimals.zone_score
      });
    case 'lcoe':
      return formatThousands(value, {
        forceDecimals: true,
        decimals: indicatorsDecimals.lcoe
      });
    case 'zone_output_density':
      return formatThousands(value, {
        forceDecimals: true,
        decimals: indicatorsDecimals.zone_output_density
      });
    case 'suitable_area':
      return formatThousands(value / 1000000);
    default:
      return formatThousands(value);
  }
};

export const formatLabel = function (id, titleCased = false) {
  const label = id.replace(/_/g, ' '); // replace spaces;
  switch (id) {
    case 'lcoe':
      return `${id.replace(/_/g, ' ')} (USD/MWh)`;
    case 'generation_potential':
      return `${id.replace(/_/g, ' ')} (GwH)`;
    case 'zone_output_density':
      return `${id.replace(/_/g, ' ')} (MWh/km²)`;
    case 'icp':
      return 'Installed Capacity Potential (MW)';
    case 'suitable_area':
      return `${id.replace(/_/g, ' ')} (km²)`;
    case 'cf':
      return 'Capacity Factor';
    default:
      return titleCased ? toTitleCase(label) : label;
  }
};

export function renderZoneDetailsList (zone, detailsList) {
  const { id, properties } = zone;

  let summary = properties.summary;

  // Some feature summaries are JSON strings
  if (typeof summary === 'string' || summary instanceof String) {
    summary = JSON.parse(summary);
  }

  // Filter summary to include selected details
  if (detailsList) {
    summary = detailsList.reduce((acc, key) => {
      acc[key] = summary[key];
      return acc;
    }, {});
  }

  const flatZone = {
    id,
    name: zone.name || properties.name || id,
    ...summary
  };

  return Object.entries(flatZone).map(([label, data]) => (
    <Dl key={`${id}-${label}`}>
      <dt>{formatLabel(label)}</dt>
      <dd>{formatIndicator(label, data)}</dd>
    </Dl>
  ));
}

function FocusZone (props) {
  const { zone } = props;

  return (
    <Wrapper>
      <ShadowScrollbar>
        <Details>
          {renderZoneDetailsList(zone)}
        </Details>
        <FocusZoneFooter />
      </ShadowScrollbar>
    </Wrapper>
  );
}

FocusZone.propTypes = {
  zone: T.object.isRequired
};

export default FocusZone;
