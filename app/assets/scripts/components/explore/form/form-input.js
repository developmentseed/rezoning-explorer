import React, { useContext, useCallback } from 'react';
import styled from 'styled-components';
import { round } from '../../../utils/format';
import FormContext from '../../../context/form-context';
import T from 'prop-types';

import Dropdown from '../../common/dropdown';
import { truncated } from '../../../styles/helpers';
import { FormCheckable } from '../../../styles/form/checkable';
import { validateRangeNum } from '../../../utils/utils';

import Button from '../../../styles/button/button';
import SliderGroup from '../../common/slider-group';
import ShadowScrollbar from '../../common/shadow-scrollbar';
import StressedFormGroupInput from '../../common/stressed-form-group-input';
import FormSelect from '../../../styles/form/select';
import { FormGroup } from '../../../styles/form/group';

import { INPUT_CONSTANTS } from '../panel-data';

const { SLIDER, BOOL, DROPDOWN, MULTI, TEXT } = INPUT_CONSTANTS;

const MultiSelectButton = styled(Button)`
  width: 100%;
  ${truncated()}
`;

const MultiWrapper = styled(ShadowScrollbar)`
  height: 20rem;
  > .scroll-area {
    > div {
      display: grid;
      grid-template-rows: repeat(auto-fill, minmax(1.5rem, 1fr));
    }
  }
`;

const FormInput = ({ option, onChange }) => {
  const { filterRanges } = useContext(FormContext);

  const { range, value } = option.input;
  let errorMessage;
  if (range) {
    errorMessage =
      range[1] - range[0] === 0
        ? `Allowed value is ${range[0]}`
        : `Allowed range is ${round(range[0])} - ${round(range[1])}`;
  } else {
    errorMessage = 'Value not accepted';
  }

  // Get filter range, if available
  const filterRange =
    option.type === 'filter' ? filterRanges.getData()[option.id] : null;

  switch (option.input.type) {
    case SLIDER:
      return (
        <SliderGroup
          unit={option.input.unit || '%'}
          range={
            filterRange
              ? [round(filterRange.min), round(filterRange.max)]
              : option.input.range
          }
          id={option.name}
          value={option.input.value}
          isRange={option.isRange}
          disabled={!option.active}
          onChange={onChange}
        />
      );
    case TEXT:
      const validate = useCallback(option.input.range ? validateRangeNum(option.input.range[0], option.input.range[1]) : () => true, [option.input.range[0], option.input.range[1]]);
      const up = useCallback(onChange, []);

      return (
        <StressedFormGroupInput
          inputType='number'
          inputSize='small'
          disabled={option.readOnly}
          id={`${option.name}`}
          name={`${option.name}`}
          value={option.input.value}
          validate={validate}
          errorMessage={errorMessage}
          onChange={up}
          validationTimeout={1500}
        />
      );
    case BOOL:
      return null;
    case MULTI:
      return (
        <Dropdown
          triggerElement={
            <MultiSelectButton disabled={!option.active}>
              {' '}
              {option.input.options
                .filter((e, i) => value.includes(i))
                .join(',')}
            </MultiSelectButton>
          }
          alignment='right'
        >
          <MultiWrapper>
            {option.input.options.map((o, i) => (
              <FormCheckable
                key={o}
                name={o}
                id={o}
                type='checkbox'
                checked={value.includes(i)}
                onChange={() => {
                  if (value.includes(i)) {
                    value.splice(value.indexOf(i), 1);
                    onChange(value);
                  } else {
                    onChange([...value, i]);
                  }
                }}
              >
                {o}
              </FormCheckable>
            ))}
          </MultiWrapper>
        </Dropdown>
      );
    case DROPDOWN:
      return (
        <FormGroup>
          <FormSelect
            id={option.name}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            value={option.input.value}
          >
            {option.input.availableOptions.map((o) => {
              return (
                <option value={o} key={o}>
                  {o}
                </option>
              );
            })}
          </FormSelect>
        </FormGroup>
      );
    default:
      return null;
  }
};

FormInput.propTypes = {
  option: T.object,
  onChange: T.func
};

export default FormInput;
