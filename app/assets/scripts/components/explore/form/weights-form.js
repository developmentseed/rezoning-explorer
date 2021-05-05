import React, { useState } from 'react';
import T from 'prop-types';
import {
  FormWrapper,
  PanelOption,
  PanelOptionTitle,
  OptionHeadline
} from '../../../styles/form/form';
import FormIntro from './form-intro';
import FormInput from '../form/form-input';
import { distributedDivision, sumBy } from '../../../utils/math';

function updateWeight(weights, id, value) {
  const [w, setValue] = weights.find(([w]) => w.id === id);
  // console.log({ w, value });
  setValue({
    ...w,
    input: {
      ...w.input,
      value: value > 100 ? 1 : value > 0 ? Math.round(value) : 0
    }
  });
}

function WeightsForm(props) {
  const { weights, active } = props;

  const [weightsLocks, setWeightLocks] = useState({});

  function onSliderChange(id, sliderVal) {
    // console.log(id, sliderVal);

    let updatedValuesArray = weights.map(([w]) => {
      return {
        id: w.id,
        locked: typeof weightsLocks[w.id] !== 'undefined' ? weightsLocks[w.id] : false,
        value: id === w.id ? sliderVal : w.input.value
      };
    });
    // console.log({ updatedValuesArray });

    // Sliders to update. Everyone except the disabled ones and the current.
    const slidersToUpdate = updatedValuesArray.filter(
      (slider) => !slider.locked && slider.id !== id && slider.value > 0
    );
    // console.log({ slidersToUpdate });

    // Get by how much is over 100;
    const excess = 100 - sumBy(updatedValuesArray, 'value');
    // By how much we need to update the sliders.
    // Since the steps are integers the deltas is an array with the value to
    // use to update each of the indexes.
    const deltas = distributedDivision(excess, slidersToUpdate.length);
    // console.log({ deltas });

    // Update the values of the other sliders.
    updatedValuesArray = updatedValuesArray.map((slider, i) => {
      // If this slider is not locked, we can update the value
      if (slidersToUpdate.find(s => s.id === slider.id)) {
        const deltaIndex = slidersToUpdate.findIndex(s => s.id === slider.id);
        // Calculate the new value and keep it between 0 - 100.
        const newVal = Math.max(0, Math.min(slider.value + deltas[deltaIndex], 100));
        // If the sliding slider reached 100 then this is 0.
        // Otherwise use the value.
        return {
          ...slider,
          value: newVal
        };
      } else {
        // Otherwise just use the locked value
        return slider;
      }
    });

    // Total of other sliders.
    const otherTotalVal = sumBy(updatedValuesArray, (val) =>
      val.id === id ? 0 : val.value
    );

    // Allowed value to ensure that the sum doesn't go over or below 100.
    const allowedSliderVal = 100 - otherTotalVal;

    // Update active slider
    updateWeight(weights, id, allowedSliderVal);

    // Update other sliders
    slidersToUpdate.forEach((s, i) => {
      updateWeight(weights, s.id, s.value + deltas[i]);
    });
  }

  // console.log(weights);

  return (
    <FormWrapper active={active}>
      <FormIntro
        formTitle='Zone weights'
        introText='Set custom zone weighting parameters to change the calculated zone scores.'
      />
      {weights.map(([weight]) => {
        return (
          <PanelOption key={weight.id}>
            <OptionHeadline>
              <PanelOptionTitle>{weight.name}</PanelOptionTitle>
            </OptionHeadline>
            <FormInput
              isWeight
              onLockChange={(value) => {
                setWeightLocks({
                  ...weightsLocks,
                  [weight.id]: value
                });
              }}
              option={{ ...weight, active: !weightsLocks[weight.id] }}
              onChange={(value) =>
                onSliderChange(weight.id, Math.round(value))}
            />
          </PanelOption>
        );
      })}
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
  active: T.bool,
  disabled: T.bool
};

export default WeightsForm;
