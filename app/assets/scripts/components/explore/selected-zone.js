import React from 'react';
import styled from 'styled-components';
import Heading, { Subheading } from '../../styles/type/heading';
import Button from '../../styles/button/button';

const Details = styled.div`
`;
const LineChart = styled.div`
`;

const Wrapper = styled.div`
  display: grid;
  gap: 10px;
  > ${Button} {
    padding: 0;
    width: 15%;
  }
`

function SelectedZone (props) {
  const { zone, resetZone } = props;
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

export default SelectedZone;
