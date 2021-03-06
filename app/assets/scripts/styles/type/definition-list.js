import styled, { css } from 'styled-components';

import { divide } from '../utils/math';
import { themeVal } from '../utils/general';
import { headingAlt } from './heading';

const Dl = styled.dl`
  font-feature-settings: "pnum" 0; /* Use proportional numbers */

  dt {
    ${headingAlt()}
    margin: 0 0 ${divide(themeVal('layout.space'), 4)} 0;
  }

  dd {
    margin: 0 0 ${themeVal('layout.space')} 0;
  }
  ${({ horizontal }) => horizontal && css`
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: ${themeVal('layout.space')};
  `}
`;

export default Dl;
