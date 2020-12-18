import React, { useCallback } from 'react';
import T from 'prop-types';
import {
  FormWrapper,
  FormHeader,
  PanelOption,
  PanelOptionTitle,
  OptionHeadline
} from './form';
import InfoButton from '../../common/info-button';
import FormInput from '../form/form-input';

function WeightsForm (props) {
  const { weights, active } = props;
  return (
    <FormWrapper active={active}>
      <FormHeader>
        <h4>
          Zone Weighting Criteria
        </h4>
        <details>
          <summary>
          Adjusting the weights of...
          </summary>
          <p>parameters to change the calculated aggregated zone scores.</p>
        </details>
      </FormHeader>
      {weights.map(([weight, setWeight], ind) => {
        const onChange = useCallback(
          (value) => {
            setWeight(
              {
                ...weight,
                input: {
                  ...weight.input,
                  value
                }
              }
            );
          }
          , [weights]);

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
              onChange={onChange}
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
  active: T.bool
};

export default WeightsForm;
