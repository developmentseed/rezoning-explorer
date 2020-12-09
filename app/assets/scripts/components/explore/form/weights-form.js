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
import updateArrayIndex from '../../../utils/update-array-index';

function WeightsForm (props) {
  const { weights, setWeights, active } = props;
  return (
    <FormWrapper active={active}>
      {weights.map((weight, ind) => (
        <PanelOption key={weight.name}>
          <OptionHeadline>
            <PanelOptionTitle>{weight.name}</PanelOptionTitle>
            <InfoButton info={weight.info} id={weight.name}>
              Info
            </InfoButton>
          </OptionHeadline>
          <FormInput
            option={weight}
            onChange={(value) => {
              setWeights(
                updateArrayIndex(weights, ind, {
                  ...weight,
                  input: {
                    ...weight.input,
                    value
                  }
                })
              );
            }}
          />
        </PanelOption>
      ))}
    </FormWrapper>
  );
}

WeightsForm.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  name: T.string,
  icon: T.string,
  presets: T.object,
  setPreset: T.func,
  weights: T.array,
  setWeights: T.func,
  active: T.bool
};

export default WeightsForm;
