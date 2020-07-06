import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PanelBlockScroll, PanelBlockHeader } from './panel-block';
import Button from '../../styles/button/button';
const Tab = styled(Button)``;
const TabbedBlockHeader = styled(PanelBlockHeader)``;

function TabbedBlock (props) {
  const { tabContent, children } = props;
  const [activeTab, setActiveTab] = useState(0);
  const [activeContent, setActiveContent] = useState(null);

  useEffect(() => {
    const nextContent = children.length ? children[activeTab] : children
    setActiveContent(nextContent)
  }, [activeTab]);

  return (
    <>
      <TabbedBlockHeader>
        {
          tabContent.map(([name, icon], ind) => (
            <Tab
              key={name}
              active={true}
              useIcon={icon}
              title='Show menu'
              size='large'
              onClick={() => setActiveTab(ind)}
            >
              {name}
            </Tab>)
          )
        }
      </TabbedBlockHeader>
      <PanelBlockScroll>
        {activeContent}
      </PanelBlockScroll>
    </>
  );
}

export default TabbedBlock;
