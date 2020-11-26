import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import App from '../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';
import media from '../../styles/utils/media-queries';
import { themeVal } from '../../styles/utils/general';

import PrimePanel from './prime-panel';
import SecPanel from './sec-panel';
import MbMap from '../common/mb-map/mb-map';

import ExploreContext from '../../context/explore-context';
import Tour from '../common/tour';
import { MapProvider } from '../../context/map-context';
import Histogram from '../common/histogram';

const ExploreCanvas = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: min-content 1fr min-content;
  overflow: hidden;
  ${media.mediumDown`
    ${({ panelPrime, panelSec }) => {
      if (panelPrime && !panelSec) {
        return 'grid-template-columns: min-content 0 0;';
      }
      if (!panelPrime && panelSec) {
        return 'grid-template-columns: 0 0 min-content;';
      }
    }}
  `}
  > * {
    grid-row: 1;
  }
`;

const ExploreCarto = styled.section`
  position: relative;
  height: 100%;
  background: ${themeVal('color.baseAlphaA')};
  display: grid;
  grid-template-rows: 1fr auto;
  min-width: 0;
  overflow: hidden;
`;

function Explore () {
  const [triggerResize, setTriggerResize] = useState(true);
  const { selectedArea, selectedResource, tourStep, setTourStep, currentZones } = useContext(ExploreContext);
  const zoneData = currentZones.isReady() ? currentZones.getData() : null;
  return (
    <App
      pageTitle='Explore'
    >
      <Tour
        ready={(selectedArea && selectedResource) !== undefined}
        tourStep={tourStep}
        setTourStep={setTourStep}
      />
      <Inpage isMapCentric>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Explore</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <ExploreCanvas>
            <MapProvider>
              <PrimePanel
                onPanelChange={() => {
                  setTriggerResize(!triggerResize);
                }}
              />

              <ExploreCarto>
                <MbMap
                  triggerResize={triggerResize}
                />
                { zoneData && (
                  <Histogram
                    yProp='lcoe'
                    xProp={['zone_output', 'lcoe']}
                    data={zoneData.map(datum => ({ ...datum.properties.summary, color: datum.properties.color }))}
                  />
                )}
              </ExploreCarto>

              <SecPanel
                onPanelChange={() => {
                  setTriggerResize(!triggerResize);
                }}
              />
            </MapProvider>
          </ExploreCanvas>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Explore;
