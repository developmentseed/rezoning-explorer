import React, { useState, useContext } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Subheading } from '../../styles/type/heading';
import CardList, { CardWrapper } from '../common/card-list';
import { themeVal } from '../../styles/utils/general';
import FocusZone from './focus-zone';
import Dl from '../../styles/type/definition-list';
import Button from '../../styles/button/button';
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

const ZonesHeader = styled(Subheading)`
  padding: 1rem 0rem;
`;

const Card = styled(CardWrapper)`
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
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  font-size: 0.875rem;
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
  dd {
    text-align: right;
    font-family: ${themeVal('type.mono.family')};
    color: ${themeVal('color.primary')};
  }
`;

function ExploreZones (props) {
  const { active, currentZones } = props;

  // const { currentZones } = useContext(ExploreContext);
  const { hoveredFeature, setHoveredFeature } = useContext(MapContext);

  const [focusZone, setFocusZone] = useState(null);

  const [selectedZones, setSelectedZones] = useState(currentZones.reduce((accum, zone) => ({ ...accum, [zone.id]: false }), {}));

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

  const formatLabel = function (id) {
    switch (id) {
      case 'lcoe':
        return `${id.replace(/_/g, ' ')} [USD/MwH]`;
      default:
        return id.replace(/_/g, ' ');
    }
  };

  const onRowHoverEvent = (event, row) => {
    setHoveredFeature(event === 'enter' ? row : null);
  };

  return (
    <ZonesWrapper active={active}>
      <ColorScale steps={10} heading='Weighted Zone Score' min={0} max={1} colorFunction={zoneScoreColor} />
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
            data={currentZones}
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
                          <dt>{formatLabel(label)}</dt>
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
