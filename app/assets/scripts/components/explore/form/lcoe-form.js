import React from 'react';
import T from 'prop-types';
import { FormWrapper, PanelOption } from './form';

function LCOEForm (props) {
  const {
    lcoe,
    setLcoe,
    inputOfType,
    updateStateList,
    active
  } = props;
  return (
    <FormWrapper
      active={active}
    >
      {lcoe.map((cost, ind) => (
        <PanelOption key={cost.name}>
          {
            inputOfType(cost, (v) => {
              setLcoe(updateStateList(lcoe, ind, {
                ...cost,
                input: {
                  ...cost.input,
                  value: v
                }
              }));
            })
          }
        </PanelOption>
      ))}
    </FormWrapper>

  );
}

LCOEForm.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  name: T.string,
  icon: T.string,
  presets: T.object,
  setPreset: T.func,
  lcoe: T.array,
  setLcoe: T.func,
  inputOfType: T.func,
  updateStateList: T.func,
  active: T.bool
};

export default LCOEForm;
