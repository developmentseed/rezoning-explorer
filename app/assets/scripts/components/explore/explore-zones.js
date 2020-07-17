import React from 'react';
import styled from 'styled-components';
import Heading, { Subheading } from '../../styles/type/heading';
import BaseCardList, { CardWrapper } from '../common/card-list';
import { themeVal } from '../../styles/utils/general';

const CARD_DATA = [
  {
    id: 'AB',
    color: '#2c2a59',
    details: { zone_score: 0.782, total_lcoe: 145.3, generation: 39552 }
  },
  {
    id: 'CD',
    color: '#353d6d',
    details: { zone_score: 0.782, total_lcoe: 145.3, generation: 39552 }
  },
  {
    id: 'EF',
    color: '#4f5698',
    details: { zone_score: 0.782, total_lcoe: 145.3, generation: 39552 }
  }

];

const ZonesWrapper = styled.section`
`;

const ZonesHeader = styled(Subheading)`
`;

const CardList = styled(BaseCardList)`
  ol.list-container {
    /* not working */
    padding: 0;
  }
`;

const Card = styled(CardWrapper)`
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 5px;
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
  background: ${({ color }) => color};
  width: 3rem;
  height: 3rem;;
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
  gap: 10px;
  padding: 0 0.5rem;
`;
const Label = styled(Subheading)`
  font-size: 0.6rem;
`;
const Data = styled(Heading)`
  font-size: 0.6rem;
  text-align: right;
`;

function ExploreZones () {
  return (
    <ZonesWrapper>
      <ZonesHeader>All Zones</ZonesHeader>
      <CardList
        numColumns={1}
        data={CARD_DATA}
        renderCard={(data) => (
          <Card size='large' key={data.id}>
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
      />

    </ZonesWrapper>
  );
}
export default ExploreZones;
