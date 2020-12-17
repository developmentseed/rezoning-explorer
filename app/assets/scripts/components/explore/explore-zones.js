import React, { useState, useContext } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Subheading } from '../../styles/type/heading';
import CardList, { CardWrapper } from '../common/card-list';
import { themeVal } from '../../styles/utils/general';
import FocusZone from './focus-zone';
import Dl from '../../styles/type/definition-list';
import Button from '../../styles/button/button';
import collecticon from '../../styles/collecticons';
import { formatThousands } from '../../utils/format';
import get from 'lodash.get';
import MapContext from '../../context/map-context';

import { FormCheckable } from '../../styles/form/checkable';

import ColorScale from '../common/color-scale';
import zoneScoreColor from '../../styles/zoneScoreColors';

const FILTERED_PROPERTIES = {
  lcoe: true,
  zone_score: true
};
const ZonesWrapper = styled.section`
  ol.list-container {
    padding: 0;
    gap: 0;
  }
  display: grid;
  grid-template-rows: auto auto 5fr;
  ${({ active }) =>
    active &&
    css`
      pointer-events: none;
      opacity: 0.4;
    `}
`;

const ZonesHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: baseline;
  margin: 1rem 0rem;

  }
  ${Button} {
    font-size: 0.875rem;
    text-align: left;
    margin: 0 -1.5rem;
    padding: 0.25rem 1.5rem;
    width: 150%;
    font-weight: 400;
    grid-column: span 5;
  }
`;

const Card = styled(CardWrapper)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: space-between;
  height: auto;
  box-shadow: none;
  border: none;
  border-bottom: 1px solid ${themeVal('color.baseAlphaC')};
  padding: 0.5rem 0rem;

  ${({ isHovered }) => isHovered && '&,'}
  &:hover {
    box-shadow: none;
    transform: none;
    background: ${themeVal('color.primaryAlpha')};
  }
  ${FormCheckable} {
    padding: 0 1rem;
    justify-self: end;
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
  margin-left: 0.5rem;
  font-size: 0.5rem;
`;

const CardDetails = styled.ul`
  grid-column: span 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 0.875rem;
`;
const Detail = styled(Dl)`
  dt,
  dd {
    margin: 0;
  }
  dd {
    text-align: right;
    color: ${themeVal('color.primary')};
  }
`;

const ZoneColumnHead = styled(Subheading)`
    text-align: right;
    color: ${themeVal('color.primary')};
    ${({ asc }) => css`
        &:after {
          ${collecticon(asc ? 'sort-asc' : 'sort-desc')};
      `}
`;

/*
function ZoneColumnHead (props) {
  const handleClick = () => {
    const { onClick, id } = props;
    onClick(id);
  };
  const { value } = props;
  return <Subheading as='a' title={`Sort by ${value}`} onClick={handleClick}>{value}</Subheading>;
} */

ZoneColumnHead.propTypes = {
  value: T.string,
  onClick: T.func,
  id: T.string
};

function ExploreZones (props) {
  const { active, currentZones } = props;

  const { hoveredFeature, setHoveredFeature, focusZone, setFocusZone } = useContext(MapContext);

  const [selectedZones, setSelectedZones] = useState(currentZones.reduce((accum, zone) => ({ ...accum, [zone.id]: false }), {}));

  // const [sortedZones, setSortedZones] = useState(currentZones.sort((a, b) => parseFloat(b.properties.summary.lcoe) - parseFloat(a.properties.summary.lcoe)));

  const [sortDirection, setSortDirection] = useState('desc');

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

  const onRowHoverEvent = (event, row) => {
    setHoveredFeature(event === 'enter' ? row : null);
  };

  /*
  const sortZoneList = (id) => {
    console.log(id);
    setSortedZones([...currentZones].sort((a, b) =>
      sortDirection === 'desc'
        ? parseFloat(a.properties.summary[id]) - parseFloat(b.properties.summary[id])
        : parseFloat(b.properties.summary[id]) - parseFloat(a.properties.summary[id])
    )
    );
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  }; */

  const [sortId, setSortId] = useState('lcoe');

  return (
    <ZonesWrapper active={active}>
      <ColorScale steps={10} heading='Weighted Zone Score' min={0} max={1} colorFunction={zoneScoreColor} />
      {focusZone ? (
        <ZonesHeader>
          <Button onClick={() => setFocusZone(null)} size='small' useIcon={['chevron-left--small', 'before']}>
            See All Zones
          </Button>
        </ZonesHeader>
      ) : (
        <ZonesHeader>
          <Subheading>All Zones</Subheading>
          <ZoneColumnHead
            title='Sort by lcoe'
            as='a'
            asc={sortDirection === 'asc'}
            onClick={() => {
              setSortId('lcoe');
              setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
            }}
          >LCOE
          </ZoneColumnHead>
          <ZoneColumnHead
            as='a'
            title='Sort by zone score'
            asc={sortDirection === 'asc'}
            onClick={(id) => {
              setSortId('zone_score');
              setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
            }}
          >SCORE
          </ZoneColumnHead>
        </ZonesHeader>
      )}

      {focusZone ? (
        <FocusZone
          zone={focusZone}
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
            data={
              currentZones.sort((a, b) =>
                sortDirection === 'desc'
                  ? parseFloat(a.properties.summary[sortId]) - parseFloat(b.properties.summary[sortId])
                  : parseFloat(b.properties.summary[sortId]) - parseFloat(a.properties.summary[sortId])
              )
            }
            renderCard={(data) => (
              <Card
                size='large'
                key={data.id}
                isHovered={hoveredFeature === data.id}
                onMouseEnter={onRowHoverEvent.bind(null, 'enter', data.id)}
                onMouseLeave={onRowHoverEvent.bind(null, 'leave', data.id)}
                onClick={() => setFocusZone(data)}
              >

                <CardIcon color={get(data, 'properties.color')}>
                  <div>{data.id}</div>
                </CardIcon>
                <CardDetails>
                  {get(data, 'properties.summary.zone_score')
                    ? Object.entries(data.properties.summary)
                      .filter(([label, value]) => FILTERED_PROPERTIES[label])
                      .map(([label, value]) => (
                        <Detail key={`${data.id}-${label}`}>
                          <dd>{formatIndicator(label, value)}</dd>
                        </Detail>
                      )
                      )
                    : 'UNAVAILABLE'}
                </CardDetails>
                <FormCheckable
                  name={data.id}
                  id={data.id}
                  type='checkbox'
                  checked={selectedZones[data.id]}
                  onChange={() => {
                    setSelectedZones({
                      ...selectedZones,
                      [data.id]: !selectedZones[data.id]
                    });
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  hideText
                >Add zone to selection
                </FormCheckable>

              </Card>
            )}
          />
        </>
      )}

      <ExportZonesButton
        onExport={() => {}}
      />
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
      <Button as='a' useIcon='download' variation='primary-raised-dark' size='small'>
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
  active: T.bool,
  currentZones: T.array
};

export default ExploreZones;
