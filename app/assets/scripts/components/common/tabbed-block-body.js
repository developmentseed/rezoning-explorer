import React, { useState, useEffect, Children } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { PanelBlockScroll, PanelBlockHeader } from './panel-block';
import Button from '../../styles/button/button';
import { Subheading } from '../../styles/type/heading';
import { listReset } from '../../styles/helpers/index';
import { themeVal } from '../../styles/utils/general';

import FormSelect from '../../styles/form/select';

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
    color: ${themeVal('color.primary')};
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
    background: ${themeVal('color.primary')};
    transform: translate(-50%, 0);

    /* Animation */
    transition: width 0.24s ease-in-out 0s;
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

const TabbedBlockHeader = styled(PanelBlockHeader)`
  padding: 0 1.5rem;
  ul {
    ${listReset}
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
`;

const PresetSelect = styled(FormSelect)`  
  /* stylelint-disable-next-line */
`;
:xa

const TabControlBar = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  > ${Subheading} {
    grid-column: span 5;
  }

  > ${PresetSelect} {
    grid-column: 1 / span 3;
  }

  > ${Button} {
    grid-column: 4 / -1;
  }

  ${({ active }) => {
      if (!active) { return 'display: none;'; }
    }
  }
`;

const ContentInner = styled.div`
  padding: 1.5rem;
`;

function TabbedBlock (props) {
  const { children } = props;
  const childArray = Children.toArray(children);
  const [activeTab, setActiveTab] = useState(0);
  const [activeContent, setActiveContent] = useState(childArray[activeTab]);
  const [presetValue, setPresetValue] = useState(childArray.map(_ => 'default'));

  useEffect(() => {
    setActiveContent(childArray[activeTab]);
  }, [activeTab]);

  return (
    <>
      <TabbedBlockHeader as='nav' role='navigation'>
        <ul>
          {
            Children.map(children, (child, ind) => {
              const { name, icon } = child.props;
              return (
                <li key={name}>
                  <Tab
                    as='a'
                    active={ind === activeTab}
                    useIcon={icon}
                    title='Show menu'
                    size='small'
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(ind);
                    }}
                  >
                    {name}
                  </Tab>
                </li>
              );
            })
          }
        </ul>
      </TabbedBlockHeader>
      <PanelBlockScroll>
        <ContentInner>

          {
            Children.map(children, (child, i) => {
              const active = i === activeTab;
              return (
                <>
                  <TabControlBar
                    active={active}
                  >
                    <Subheading>Preset Priority</Subheading>
                    <PresetSelect
                      value={presetValue[i]}
                      onChange={({ target }) => {
                        activeContent.props.setPreset(target.value);
                        presetValue[i] = target.value;
                        setPresetValue(presetValue);
                      }}
                    >
                      <option key='default' value='default' disabled>Select</option>
                      {
                        Object.keys(activeContent.props.presets).map(preset => (
                          <option key={preset} value={preset}>{preset}</option>
                        ))
                      }
                    </PresetSelect>
                    <Button
                      type='reset'
                      size='small'
                      onClick={() => {
                        activeContent.props.setPreset('reset');
                        presetValue[i] = 'default';
                        setPresetValue(presetValue);
                      }}
                      variation='base-raised-light'
                      useIcon='arrow-loop'
                    >
                        Reset
                    </Button>
                  </TabControlBar>

                  {React.cloneElement(child, { active: active })}
                </>
              );
            })
          }
        </ContentInner>
      </PanelBlockScroll>
    </>
  );
}

TabbedBlock.propTypes = {
  children: T.node.isRequired
};
export default TabbedBlock;
