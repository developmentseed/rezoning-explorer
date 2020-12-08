import React, { useContext } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import ExploreStats from './explore-stats';
import ExploreZones from './explore-zones';
import ExploreContext from '../../context/explore-context';

const PanelInner = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: auto 1fr;
  padding: 1rem 1.5rem;
`;

function ZoneAnalysisPanel (props) {
  const { currentZones, inputTouched } = props;
  const { maxZoneScore, maxLCOE } = useContext(ExploreContext);

  const filteredZones = currentZones && currentZones.filter(z => {
    /* eslint-disable camelcase */
    const { zone_score, lcoe } = z.properties.summary;
    const zs = zone_score >= maxZoneScore.min && zone_score <= maxZoneScore.max;
    const zl = maxLCOE ? (lcoe >= maxLCOE.min && lcoe <= maxLCOE.max) : true;
    return zs && zl;
  });

  return (
    <PanelInner>
      <ExploreStats zones={filteredZones} active={inputTouched} />
      {currentZones && (
        <ExploreZones active={inputTouched} currentZones={filteredZones} />
      )}
    </PanelInner>
  );
}
ZoneAnalysisPanel.propTypes = {
  currentZones: T.array,
  inputTouched: T.bool
};
export default ZoneAnalysisPanel;
