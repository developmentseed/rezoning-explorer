import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Subheading } from '../../styles/type/heading';

const TableContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr 4fr;
`;
const TableHeader = styled.div`
  /* stylelint-disable */
`;

const TableBody = styled.div`
  /* stylelint-enable */
`;

const TableList = styled.ul`
  display: grid;
  grid-template-columns: ${({ dimension }) => `repeat( ${dimension[0]}, 1fr)`};
  grid-template-rows: ${({ dimension }) => `repeat( ${dimension[1]}, 1fr)`};
  gap: ${({ gap }) => `${gap}rem`};
`;

const TableCell = styled.li`
  /* stylelint-disable-next-ine */
`;

function Table (props) {
  const { title, data, dimension, gap, renderCell } = props;

  return (
    <TableContainer>
      <TableHeader>
        <Subheading>{title}</Subheading>
      </TableHeader>
      <TableBody>
        <TableList
          dimension={dimension}
          gap={gap}
        >
          {data.map((datum, i) => (
            <TableCell key={`${datum.label}-${i + 1}`}>
              {renderCell(datum)}
            </TableCell>
          ))}
        </TableList>
      </TableBody>
    </TableContainer>

  );
}

Table.propTypes = {
  title: T.string,
  data: T.array,
  dimension: T.array,
  gap: T.number,
  renderCell: T.func
};

export default Table;
