import React, { useContext, useCallback } from 'react';
import {
  FormGroupWrapper,
  PanelOption,
  OptionHeadline,
  PanelOptionTitle,
  InactiveMessage
} from '../../styles/form/form';
import FormInput from './form/form-input';
import {
  Accordion,
  AccordionFold,
  AccordionFoldTrigger
} from '../../components/accordion';
import Heading from '../../styles/type/heading';
import { makeTitleCase } from '../../styles/utils/general';
import InfoButton from '../common/info-button';

import ExploreContext from '../../context/explore-context';

function OutputFilters (props) {
  const { maxZoneScore, setMaxZoneScore, maxLCOE, setMaxLCOE } = useContext(
    ExploreContext
  );

  const outputFilters = [
    [maxZoneScore, setMaxZoneScore, 'A sum of scores for multiple criteria normalized from 0 to 1 and weighted by user-defined weights for each zone. 1 is desired whereas 0 is not. The zone score filter excludes zones with scores below the user-defined threshold.'],
    [maxLCOE, setMaxLCOE, 'The LCOE score filter excludes zones with LCOE estimates below the user-defined threshold.']
  ];

  return (
    <Accordion
      initialState={[false]}
    >
      {({ checkExpanded, setExpanded }) => (
        <AccordionFold
          forwardedAs={FormGroupWrapper}
          isFoldExpanded={checkExpanded(0)}
          setFoldExpanded={(v) => setExpanded(0, v)}
          renderHeader={({ isFoldExpanded, setFoldExpanded }) => (
            <AccordionFoldTrigger
              isExpanded={isFoldExpanded}
              onClick={() => setFoldExpanded(!isFoldExpanded)}
            >
              <Heading size='small' variation='primary'>
                {makeTitleCase('Filter Results')}
              </Heading>
            </AccordionFoldTrigger>
          )}
          renderBody={({ isFoldExpanded }) => (
            <>
              {outputFilters.map(
                ([filterObject, setFilterObject, inactiveMessage]) => {
                  const onChange = useCallback(
                    (value) => {
                      setFilterObject({
                        ...filterObject,
                        input: {
                          ...filterObject.input,
                          value
                        }
                      });
                    },
                    [filterObject]
                  );
                  return (
                    <PanelOption
                      key={filterObject.name}
                      hidden={!isFoldExpanded}
                    >
                      <OptionHeadline>
                        <PanelOptionTitle>
                          {`${filterObject.name}`.concat(
                            filterObject.unit ? ` (${filterObject.unit})` : ''
                          )}
                        </PanelOptionTitle>
                        {filterObject.info && (
                          <InfoButton
                            info={filterObject.info}
                            id={filterObject.name}
                          >
                            Info
                          </InfoButton>
                        )}
                      </OptionHeadline>
                      {filterObject.active ? (
                        <FormInput option={filterObject} onChange={onChange} />
                      ) : (
                        <InactiveMessage>{inactiveMessage}</InactiveMessage>
                      )}
                    </PanelOption>
                  );
                }
              )}
            </>
          )}
        />
      )}
    </Accordion>
  );
}

export default OutputFilters;
