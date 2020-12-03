import React from 'react';
import { PropTypes as T } from 'prop-types';

import FormInput from '../../styles/form/input';
import { FormGroupBody, FormGroupHeader, FormGroup } from '../../styles/form/group';
import FormLabel from '../../styles/form/label';

import StressedField from './stressed-field';
import styled from 'styled-components';
import { themeVal } from '../../styles/utils/general';
const ErrorMessage = styled.div`
  color: ${themeVal('color.danger')};
`;
/**
 * From group input structure implementing a stressed field.
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {mixed} value Input value
 * @prop {string} inputType Type of input: number or text
 * @prop {string} inputSize Styled input size option
 * @prop {string} inputVariation Styled input variation option
 * @prop {function} onChange On change event handler
 * @prop {string} placeholder Input placeholder value.
 * @prop {function} validate Validation function callback. Must return boolean
 */
export default function StressedFormGroupInput (props) {
  const {
    id,
    name,
    label,
    value,
    validate,
    inputType,
    inputSize,
    inputVariation,
    placeholder,
    disabled,
    onChange,
    title,
    errorMessage,
    validationTimeout
  } = props;

  return (
    <FormGroup>
      <FormGroupHeader>
        { label && <FormLabel htmlFor={id}>{label}</FormLabel>}
      </FormGroupHeader>
      <FormGroupBody>
        <StressedField
          value={value}
          validate={validate}
          onChange={onChange}
          validationTimeout={validationTimeout}
          render={({
            ref,
            errored,
            value,
            onChangeHandler,
            onBlurHandler
          }) => (
            <>
              <FormInput
                ref={ref}
                type={inputType}
                variation={inputVariation}
                readOnly={disabled}
                name={name}
                id={id}
                invalid={errored}
                stressed={errored}
                size={inputSize}
                value={value}
                onBlur={onBlurHandler}
                onChange={onChangeHandler}
                placeholder={placeholder}
                title={title}
              />
              {errored && (<ErrorMessage>{errorMessage}</ErrorMessage>)}
            </>
          )}
        />
      </FormGroupBody>
    </FormGroup>
  );
}

StressedFormGroupInput.propTypes = {
  id: T.string,
  name: T.string,
  label: T.string,
  value: T.oneOfType([T.string, T.number]),
  inputType: T.oneOf(['number', 'text']),
  inputSize: T.string,
  inputVariation: T.string,
  placeholder: T.oneOfType([T.string, T.number]),
  validate: T.func,
  onChange: T.func,
  disabled: T.bool,
  title: T.string,
  errorMessage: T.string,
  validationTimeout: T.number
};
