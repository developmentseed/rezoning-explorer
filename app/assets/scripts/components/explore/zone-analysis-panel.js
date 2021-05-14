import React, { useContext } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import ExploreStats from './explore-stats';
import ExploreZones from './explore-zones';
import ExploreContext from '../../context/explore-context';
import OutputFilters from './output-filters';

const PanelInner = styled.div`
  flex: 1;
  display: grid;
  grid-template-rows: auto auto 1fr;
  padding: 1rem 1.5rem;
`;

function ZoneAnalysisPanel (props) {
  const { currentZones, inputTouched } = props;
  const {
    maxZoneScore: { input: { value: maxZoneScore } },
    maxLCOE: { input: { value: maxLCOE } }
  } = useContext(ExploreContext);

  const filteredZones = currentZones && currentZones.filter(z => {
    /* eslint-disable camelcase */
    const { zone_score, lcoe } = z.properties.summary;

    const zs = zone_score >= maxZoneScore.min && zone_score <= maxZoneScore.max;
    const zl = maxLCOE ? (lcoe >= maxLCOE.min && lcoe <= maxLCOE.max) : true;
    return zs && zl && zone_score > 0;
  });

  return (
    <PanelInner>
      <OutputFilters />
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
