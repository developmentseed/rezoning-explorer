import React, { useState } from 'react';
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
import Modal from '../common/modal';

import CardList from '../common/card-list';

import { ExploreProvider } from '../../context/explore-context';

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
  const [showCountrySelect, setShowCountrySelect] = useState(true);

  return (
    <ExploreProvider>
      <App
        pageTitle='Explore'
      >
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
              <PrimePanel
                onPanelChange={() => {
                  setTriggerResize(!triggerResize);
                }}
                onCountryEdit={() => setShowCountrySelect(!showCountrySelect)}
              />
              <Modal
                visible={showCountrySelect}
              >
                <CardList>
                </CardList>
              </Modal>

              <ExploreCarto>
                <MbMap
                  triggerResize={triggerResize}
                />e
              </ExploreCarto>
              <SecPanel
                onPanelChange={() => {
                  setTriggerResize(!triggerResize);
                }}
              />
            </ExploreCanvas>
          </InpageBody>
        </Inpage>
      </App>
    </ExploreProvider>
  );
}

export default Explore;
