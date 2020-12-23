import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import Button from '../../styles/button/button';
import Dl from '../../styles/type/definition-list';
import ShadowScrollbar from '../common/shadow-scrollbar';
import { themeVal } from '../../styles/utils/general';
import { FormCheckable } from '../../styles/form/checkable';
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
    default:
      return formatThousands(value);
  }
};

export const formatLabel = function (id, titleCased = false) {
  const label = id.replace(/_/g, ' '); // replace spaces;

  switch (id) {
    case 'lcoe':
      return `${id.replace(/_/g, ' ')} (USD/MWh)`;
    case 'zone_output':
      return `${id.replace(/_/g, ' ')} (GwH)`;
    case 'zone_output_density':
      return `${id.replace(/_/g, ' ')} (MWh/km²)`;
    default:
      return titleCased ? toTitleCase(label) : label;
  }
};

function FocusZone (props) {
  const { zone, selected, onSelect } = props;
  const { id } = zone.properties;
  /* eslint-disable-next-line */
  const detailsList = {
    id: id,
    name: zone.properties.id,
    ...zone.properties.summary
  };
  return (
    <Wrapper>
      <ShadowScrollbar>
        <Details>
          {Object.entries(detailsList).map(([label, data]) => (
            <Dl key={`${id}-${label}`}>
              <dt>{formatLabel(label)}</dt>
              <dd>{formatIndicator(label, data)}</dd>
            </Dl>
          ))}
        </Details>

        <FocusZoneFooter>
          <FormCheckable
            name={id}
            id={id}
            type='checkbox'
            checked={selected}
            onChange={onSelect}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Add zone to selection
          </FormCheckable>
        </FocusZoneFooter>
      </ShadowScrollbar>
    </Wrapper>
  );
}

FocusZone.propTypes = {
  zone: T.object.isRequired,
  selected: T.bool,
  onSelect: T.func
};

export default FocusZone;
