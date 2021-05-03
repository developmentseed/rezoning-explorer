import React, { useCallback } from 'react';
import T from 'prop-types';
import {
  FormWrapper,
  PanelOption,
  PanelOptionTitle,
  OptionHeadline
} from '../../../styles/form/form';
import FormIntro from './form-intro';
import InfoButton from '../../common/info-button';
import FormInput from '../form/form-input';
import { distributedDivision, sumBy } from '../../../utils/math';

function WeightsForm(props) {
  const { weights, active } = props;

  function onSliderChange(id, sliderVal) {
    console.log(id, sliderVal);

    // Get all current values with changed applied
    // const updatedValues = weights.reduce((acc, [w]) => {
    //   acc[w.id] = id === w.id ? sliderVal : w.input.value;
    //   return acc;
    // }, {});
    let updatedValuesArray = weights.map(([w]) => {
      return {
        id: w.id,
        locked: false,
        value: (id === w.id ? sliderVal : w.input.value) * 100
      };
    });
    console.log({ updatedValuesArray });
    // const { values, onChange } = this.props
    // Update the values so we're working with updated data.
    // let updatedVals = updateValueProp(values, id, 'value', sliderVal)
    // const updatedValsArray = objectToArray(updatedVals)

    // // Sliders to update. Everyone except the disabled ones and the current.
    const slidersToUpdate = updatedValuesArray.filter(
      (slider) => !slider.locked && slider.id !== id && slider.value > 0
    );
    console.log({ slidersToUpdate });

    // // Get by how much is over 100;
    const excess = 100 - sumBy(updatedValuesArray, 'value');
    console.log({ excess });
    // // By how much we need to update the sliders.
    // // Since the steps are integers the deltas is an array with the value to
    // // use to update each of the indexes.
    const deltas = distributedDivision(excess, slidersToUpdate.length);
    console.log({ deltas });

    // Update the values of the other sliders.
    updatedValuesArray = slidersToUpdate.map((slider, i) => {
      // Calculate the new value and keep it between 0 - 100.
      const newVal = Math.max(0, Math.min(slider.value + deltas[i], 100));
      // If the sliding slider reached 100 then this is 0.
      // Otherwise use the value.
      return {
        slider,
        value: newVal
      };
    });
    console.log({ updatedValuesArray });

    // Total of other sliders.
    // const otherTotalVal = sumBy(objectToArray(updatedVals), (val) =>
    //   val.__key === id ? 0 : val.value
    // );
    // // Allowed value to ensure that the sum doesn't go over or below 100.
    // const allowedSliderVal = 100 - otherTotalVal;
    // updatedVals = updateValueProp(updatedVals, id, 'value', allowedSliderVal);

    // // Trigger change.
    // onChange(updatedVals);
  }

  console.log(weights);

  return (
    <FormWrapper active={active}>
      <FormIntro
        formTitle='Zone weights'
        introText='Set custom zone weighting parameters to change the calculated zone scores.'
      />
      {weights.map(([weight, setWeight], ind) => {
        const onChange = useCallback(
          (value) => {
            setWeight({
              ...weight,
              input: {
                ...weight.input,
                value
              }
            });
          },
          [weights]
        );

        return (
          <PanelOption key={weight.name}>
            <OptionHeadline>
              <PanelOptionTitle>{weight.name}</PanelOptionTitle>
              <InfoButton info={weight.info} id={weight.name}>
                Info
              </InfoButton>
            </OptionHeadline>
            <FormInput
              option={weight}
              onChange={(value) => onSliderChange(weight.id, value)}
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
