import React, { useState, useEffect, Children } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { PanelBlockScroll, PanelBlockHeader } from './panel-block';
import Button from '../../styles/button/button';
import { Subheading } from '../../styles/type/heading';
import { listReset, truncated } from '../../styles/helpers';
import { themeVal } from '../../styles/utils/general';
import Dropdown, { DropMenu, DropMenuItem } from './dropdown';

const Tab = styled(Button)`
  display: inline-flex;
  user-select: none;
  position: relative;
  transition: color .16s ease-in-out 0s;
  padding: 0.75rem 0;
  color: ${themeVal('color.base')};
  font-weight: ${themeVal('type.heading.weight')};
  &,
  &:visited {
    background-color: transparent;
    color: ${themeVal('color.base')};
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

const TabControlBar = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  padding-bottom: 1.5rem;
  > ${Subheading} {
    grid-column: span 5;
  }

  > ${Button}.drop-trigger {
    grid-column: 1 / 4;
    padding-left: 0;
    text-transform: none;
    text-align: left;
    > span {
      ${truncated()}
      max-width: 80%;
    }
    &,
    &:hover,
    &:active,
    &.active {
      background-color: initial;
    }
  }

  > ${Button}.preset-reset {
    grid-column: 4 / -1;
  }

  ${({ active }) => {
      if (!active) { return 'display: none;'; }
    }
  }
`;

const PresetMenu = styled(DropMenu)`
  padding: 0;
  font-size: 0.875rem;
`;

const ContentInner = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  flex: 1;
`;

function TabbedBlock (props) {
  const { children } = props;
  const childArray = Children.toArray(children);
  const [activeTab, setActiveTab] = useState(0);
  const [activeContent, setActiveContent] = useState(childArray[activeTab]);
  const [presetValue, setPresetValue] = useState(childArray.map(_ => 'Select'));

  useEffect(() => {
    setActiveContent(childArray[activeTab]);
  }, [activeTab]);

  return (
    <>
      <TabbedBlockHeader as='nav' role='navigation'>
        <ul>
          {
            Children.map(children, (child, ind) => {
              const { name, icon, disabled } = child.props;
              return (
                <li key={name}>
                  <Tab
                    as='a'
                    id={`${name.toLowerCase()}-tab`}
                    active={ind === activeTab}
                    useIcon={icon}
                    title='Show menu'
                    size='small'
                    disabled={disabled}
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
                  {activeContent.props.presets &&

                  <TabControlBar
                    active={active}
                  >
                    <Subheading>Preset</Subheading>
                    <Dropdown
                      alignment='left'
                      triggerElement={
                        <Button
                          size='small'
                          className='drop-trigger'
                          variation='primary-plain'
                          useIcon={['chevron-down--small', 'after']}
                        >
                          {presetValue[i]}
                        </Button>
                      }
                    >
                      <PresetMenu>
                        {
                          Object.keys(activeContent.props.presets).map(preset => (
                            <DropMenuItem
                              key={preset}
                              onClick={() => {
                                activeContent.props.setPreset(preset);
                                presetValue[i] = preset;
                                setPresetValue(presetValue);
                                Dropdown.closeAll();
                              }}
                            >
                              {preset}
                            </DropMenuItem>
                          ))
                        }
                      </PresetMenu>
                    </Dropdown>

                    <Button
                      type='reset'
                      size='small'
                      className='preset-reset'
                      onClick={() => {
                        activeContent.props.setPreset('reset');
                        presetValue[i] = 'Select';
                        setPresetValue(presetValue);
                      }}
                      variation='base-raised-light'
                      useIcon='arrow-loop'
                    >
                        Reset
                    </Button>
                  </TabControlBar>}

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
