import React, { useCallback, useState } from 'react';
import InputRange from 'react-input-range';
import styled from 'styled-components';
import T from 'prop-types';
import { visuallyHidden } from '../../styles/helpers';
import { validateRangeNum } from '../../utils/utils';
import { truncateDecimals } from '../../utils/format';
import StressedFormGroupInput from './stressed-form-group-input';
import Button from '../../styles/button/button';

const InputLabel = styled.div`
  text-align: ${({ align }) => align || 'left'};
  grid-column: ${({ gridColumn }) => gridColumn || 'auto'};
  font-size: 0.75rem;
`;
const FormSliderGroup = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 0 1rem;
  grid-template-columns: ${({ isRange, hasLock }) =>
    isRange
      ? '4rem 1fr 4rem'
      : hasLock
        ? '1fr 2.5rem 0.5rem 1rem'
        : '1fr 3rem'
  };
  
  label {
    ${visuallyHidden()}
  }

  > p {
    align-self: flex-end;
    margin-left: -0.75rem;
  }
`;

const LockButton = styled(Button)`
  justify-self: center;
  align-self: flex-end;
`;

function SliderGroup (props) {
  const { range, id, value, onChange, disabled, isRange, isWeight, hasInput, hasLock, onLockChange } = props;

  const [locked, setLocked] = useState(false);

  const validateTop = useCallback(
    validateRangeNum(value.min || range[0], range[1])
    , [value.min]);

  const fgTopOnChange = useCallback((val) => {
    const update = isRange ? { ...value, max: Number(val) } : Number(val);
    onChange(update);
  }, [onChange, value.min, value.max]);

  const validateLow = useCallback(
    validateRangeNum(range[0], value.max)
    , [value.max]);

  const fgBottomOnChange = useCallback((val) => {
    onChange({ ...value, min: Number(val) });
  }, [onChange, value.max, value.min]);

  return (
    <FormSliderGroup isRange={isRange} hasLock={hasLock}>
      { isRange &&
      <StressedFormGroupInput
        inputType='number'
        inputSize='small'
        id={`slider-input-min-${id}`}
        name={`slider-input-min-${id}}`}
        label='Min value'
        value={truncateDecimals(value.min === undefined ? value : value.min)}
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

      {
        hasInput && !disabled &&
      <StressedFormGroupInput
        inputType='number'
        inputSize='small'
        id={`slider-input-max-${id}`}
        name={`slider-input-max-${id}}`}
        label='Max value'
        value={truncateDecimals(value.max === undefined ? value : value.max)}
        disabled={disabled}
        validate={validateTop}
        onChange={fgTopOnChange}
        title={disabled ? 'Enable this input to interact' : ''}
      />
      }

      {
      // Force render of disabled input field for locked inputs
      // FIXME: Remove, and fix disabled in line 89 above
        hasLock && disabled &&
      <StressedFormGroupInput
        inputType='number'
        inputSize='small'
        id={`slider-input-max-${id}`}
        name={`slider-input-max-${id}}`}
        label='Max value'
        value={truncateDecimals(value.max === undefined ? value : value.max)}
        disabled={true}
        validate={validateTop}
        onChange={fgTopOnChange}
        title={disabled ? 'Enable this input to interact' : ''}
      />
      }
      {isWeight && <p>%</p>}

      {
        hasLock &&
        <LockButton
          id='layer-visibility'
          size='small'
          variation={!locked ? 'base-plain' : 'primary-plain'}
          useIcon={!locked ? 'lock-open' : 'lock'}
          title={!locked ? 'Lock this slider' : 'Unlock this slider'}
          hideText
          onClick={
            () => {
              onLockChange(!locked);
              setLocked(!locked);
            }
          }
        />
      }
      { isRange &&
    <>
      <InputLabel>From</InputLabel>
      <InputLabel align='right' gridColumn='3'>To</InputLabel>
    </>}
    </FormSliderGroup>
  );
}
SliderGroup.propTypes = {
  range: T.array,
  id: T.string,
  onChange: T.func,
  value: T.oneOfType([T.string, T.number, T.object]),
  disabled: T.bool,
  isRange: T.bool,
  isWeight: T.bool,
  hasInput: T.bool,
  hasLock: T.bool,
  onLockChange: T.func
};

export default SliderGroup;
