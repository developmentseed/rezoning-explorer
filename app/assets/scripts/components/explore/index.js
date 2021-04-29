import React, { useState, useCallback } from 'react';
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

import PrimePanel from './prime-panel';
import SecPanel from './sec-panel';

import Tour from '../common/tour';
import { MapProvider } from '../../context/map-context';
import { FormProvider } from '../../context/form-context';

import ExploreCarto from './explore-carto.js';
import { ExploreProvider } from '../../context/explore-context';

const ExploreCanvas = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: min-content 1fr min-content;
  overflow: hidden;
  ${media.mediumDown`
    max-width: 100vw;
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

function Explore() {
  const [triggerResize, setTriggerResize] = useState(true);

  const onPanelChange = useCallback(() => {
    setTriggerResize(!triggerResize);
  }, [triggerResize]);

  return (
    <App pageTitle='Explore'>
      <ExploreProvider>
        <Tour />
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
                <FormProvider>
                  <PrimePanel onPanelChange={onPanelChange} />
                  <ExploreCarto triggerResize={triggerResize} />
                  <SecPanel onPanelChange={onPanelChange} />
                </FormProvider>
              </MapProvider>
            </ExploreCanvas>
          </InpageBody>
        </Inpage>
      </ExploreProvider>
    </App>
  );
}

if (process.env.NODE_ENV === 'development') {
  Explore.whyDidYouRender = true;
}

export default Explore;
