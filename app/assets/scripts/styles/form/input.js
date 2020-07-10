import styled from 'styled-components';
import controlSkin from './control-skin';
import { themeVal } from '../utils/general';

const FormInput = styled.input.attrs(props => ({
  size: props.size || 'medium'
}))`
  ${controlSkin()}

  /* Type number control
     Remove number arrows form numeric text fields
   ========================================================================== */
  &[type="number"] {
    /* stylelint-disable-next-line */
    -moz-appearance: textfield;
    text-align: right;
    font-family: ${themeVal('type.mono.family')};
  
    /* Webkit specific */
  
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      /* stylelint-disable-next-line */
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export default FormInput;
