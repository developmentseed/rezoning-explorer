import React, { useState } from 'react';
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

  const [value, setValue] = useState(0);

  return (
    <SliderWrapper>
      <FormInput type='range' min={range[0]} max={range[1]} value={value} onChange={(e) => setValue(e.target.value)} />
      <FormInput type='text' value={`${value}${unit}`} disabled onChange={(e) => setValue(e.target.value)} />
    </SliderWrapper>
  );
}
SliderGroup.propTypes = {
  range: T.array,
  unit: T.string
};

export default SliderGroup;
