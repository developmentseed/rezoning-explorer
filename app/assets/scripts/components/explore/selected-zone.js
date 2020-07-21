import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import Button from '../../styles/button/button';
import Dl from '../../styles/type/definition-list';
import ShadowScrollbar from '../common/shadow-scrollbar';

const Details = styled.div`
/* stylelint-disable */
`;
const LineChart = styled.div`
/* stylelint-enable */

`;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 2rem auto 1fr;
  gap: 0.5rem;
  padding: 0 1.5rem;
  > ${Button} {
    text-align: left;
    margin-left: -1.5rem;
    padding-left: 1.5rem;
    width: calc(100% + 3rem);
  }
`;

function SelectedZone (props) {
  const { zone, resetZone } = props;
  /* eslint-disable-next-line */
  const { id, country, energy_source, details } = zone;
  const detailsList = {
    id,
    country,
    energy_source,
    ...details
  };
  return (

    <Wrapper>
      <Button onClick={resetZone} size='small' useIcon={['chevron-left--small', 'before']}>
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
      </ShadowScrollbar>
    </Wrapper>
  );
}

SelectedZone.propTypes = {
  zone: T.object.isRequired,
  resetZone: T.func
};

export default SelectedZone;
