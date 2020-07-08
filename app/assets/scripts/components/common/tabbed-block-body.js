import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { PanelBlockScroll, PanelBlockHeader } from './panel-block';
import Button from '../../styles/button/button';
const Tab = styled(Button)`
  flex: 1;
`;
const TabbedBlockHeader = styled(PanelBlockHeader)`
  display: flex;
  flex-direction: row;
`;

const ContentInner = styled.div`
  padding: 1rem;
`;

function TabbedBlock (props) {
  const { tabContent } = props;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <TabbedBlockHeader>
        {
          tabContent.map(([name, icon], ind) => (
            <Tab
              key={name}
              active={ind === activeTab}
              useIcon={icon}
              title='Show menu'
              size='small'
              onClick={() => setActiveTab(ind)}
            >
              {name}
            </Tab>)
          )
        }
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
