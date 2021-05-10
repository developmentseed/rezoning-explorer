import React, { useState, useContext } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Subheading } from '../../styles/type/heading';
import CardList, { CardWrapper } from '../common/card-list';
import { themeVal } from '../../styles/utils/general';
import FocusZone, { formatIndicator } from './focus-zone';
import Button from '../../styles/button/button';
import collecticon from '../../styles/collecticons';
import get from 'lodash.get';
import MapContext from '../../context/map-context';

import { FormCheckable } from '../../styles/form/checkable';

import ExportButton from './export';
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
  grid-template-columns: repeat(3, 1fr) 1rem;
  align-items: baseline;
  margin: 1rem 0rem;
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
  grid-template-columns: repeat(3, 1fr) 1rem;
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

    dd {
      color: ${themeVal('color.primary')};
    }
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
  grid-template-columns: ${({ hasZoneScore }) => hasZoneScore ? '1fr 1fr' : '1fr'};
  font-size: 0.875rem;
  text-align: center;
  text-transform: uppercase;
`;
const Detail = styled.dl`
  dt,
  dd {
    margin: 0;
  }
  dd {
    font-size: ${themeVal('type.base.size')};
    font-weight: ${themeVal('type.heading.weight')};
    text-align: right;
  }
`;

const ZoneColumnHead = styled(Subheading)`
    text-align: right;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-end;
    span {
      order: 3;
      flex: 100%;
    }
    &:hover {
      color: ${themeVal('color.primary')};
    }
    &:after {
      color: ${themeVal('color.primary')};
    }
    ${({ asc, activelySorting }) => {
      if (activelySorting) {
        return css`
        /* stylelint-disable */
          &:after {
            order: 2;
            vertical-align: bottom;
            ${collecticon(asc ? 'sort-asc' : 'sort-desc')}
          }
        `;
      } else {
          return css`
            &:after {
            /* stylelint-enable */
              order: 2;
              vertical-align: bottom;
              ${collecticon('sort-none')}
            }
          `;
      }
    }}
`;

const columns = [{ id: 'lcoe', name: 'LCOE' }, { id: 'zone_score', name: 'SCORE' }];

function ExploreZones (props) {
  const { active, currentZones } = props;

  const { hoveredFeature, setHoveredFeature, focusZone, setFocusZone } = useContext(MapContext);

  const [selectedZones, setSelectedZones] = useState(currentZones.reduce((accum, zone) => ({ ...accum, [zone.id]: false }), {}));

  const [sortAsc, setSortAsc] = useState(false);

  const onRowHoverEvent = (event, row) => {
    setHoveredFeature(event === 'enter' ? row : null);
  };

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

          {
            columns.map(({ id, name }) => {
              return (
                <ZoneColumnHead
                  key={id}
                  title={`Sort by ${name}`}
                  as='a'
                  activelySorting={sortId === id}
                  asc={sortAsc}
                  onClick={() => {
                    setSortId(id);
                    setSortAsc(!sortAsc);
                  }}
                >
                  {name}
                  {id === 'lcoe' && <span>(USD/MWh)</span>}
                </ZoneColumnHead>
              );
            }

            )
          }
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
              currentZones.sort((a, b) => {
                // Zones with no suitable areas have LCOE equal to 0, when they
                // should have Infinity. To avoid breaking other components by changing the default
                // value, this quick fix will treat zeroes as Infinity when ordering.
                if (sortId === 'lcoe') {
                  if (b.properties.summary[sortId] === 0) {
                    return sortAsc ? 1 : -1;
                  } else if (a.properties.summary[sortId] === 0) {
                    return sortAsc ? -1 : 1;
                  }
                }

                return sortAsc
                  ? parseFloat(b.properties.summary[sortId]) - parseFloat(a.properties.summary[sortId])
                  : parseFloat(a.properties.summary[sortId]) - parseFloat(b.properties.summary[sortId]);
              }
              )
            }
            renderCard={(data) => {
              const hasZoneScore = get(data, 'properties.summary.zone_score', 0) > 0;
              return (
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
                  <CardDetails columns={hasZoneScore}>
                    {hasZoneScore
                      ? Object.entries(data.properties.summary)
                        .filter(([label, value]) => FILTERED_PROPERTIES[label])
                        .map(([label, value]) => (
                          <Detail key={`${data.id}-${label}`}>
                            <dd>{formatIndicator(label, value)}</dd>
                          </Detail>
                        )
                        )
                      : 'Zone unavailable'}
                  </CardDetails>

                </Card>
              );
            }}
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
      <ExportButton />
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
