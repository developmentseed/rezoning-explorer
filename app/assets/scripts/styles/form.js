import styled from 'styled-components';
import * as BaseForm from '@devseed-ui/form';
import { themeVal } from '@devseed-ui/base';

/* stylelint-disable */
const Form = styled(BaseForm.Form)`
  color: ${themeVal('color.darkgray')}
`;

const FormInput = styled(BaseForm.FormInput)`
  color: ${themeVal('color.darkgray')}

`;
const FormSelect = styled(BaseForm.FormSelect)`
  color: ${themeVal('color.darkgray')}
`;

export { Form, FormSelect, FormInput };
