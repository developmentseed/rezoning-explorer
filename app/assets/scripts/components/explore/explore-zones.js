import React, { useState } from 'react';
import styled from 'styled-components';
import Heading, { Subheading } from '../../styles/type/heading';
import CardList, { CardWrapper } from '../common/card-list';
import { themeVal } from '../../styles/utils/general';
import SelectedZone from './selected-zone';

const CARD_DATA = [
  {
    id: 'AB',
    color: '#2c2a59',
    country: 'Zambia',
    energy_source: 'PVSolar',
    details: { zone_score: 0.782, total_lcoe: 145.3, generation: 39552 }
  },
  {
    id: 'CD',
    color: '#353d6d',
    country: 'Zambia',
    energy_source: 'PVSolar',
    details: { zone_score: 0.782, total_lcoe: 145.3, generation: 39552 }
  },
  {
    id: 'EF',
    color: '#4f5698',
    country: 'Zambia',
    energy_source: 'PVSolar',
    details: { zone_score: 0.782, total_lcoe: 145.3, generation: 39552 }
  }

];

const ZonesWrapper = styled.section`
  ol.list-container {
    padding: 0;
    gap: 0;
  }
  display: grid;
  grid-template-rows: 1fr 5fr;
`;

const ZonesHeader = styled(Subheading)`
  padding: 1rem 0;
`;

const Card = styled(CardWrapper)`
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 0.5rem;
  height: auto;
  box-shadow: none;
  border:none;
  border-bottom: 1px solid ${themeVal('color.baseAlphaC')};
  &:hover {
     box-shadow: none;
     transform: translate(0, -0.125rem);
   }
`;

const CardIcon = styled.div`
  background: ${({ color }) => `${color}`};
  width: 3rem;
  height: 3rem;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CardDetails = styled.ul`
  display: grid;
  grid-template-rows: repeat(auto-fit, 1fr);
  grid-gap: 4px;
`;
const Detail = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  /*padding: 0 0.5rem;*/
`;
const Label = styled(Subheading)`
  font-size: 0.6rem;
`;
const Data = styled(Heading)`
  font-size: 0.6rem;
  text-align: right;
`;

function ExploreZones () {
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <ZonesWrapper>
      <ZonesHeader>All Zones</ZonesHeader>

      { selectedZone
        ? <SelectedZone zone={selectedZone} resetZone={() => setSelectedZone(null)} />
        : <CardList
          numColumns={1}
          data={CARD_DATA}
          renderCard={(data) => (
            <Card
              size='large'
              key={data.id}
              onClick={() => setSelectedZone(data)}
            >
              <CardIcon color={data.color}>
                <div>{data.id}</div>
              </CardIcon>
              <CardDetails>
                {Object.entries(data.details).map(([label, data]) => (
                  <Detail key={`${data.id}-${label}`}>
                    <Label>{label.replace(/_/g, ' ')}</Label>
                    <Data>{data}</Data>
                  </Detail>
                ))}
              </CardDetails>
            </Card>
          )}
          /* eslint-disable-next-line */
          />}

    </ZonesWrapper>
  );
}
export default ExploreZones;
