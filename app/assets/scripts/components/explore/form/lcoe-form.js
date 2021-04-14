import React, { useCallback } from 'react';
import T from 'prop-types';
import {
  FormWrapper,
  FormGroupWrapper,
  PanelOption,
  PanelOptionTitle,
  OptionHeadline
} from '../../../styles/form/form';
import FormIntro from './form-intro';
import InfoButton from '../../common/info-button';
import FormInput from '../form/form-input';
import { Accordion, AccordionFold, AccordionFoldTrigger } from '../../../components/accordion';
import Heading from '../../../styles/type/heading';
import { makeTitleCase } from '../../../styles/utils/general';

function LCOEForm (props) {
  const { lcoe, active } = props;

  const categorizedCosts = Object.entries(lcoe.reduce((accum, cost) => {
    const [c] = cost;
    if (!accum[c.category]) {
      accum[c.category] = [];
    }
    accum[c.category].push(cost);
    return accum;
  }, {}))
    .sort(([cat]) => cat === 'Basic' ? -1 : 1);

  return (
    <FormWrapper active={active}>
      <FormIntro
        formTitle='Economic Parameters'
        introText='Adjust economic parameters to change economic calculations. Set custom LCOE inputs to affect the economic analysis for each renewable energy technology.'
      />
      <Accordion
        initialState={[true, ...categorizedCosts.slice(1).map(c => false)]}
      >
        {({ checkExpanded, setExpanded }) => {
          return (
            categorizedCosts.map(([cat, list], idx) => {
              return (
                <AccordionFold
                  key={cat}
                  forwardedAs={FormGroupWrapper}
                  isFoldExpanded={checkExpanded(idx)}
                  setFoldExpanded={(v) => setExpanded(idx, v)}
                  renderHeader={({ isFoldExpanded, setFoldExpanded }) => (
                    <AccordionFoldTrigger
                      isExpanded={isFoldExpanded}
                      onClick={() => setFoldExpanded(!isFoldExpanded)}
                    >
                      <Heading size='small' variation='primary'>
                        {makeTitleCase(cat.replace(/_/g, ' '))}
                      </Heading>
                    </AccordionFoldTrigger>
                  )}
                  renderBody={({ isFoldExpanded }) => (
                    <>
                      {list.map(([cost, setCost], ind) => {
                        const onChange = useCallback(
                          (v) => setCost({
                            ...cost,
                            input: {
                              ...cost.input,
                              value: v
                            }
                          })

                        );
                        return (
                          <PanelOption key={cost.name} hidden={!isFoldExpanded}>
                            <OptionHeadline>
                              <PanelOptionTitle>{cost.name}</PanelOptionTitle>
                              {cost.info &&
                            <InfoButton info={cost.info} id={cost.name}>
                              Info
                            </InfoButton>}
                            </OptionHeadline>

                            <FormInput
                              option={cost}
                              onChange={onChange}
                            />
                          </PanelOption>
                        );
                      })}
                    </>
                  )}

                />
              );
            })

          );
        }}
      </Accordion>
      {/* lcoe.map(([cost, setCost], ind) => {
        const onChange = useCallback(
          (v) => setCost({
            ...cost,
            input: {
              ...cost.input,
              value: v
            }
          })

        );
        return (
          <PanelOption key={cost.name}>
            <OptionHeadline>
              <PanelOptionTitle>{cost.name}</PanelOptionTitle>
              {cost.info &&
              <InfoButton info={cost.info} id={cost.name}>
                Info
              </InfoButton>}
            </OptionHeadline>

            <FormInput
              option={cost}
              onChange={onChange}
            />
          </PanelOption>
        );
      }) */}
    </FormWrapper>
  );
}

LCOEForm.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  name: T.string,
  icon: T.string,
  presets: T.object,
  setPreset: T.func,
  lcoe: T.array,
  setLcoe: T.func,
  active: T.bool,
  disabled: T.bool
};

export default LCOEForm;
