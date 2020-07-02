import styled from 'styled-components';
import * as BaseForm from '@devseed-ui/form';
import { themeVal } from '@devseed-ui/base';

/* stylelint-disable */
const Form = styled(BaseForm.Form)`
  color: ${themeVal('color.baseDark')}
`;

const FormInput = styled(BaseForm.FormInput)`
  color: ${themeVal('color.baseDark')}

`;
const FormSelect = styled(BaseForm.FormSelect)`
  color: ${themeVal('color.baseDark')}
`;

export { Form, FormSelect, FormInput };
