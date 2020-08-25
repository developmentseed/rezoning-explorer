import React from 'react';
import T from 'prop-types';
import ExploreStats from './explore-stats';
import ExploreZones from './explore-zones';
import Button from '../../styles/button/button';

function ZoneAnalysisPanel (props) {
  const { currentZones, generateZones } = props;
  return (
    <>
      <Button
        as='a'
        useIcon={['layout-grid-3x3', 'before']}
        size='small'
        onClick={generateZones}
      >
        Generate Zones
      </Button>
      <ExploreStats
        zones={currentZones}
      />
      {currentZones.isReady() &&
      <ExploreZones
        zones={currentZones}
      />}
    </>
  );
}
ZoneAnalysisPanel.propTypes = {
  currentZones: T.object,
  generateZones: T.func
};
export default ZoneAnalysisPanel;
