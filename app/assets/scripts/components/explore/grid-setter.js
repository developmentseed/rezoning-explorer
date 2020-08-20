import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import InputRange from 'react-input-range';

import Dropdown from '../common/dropdown';
import { EditButton } from './query-form';
import Button from '../../styles/button/button';
import { themeVal } from '../../styles/utils/general';
import Heading, { Subheading } from '../../styles/type/heading';

const GridSetInner = styled.div`
  padding-bottom: 1rem;
`;

const GridSetHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Labels = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Label = styled(Subheading)``;

const GridSetButton = styled(Button)`
  display: inline-flex;
  user-select: none;
  position: relative;
  transition: color .16s ease-in-out 0s;
  padding: 0.75rem 0;
  color: ${themeVal('color.baseAlphaD')};
  font-weight: ${themeVal('type.heading.weight')};
  &,
  &:visited {
    background-color: transparent;
    color: ${themeVal('color.baseAlphaD')};
  }

  &:hover {
    opacity: 1;
    color: ${themeVal('color.primary')};
    background-color: transparent;
  }


  ${({ active }) => active && css`
      /* stylelint-disable-next-line */
      &,
      &:visited {
        color: ${themeVal('color.primary')};
      }
      /* stylelint-disable-next-line no-duplicate-selectors */
      &::after {
        width: 105%;
      }
    `}
`;

const GridSlider = ({ gridOptions, setGridSize}) => {
  const [value, setValue] = useState(0);
  return (
    <>
      <InputRange
        formatLabel={value => ''}
        minValue={0}
        maxValue={gridOptions.length - 1}
        step={1}
        value={value}
        onChange={(v) => {
          setValue(v)
          setGridSize(gridOptions[v])
        }}
      />
      <Labels>
        {gridOptions.map(opt => <Label key={opt}>{`${opt} km`}<sup>2</sup></Label>)}
      </Labels>
    </>);
};

const DropdownWide = styled(Dropdown)`
  max-width: 20rem;
`;

function GridSetter (props) {
  const { gridOptions, setGridSize } = props;
  const [gridMode, setGridMode] = useState(true);
  return (
    <DropdownWide
      alignment='right'
      direction='down'
      triggerElement={<EditButton title='Edit Grid Size'>Edit Grid Size</EditButton>}
    >
      <GridSetInner>
        <GridSetHeader>
          <GridSetButton
            as='a'
            useIcon={['layout-grid-3x3', 'before']}
            onClick={() => setGridMode(true)}
            active={gridMode}
            size='small'
          > Use Grid
          </GridSetButton>
          <GridSetButton
            as='a'
            useIcon={['globe', 'before']}
            onClick={() => setGridMode(false)}
            active={!gridMode}
            size='small'

          > Use Boundaries
          </GridSetButton>
        </GridSetHeader>
        {gridMode && <GridSlider setGridSize={setGridSize} gridOptions={gridOptions} />}
      </GridSetInner>
    </DropdownWide>

  );
}

export default GridSetter;
