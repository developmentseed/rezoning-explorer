import React, { useState } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
// jjimport { themeVal } from '../../styles/utils/general';

const steps = [
  {
    target: '#select-area-button',
    content: 'This is my text 1',
    disableBeacon: true,
    // disableOverlayClose: false,
    // hideFooter: true,
    placement: 'bottom',
    spotlightClicks: true,
    styles: {
      options: {
        zIndex: 10000
      }
    },
    title: 'Menu'
  },
  {
    target: '#select-resource-button',
    content: 'This is my texti 2',
    disableBeacon: true,
    // disableOverlayClose: false,
    placement: 'bottom',
    spotlightClicks: true,
    styles: {
      options: {
        zIndex: 10000
      }
    },
    title: 'Menu'
  },
  {
    target: '#select-area-button',
    content: 'This is my text 3',
    disableBeacon: true,
    // disableOverlayClose: false,
    placement: 'bottom',
    spotlightClicks: true,
    styles: {
      options: {
        zIndex: 10000
      }
    },
    title: 'Menu'
  }

];
function Tour (props) {
  const { tourStep, setTourStep } = props;
  return (
    <>
      <Joyride
        continuous={true}
        run={tourStep >= 0}
        steps={steps}
        stepIndex={tourStep}
        showProgress={true}
        callback={(state) => {
          const { action, index, type, status } = state;
          if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
            setTourStep(index + (action === ACTIONS.PREV ? -1 : 1));
          } else if (action === ACTIONS.CLOSE || status === STATUS.FINISHED) {
            setTourStep(-1);
          }
        }}
      />

    </>
  );
}

export default Tour;
