import React, { useCallback } from 'react';
import InputRange from 'react-input-range';
import styled from 'styled-components';
import T from 'prop-types';
import { visuallyHidden } from '../../styles/helpers';
import { validateRangeNum } from '../../utils/utils';
import { truncateDecimals } from '../../utils/format';
import StressedFormGroupInput from './stressed-form-group-input';

const FormSliderGroup = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 1rem;
  grid-template-columns: ${({ isRange }) => isRange ? '3rem 1fr 4rem' : '1fr 3rem'};
  
  label {
    ${visuallyHidden()}
  }
`;

function SliderGroup (props) {
  const { range, id, value, onChange, disabled, isRange } = props;

  const validateTop = useCallback(
    validateRangeNum(value.min || range[0], range[1])
    , [value]);

  const fgTopOnChange = useCallback((val) => {
    const update = isRange ? { ...value, max: val } : val;
    onChange(update);
  }, [value]);

  const validateLow = useCallback(
    validateRangeNum(range[0], value.max)
    , [value]);

  const fgBottomOnChange = useCallback((val) => {
    onChange({ ...value, min: val });
  }, [value]);

  return (
    <FormSliderGroup isRange={isRange}>
      {isRange &&
      <StressedFormGroupInput
        inputType='number'
        inputSize='small'
        id={`slider-input-min-${id}`}
        name={`slider-input-min-${id}}`}
        label='Min value'
        value={truncateDecimals(value.min)}
        disabled={disabled}
        validate={validateLow}
        onChange={fgBottomOnChange}
        title={disabled ? 'Enable this input to interact' : ''}
      />}

      <InputRange
        minValue={truncateDecimals(range[0])}
        maxValue={truncateDecimals(range[1])}
        step={(range[1] % 1 !== 0 || range[1] <= 1) ? 0.01 : 1}
        value={Number(value) ? truncateDecimals(value) : value}
        onChange={onChange}
        disabled={disabled}
      />

      <StressedFormGroupInput
        inputType='number'
        inputSize='small'
        id={`slider-input-max-${id}`}
        name={`slider-input-max-${id}}`}
        label='Max value'
        value={truncateDecimals(value.max || value)}
        disabled={disabled}
        validate={validateTop}
        onChange={fgTopOnChange}
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
