import React, { useCallback } from 'react';
import T from 'prop-types';
import {
  FormWrapper,
  PanelOption,
  PanelOptionTitle,
  OptionHeadline
} from './form';
import InfoButton from '../../common/info-button';
import FormInput from '../form/form-input';
// import updateArrayIndex from '../../../utils/update-array-index';

function LCOEForm (props) {
  const { lcoe, active } = props;
  return (
    <FormWrapper active={active}>
      {lcoe.map(([cost, setCost], ind) => {
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

              <InfoButton info='Placeholder text' id={cost.name}>
              Info
              </InfoButton>
            </OptionHeadline>

            <FormInput
              option={cost}
              onChange={onChange}
            />
          </PanelOption>
        );
      })}
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
  active: T.bool
};

export default LCOEForm;
