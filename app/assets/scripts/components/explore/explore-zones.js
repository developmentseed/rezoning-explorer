import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Subheading } from '../../styles/type/heading';
import CardList, { CardWrapper } from '../common/card-list';
import { themeVal } from '../../styles/utils/general';
import SelectedZone from './selected-zone';
import Dl from '../../styles/type/definition-list';

export const CARD_DATA = [
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
  grid-template-rows: auto 5fr;
`;

const ZonesHeader = styled(Subheading)`
  padding: 1rem 1.5rem;
`;

const Card = styled(CardWrapper)`
  display: flex;
  height: auto;
  box-shadow: none;
  border:none;
  border-bottom: 1px solid ${themeVal('color.baseAlphaC')};
  padding: 0.5rem 1.5rem;
  &:hover {
     box-shadow: none;
     transform: none;
     background: ${themeVal('color.baseAlphaB')};
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
  margin-right: 1rem;
`;

const CardDetails = styled.ul`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
`;
const Detail = styled(Dl)`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  & ~ & {
    padding-top: 0.125rem;
  }

  dt,
  dd {
    margin: 0;
  }
  dt {
    font-size: 0.875rem;
  }
  dd {
    text-align: right;
    font-family: ${themeVal('type.mono.family')};
    color: ${themeVal('color.primary')};
  }
`;

function ExploreZones (props) {
  const { zones } = props;
  const [selectedZone, setSelectedZone] = useState(null);

  const zoneData = zones.isReady() ? zones.getData() : [];

  return (
    <ZonesWrapper>
      <ZonesHeader>All Zones</ZonesHeader>

      { selectedZone
        ? <SelectedZone zone={selectedZone} resetZone={() => setSelectedZone(null)} />
        : <CardList
          numColmns={1}
          data={zoneData}
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
                    <dt>{label.replace(/_/g, ' ')}</dt>
                    <dd>{data}</dd>
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

ExploreZones.propTypes = {
  zones: T.object
};
export default ExploreZones;
