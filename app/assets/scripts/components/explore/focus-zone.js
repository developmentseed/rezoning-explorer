import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import Button from '../../styles/button/button';
import Dl from '../../styles/type/definition-list';
import ShadowScrollbar from '../common/shadow-scrollbar';
import { themeVal } from '../../styles/utils/general';
import { FormCheckable } from '../../styles/form/checkable';
import { ExportZonesButton } from './explore-zones';

const Details = styled.div`
/* stylelint-disable */
  dd {
    font-family: ${themeVal('type.mono.family')};
    font-weight: ${themeVal('type.base.bold')};
    color: ${themeVal('color.primary')};
  }
`;
const LineChart = styled.div`
/* stylelint-enable */

`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 2rem auto 1fr;
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

function FocusZone (props) {
  const { zone, unFocus, selected, onSelect } = props;
  const { id } = zone.properties;
  /* eslint-disable-next-line */
  const detailsList = {
    id: id,
    name: zone.properties.id,
    ...zone.properties.summary
  };
  return (

    <Wrapper>
      <Button onClick={unFocus} size='small' useIcon={['chevron-left--small', 'before']}>
        See All Zones
      </Button>
      <LineChart title='Supply Curve' />
      <ShadowScrollbar>
        <Details>
          {Object.entries(detailsList).map(([label, data]) => (
            <Dl key={`${id}-${label}`}>
              <dt>{label}</dt>
              <dd>{data}</dd>
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
          >Add zone to selection
          </FormCheckable>

          <ExportZonesButton onExport={() => {}} small />
        </FocusZoneFooter>
      </ShadowScrollbar>
    </Wrapper>
  );
}

FocusZone.propTypes = {
  zone: T.object.isRequired,
  unFocus: T.func,
  selected: T.bool,
  onSelect: T.func
};

export default FocusZone;
