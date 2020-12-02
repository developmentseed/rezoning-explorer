import React from 'react';
import T from 'prop-types';
import { FormWrapper, PanelOption, PanelOptionTitle } from './form';

function WeightsForm (props) {
  const {
    weights,
    setWeights,
    inputOfType,
    updateStateList,
    active
  } = props;
  return (
    <FormWrapper
      active={active}
    >
      {weights.map((weight, ind) => (
        <PanelOption key={weight.name}>
          <PanelOptionTitle>{weight.name}</PanelOptionTitle>
          {
            inputOfType(weight, (value) => {
              setWeights(
                updateStateList(weights, ind, {
                  ...weight,
                  input: {
                    ...weight.input,
                    value
                  }
                })
              );
            })
          }
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
  inputOfType: T.func,
  updateStateList: T.func,
  active: T.bool
};

export default WeightsForm;
