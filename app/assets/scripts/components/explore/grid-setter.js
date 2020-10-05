import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import Dropdown from '../common/dropdown';
import { EditButton } from './query-form';
import Button from '../../styles/button/button';
import { themeVal } from '../../styles/utils/general';
import { FormCheckable } from '../../styles/form/checkable';

const GridSetInner = styled.div`
/* stylelint-disable-next-line */
`;

const GridSetHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

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
const GridSelectorWrapper = styled.div`
  display:flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DropdownWide = styled(Dropdown)`
  max-width: 18rem;
`;

const GridSelector = ({ gridOptions, gridSize, setGridSize }) => {
  return (
    <GridSelectorWrapper>
      {gridOptions.map(opt => (
        <FormCheckable
          key={opt}
          name={`grid-select-${opt}`}
          id={`grid-select-${opt}`}
          type='checkbox'
          checked={gridSize === opt}
          onChange={() => {
            setGridSize(opt);
          }}
        >{opt} km<sup>2</sup>
        </FormCheckable>
      ))}
    </GridSelectorWrapper>
  );
};

function GridSetter (props) {
  const {
    gridOptions,
    setGridSize,
    gridSize,
    setGridMode,
    gridMode,
    disableBoundaries,
    disableGrid
  } = props;
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
            disabled={disableGrid}

          > Use Grid
          </GridSetButton>
          <GridSetButton
            as='a'
            useIcon={['globe', 'before']}
            onClick={() => setGridMode(false)}
            active={!gridMode}
            size='small'
            disabled={disableBoundaries}

          > Use Boundaries
          </GridSetButton>
        </GridSetHeader>
        {gridMode && <GridSelector setGridSize={setGridSize} gridOptions={gridOptions} gridSize={gridSize} />}

      </GridSetInner>
    </DropdownWide>

  );
}

GridSetter.propTypes = {
  gridOptions: T.array.isRequired,
  setGridSize: T.func,
  gridSize: T.number,
  setGridMode: T.func,
  gridMode: T.bool,
  disableBoundaries: T.bool,
  disableGrid: T.bool
};

GridSelector.propTypes = {
  gridOptions: T.array.isRequired,
  setGridSize: T.func,
  gridSize: T.number

};

export default GridSetter;
