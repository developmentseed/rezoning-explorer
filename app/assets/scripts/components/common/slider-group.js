import React from 'react';
import InputRange from 'react-input-range';
import styled from 'styled-components';
import T from 'prop-types';
import { visuallyHidden } from '../../styles/helpers';
import { validateRangeNum } from '../../utils/utils';
import StressedFormGroupInput from './stressed-form-group-input';

const FormSliderGroup = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  grid-template-columns: ${({ isRange }) => isRange ? '3rem 1fr 3rem' : '1fr 3rem'};

  label {
    ${visuallyHidden()}
  }
`;

function SliderGroup (props) {
  const { range, id, value, onChange, disabled, isRange } = props;
  return (
    <FormSliderGroup isRange={isRange}>
      {isRange &&
      <StressedFormGroupInput
        inputType='number'
        inputSize='small'
        id={`slider-input-min-${id}`}
        name={`slider-input-min-${id}}`}
        label='Min value'
        value={value.min}
        disabled={disabled}
        validate={validateRangeNum(range[0], value.max)}
        onChange={(val) => {
          onChange({ ...value, min: val });
        }}
        title={disabled ? 'Enable this input to interact' : ''}
      />}

      <InputRange minValue={range[0]} maxValue={range[1]}
        step={range[1] > 1 ? 1 : 0.1}
      value={value} onChange={onChange} disabled={disabled} />

      <StressedFormGroupInput
        inputType='number'
        inputSize='small'
        id={`slider-input-max-${id}`}
        name={`slider-input-max-${id}}`}
        label='Max value'
        value={value.max || value}
        disabled={disabled}
        validate={validateRangeNum(value.min || range[0], range[1])}
        onChange={(val) => {
          const update = isRange ? { ...value, max: val } : val;
          onChange(update);
        }}
        title={disabled ? 'Enable this input to interact' : ''}
      />
    </FormSliderGroup>
  );
}
SliderGroup.propTypes = {
  range: T.array,
  id: T.string,
  onChange: T.func,
  value: T.oneOfType([T.string, T.number, T.object]),
  disabled: T.bool,
  isRange: T.bool
};

export default SliderGroup;
