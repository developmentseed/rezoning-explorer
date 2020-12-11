import React from 'react';
import T from 'prop-types';
import { FormWrapper, FormHeader, PanelOption, PanelOptionTitle, OptionHeadline } from './form';
import InfoButton from '../../common/info-button';

function LCOEForm (props) {
  const {
    lcoe,
    setLcoe,
    inputOfType,
    updateStateList,
    active
  } = props;
  return (
    <FormWrapper
      active={active}
    >
      <FormHeader>
        <h4>
          Economic Parameters
        </h4>
        <details>
          <summary>
          Set economic parameters to...
          </summary>
          <p>o change economic calculations. Set custom LCOE inputs to affect the economic analysis for each renewable energy technology.</p>
        </details>
      </FormHeader>
      {lcoe.map((cost, ind) => (
        <PanelOption key={cost.name}>
          <OptionHeadline>
            <PanelOptionTitle>{cost.name}</PanelOptionTitle>

            {cost.info &&
              <InfoButton info={cost.info} id={cost.name}>
                Info
              </InfoButton>}
          </OptionHeadline>

          {
            inputOfType(cost, (v) => {
              setLcoe(updateStateList(lcoe, ind, {
                ...cost,
                input: {
                  ...cost.input,
                  value: v
                }
              }));
            })
          }
        </PanelOption>
      ))}
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
  inputOfType: T.func,
  updateStateList: T.func,
  active: T.bool
};

export default LCOEForm;
