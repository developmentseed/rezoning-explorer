import React from 'react';
import T from 'prop-types';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import styled from 'styled-components';
import Button from '../../styles/button/button';
import Heading, { Subheading } from '../../styles/type/heading';
import Prose from '../../styles/type/prose';
import { themeVal } from '../../styles/utils/general';

const steps = [
  {
    title: 'Apply Filters',
    target: '#filters-tab',
    content: 'First, set filters to exclude undesired areas. Filters allow you to specify lower and upper thresholds for natural, infrastructure, environmental.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true
  },
  {
    title: 'Set Weights',
    target: '#weights-tab',
    content: 'Next, set weights to score zones accordingly. Adjusting the weights of parameters will change the calculated aggregated zone scores.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true
  },
  {
    title: 'Adjust LCOE Inputs',
    target: '#lcoe-tab',
    content: 'Adjust LCOE input as needed to change economic calculations. Set custom LCOE inputs to affect the economic analysis for each renewable energy technology.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true
  },
  {
    title: 'Guided Tour',
    target: '#open-tour-trigger',
    content: 'Click here to reopen this guided tour at any time.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true
  }
];

const Inner = styled.div`
  background:  ${themeVal('color.baseLight')};
  width: 20rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr 3fr auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 0.5rem;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns:repeat(${({ columns }) => columns}, 1fr);
  gap: 0.5rem;
`;

const TourTooltip = ({
  index,
  size,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps
}) => {
  return (
    <Inner {...tooltipProps}>
      <Header>
        <Heading>{step.title}</Heading>
        <Subheading id='tour-progress'>{index + 1} / {size}</Subheading>
      </Header>
      <Prose>
        {step.content}
      </Prose>
      <Footer>
        <Button
          {...closeProps}
          visuallyDisabled
          size='small'
          useIcon={['xmark', 'after']}
        >
          Close
        </Button>
        <Controls columns={index > 0 ? 2 : 1}>
          {index > 0 &&
            <Button
              {...backProps}
              size='small'
              variation='base-plain'
              useIcon={['arrow-left', 'after']}
              id='tour-back-btn'
            >Back
            </Button>}
          <Button
            {...primaryProps}
            size='small'
            variation='primary-raised-dark'
            useIcon={index < size - 1 && ['arrow-right', 'after']}
            id='tour-next-btn'
          >
            { index === size - 1 ? 'Finish' : 'Next'}
          </Button>
        </Controls>
      </Footer>
    </Inner>
  );
};

TourTooltip.propTypes = {
  index: T.number,
  size: T.number,
  step: T.object,
  backProps: T.object,
  closeProps: T.object,
  primaryProps: T.object,
  tooltipProps: T.object
};

function Tour (props) {
  const { tourStep, setTourStep, ready } = props;
  return (
    <>
      <Joyride
        continuous={true}
        run={ready && tourStep >= 0}
        steps={steps}
        stepIndex={tourStep}
        showProgress={true}
        tooltipComponent={TourTooltip}
        floaterProps={{ disableAnimation: true }}
        disableOverlay
        callback={(state) => {
          const { action, index, type, status } = state;
          if (tourStep >= 0) {
            if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
              setTourStep(index + (action === ACTIONS.PREV ? -1 : 1));
            } else if (action === ACTIONS.CLOSE || status === STATUS.FINISHED) {
              setTourStep(-1);
            }
          }
        }}
      />

    </>
  );
}

Tour.propTypes = {
  tourStep: T.number,
  setTourStep: T.func,
  ready: T.bool
};

export default Tour;
