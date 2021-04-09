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
    [maxZoneScore, setMaxZoneScore, 'Run analysis to filter on zone score'],
    [maxLCOE, setMaxLCOE, 'Run analysis to filter on LCOE']
  ];

  return (
    <Accordion
      initialState={[true]}
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
