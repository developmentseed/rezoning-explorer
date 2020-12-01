import styled from 'styled-components';
import { themeVal } from '../../styles/utils/general';
import { glsp } from '../../styles/utils/theme-values';

export const FormWrapper = styled.section`
  ${({ active }) => {
    if (!active) {
      return 'display: none;';
    }
  }}
`;

export const FormGroupWrapper = styled.div`
  box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
  padding: 1rem 0;

  &:first-of-type {
    padding-top: 0;
  }
`;

export const PanelOption = styled.div`
  ${({ hidden }) => hidden && 'display: none;'}
  margin-bottom: 1.5rem;
`;

export const PanelOptionTitle = styled.div`
  font-weight: ${themeVal('type.base.weight')};
  font-size: 0.875rem;
`;
export const HeadOption = styled.div`
  & ~ & {
    padding-top: ${glsp(0.5)};
  }
  &:last-of-type {
    box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
    padding-bottom: ${glsp(0.5)};
  }
`;

export const HeadOptionHeadline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > :first-child {
    min-width: 5rem;
  }
`;

export const OptionHeadline = styled(HeadOptionHeadline)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  > ${FormSwitch} {
    grid-column-start: 5;
  }
  > ${Button}.info-button {
    grid-column-start: 4;
  }
`;


