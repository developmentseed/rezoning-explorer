import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import Heading, { Subheading } from '../../styles/type/heading';
import Button from '../../styles/button/button';

const Details = styled.div`
/* stylelint-disable */
`;
const LineChart = styled.div`
/* stylelint-enable */

`;

const Wrapper = styled.div`
  display: grid;
  gap: 10px;
  > ${Button} {
    padding: 0;
    width: 15%;
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
      <Details>
        {Object.entries(detailsList).map(([label, data]) => (
          <React.Fragment key={`${id}-${label}`}>
            <Subheading>{label}</Subheading>
            <Heading size='small'>{data}</Heading>
          </React.Fragment>
        ))}
      </Details>
    </Wrapper>
  );
}

SelectedZone.propTypes = {
  zone: T.object.isRequired,
  resetZone: T.func
};

export default SelectedZone;
