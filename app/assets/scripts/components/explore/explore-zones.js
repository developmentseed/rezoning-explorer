import React, { useState } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Subheading } from '../../styles/type/heading';
import CardList, { CardWrapper } from '../common/card-list';
import { themeVal } from '../../styles/utils/general';
import FocusZone from './focus-zone';
import Dl from '../../styles/type/definition-list';
import Button from '../../styles/button/button';
import { formatThousands } from '../../utils/format';

const ZonesWrapper = styled.section`
  ol.list-container {
    padding: 0;
    gap: 0;
  }
  display: grid;
  grid-template-rows: auto 5fr;
  ${({ active }) =>
    active &&
    css`
      pointer-events: none;
      opacity: 0.4;
    `}
`;

const ZonesHeader = styled(Subheading)`
  padding: 1rem 1.5rem;
`;

// const ZoneCheckbox = styled(FormCheckable)`
//   margin-left: 1rem;
// `;

const Card = styled(CardWrapper)`
  display: flex;
  height: auto;
  box-shadow: none;
  border: none;
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
  font-size: 0.5rem;
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
  const { zones, active } = props;

  const [focusZone, setFocusZone] = useState(null);

  const [selectedZones, setSelectedZones] = useState({});

  const zoneData = zones || [];

  const formatIndicator = function (id, value) {
    switch (id) {
      case 'zone_score':
        return formatThousands(value, { forceDecimals: true, decimals: 3 });
      case 'lcoe_density':
        return formatThousands(value, { forceDecimals: true, decimals: 5 });
      default:
        return formatThousands(value);
    }
  };

  return (
    <ZonesWrapper active={active}>
      <ZonesHeader>All Zones</ZonesHeader>

      {focusZone ? (
        <FocusZone
          zone={focusZone}
          unFocus={() => setFocusZone(null)}
          selected={selectedZones[focusZone.id] || false}
          onSelect={() =>
            setSelectedZones({
              ...selectedZones,
              [focusZone.id]: !selectedZones[focusZone.id]
            })}
        />
      ) : (
        <>
          <CardList
            numColumns={1}
            data={zoneData}
            renderCard={(data) => (
              <Card
                size='large'
                key={data.id}
                // onClick={() => {
                //   setFocusZone(data);
                // }}
              >
                <CardIcon color={data.color}>
                  <div>{data.id}</div>
                </CardIcon>
                <CardDetails>
                  {data.analysis
                    ? Object.entries(data.analysis).map(([label, data]) => (
                      <Detail key={`${data.id}-${label}`}>
                        <dt>{label.replace(/_/g, ' ')}</dt>
                        <dd>{formatIndicator(label, data)}</dd>
                      </Detail>
                    ))
                    : 'UNAVAILABLE'}
                </CardDetails>
                {/* <ZoneCheckbox
                  name={data.id}
                  id={data.id}
                  type='checkbox'
                  hideText
                  checked={selectedZones[data.id] || false}
                  onChange={(e) => {
                    setSelectedZones({
                      ...selectedZones,
                      [data.id]: !selectedZones[data.id]
                    });
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Select {data.id}
                </ZoneCheckbox> */}
              </Card>
            )}
          />
        </>
      )}
    </ZonesWrapper>
  );
}
const ExportWrapper = styled.div`
  ${({ usePadding }) => usePadding && 'padding: 0.5rem;'}
  display: flex;
  justify-content: center;
  width: 100%;
  ${Button} {
    width: 100%;
  }
`;

const ExportZonesButton = ({ onExport, small, usePadding }) => {
  return (
    <ExportWrapper usePadding={usePadding}>
      <Button as='a' useIcon='download' variation='primary-raised-dark'>
        {small ? 'Export' : 'Export Selected Zones'}
      </Button>
    </ExportWrapper>
  );
};
ExportZonesButton.propTypes = {
  onExport: T.func,
  small: T.bool,
  usePadding: T.bool
};
export { ExportZonesButton };

ExploreZones.propTypes = {
  zones: T.array,
  active: T.bool
};

export default ExploreZones;
