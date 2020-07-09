import React, { useState } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { PanelBlockScroll, PanelBlockHeader } from './panel-block';
import Button from '../../styles/button/button';
import { listReset } from '../../styles/helpers/index';
import { themeVal } from '../../styles/utils/general';

const Tab = styled(Button)`
  display: inline-flex;
  user-select: none;
  position: relative;
  transition: color .16s ease-in-out 0s;
  padding: 0.75rem 0;
  color: ${themeVal('color.baseAlphaD')};

  &,
  &:visited {
    background-color: transparent;
    color: ${themeVal('color.baseAlphaD')};
  }

  &:hover {
    opacity: 1;
    color: ${themeVal('color.base')};
    background-color: transparent;
  }

  &::after {
    position: absolute;
    margin: 0;
    bottom: 0;
    left: 50%;
    content: '';
    width: 0;
    height: 2px;
    background: ${themeVal('color.base')};
    transform: translate(-50%, 0);

    /* Animation */
    transition: width 0.24s ease-in-out 0s;
  }

  ${({ active }) => active && css`
      &,
      &:visited {
        color: ${themeVal('color.base')};
      }
      /* stylelint-disable-next-line no-duplicate-selectors */
      &::after {
        width: 105%;
      }
    `}
`;

const TabbedBlockHeader = styled(PanelBlockHeader)`
  padding: 0 1rem;
  ul {
    ${listReset}
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
`;

const ContentInner = styled.div`
  padding: 1.5rem 1rem;
`;

function TabbedBlock (props) {
  const { tabContent } = props;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <TabbedBlockHeader as='nav' role='navigation'>
        <ul>
          {
            tabContent.map(([name, icon], ind) => (
              <li key={name}>
                <Tab
                  as='a'
                  active={ind === activeTab}
                  useIcon={icon}
                  title='Show menu'
                  size='small'
                  onClick={() => setActiveTab(ind)}
                >
                  {name}
                </Tab>
              </li>)
            )
          }
        </ul>
      </TabbedBlockHeader>
      <PanelBlockScroll>
        <ContentInner>
          {props.children.length ? props.children[activeTab] : props.children}
        </ContentInner>
      </PanelBlockScroll>
    </>
  );
}

TabbedBlock.propTypes = {
  tabContent: T.array,
  children: T.array
};
export default TabbedBlock;
