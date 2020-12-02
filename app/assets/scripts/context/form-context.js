import React, { createContext } from 'react';
import T from 'prop-types';
const FormContext = createContext({});
export function FormProvider (props) {
  return (
    <>
      <FormContext.Provider
        value={
          {
          }
        }
      >
        {props.children}
      </FormContext.Provider>
    </>
  );
}

FormProvider.propTypes = {
  children: T.node
};

export default FormContext;
