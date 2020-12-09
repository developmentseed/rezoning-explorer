import React from 'react';
import T from 'prop-types';
import {
  FormWrapper,
  PanelOption,
  PanelOptionTitle,
  OptionHeadline
} from './form';
import InfoButton from '../../common/info-button';
import FormInput from '../form/form-input';

function LCOEForm (props) {
  const { lcoe, setLcoe, updateStateList, active } = props;
  return (
    <FormWrapper active={active}>
      {lcoe.map((cost, ind) => (
        <PanelOption key={cost.name}>
          <OptionHeadline>
            <PanelOptionTitle>{cost.name}</PanelOptionTitle>

            <InfoButton info='Placeholder text' id={cost.name}>
              Info
            </InfoButton>
          </OptionHeadline>

          <FormInput
            option={cost}
            onChange={(v) =>
              setLcoe(
                updateStateList(lcoe, ind, {
                  ...cost,
                  input: {
                    ...cost.input,
                    value: v
                  }
                })
              )}
          />
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
  updateStateList: T.func,
  active: T.bool
};

export default LCOEForm;
