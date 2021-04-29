import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import Histogram from '../common/histogram';
import { themeVal } from '../../styles/utils/general';
import MbMap from '../common/mb-map/mb-map';
import { useFocusZone, useHoveredFeature } from '../../context/map-context';
import { useZones } from '../../context/explore-context';

const ExploreCarto = styled.section`
  position: relative;
  height: 100%;
  background: ${themeVal('color.baseAlphaA')};
  display: grid;
  grid-template-rows: 1fr auto;
  min-width: 0;
  overflow: hidden;
`;

function Carto(props) {
  const { triggerResize } = props;
  const { currentZones } = useZones();

  const zoneData = currentZones.isReady() ? currentZones.getData() : null;

  const { setFocusZone } = useFocusZone();
  const { setHoveredFeature, hoveredFeature } = useHoveredFeature();

  return (
    <ExploreCarto>
      <MbMap triggerResize={triggerResize} />
      {zoneData && (
        <Histogram
          yProp='lcoe'
          xProp={['zone_output', 'lcoe']}
          data={zoneData.map((datum) => ({
            ...datum.properties.summary,
            color: datum.properties.color,
            ...datum
          }))}
          onBarClick={(e) => setFocusZone(e)}
          onBarMouseOver={(e) => setHoveredFeature(e.id)}
          onBarMouseOut={(e) => setHoveredFeature(null)}
          hoveredBar={hoveredFeature}
        />
      )}
    </ExploreCarto>
  );
}
Carto.propTypes = {
  triggerResize: T.bool,
  zoneData: T.array
};

export default Carto;
