import React, { useState } from 'react';
import InputRange from 'react-input-range';
import styled from 'styled-components';
import T from 'prop-types';
import { FormInput } from '../../styles/form';

const SliderWrapper = styled.div`
  display:grid;
  grid-template-columns:200px 50px;
  gap: 0 20px;
`;

function SliderGroup (props) {
  const { range, unit } = props;

  const [value, setValue] = useState(range[0]);

  return (
    <SliderWrapper>
      <InputRange minValue={range[0]} maxValue={range[1]} value={value} onChange={(value) => setValue(value)} />
      <FormInput type='text' value={`${value}${unit}`} disabled onChange={(e) => setValue(e.target.value)} />
    </SliderWrapper>
  );
}
SliderGroup.propTypes = {
  range: T.array,
  unit: T.string
};

export default SliderGroup;
