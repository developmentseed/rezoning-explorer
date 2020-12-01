import React from 'react';
import { FormWrapper, FormGroupWrapper } from './form';
import { Accordion, AccordionFold } from '../../components/accordion';
import collecticon from '../../styles/collecticons';
import { glsp } from '../../styles/utils/theme-values';
import styled from 'styled-components';
import Heading  from '../../styles/type/heading';
import { makeTitleCase } from '../../styles/utils/general';

const AccordionFoldTrigger = styled.a`
  display: flex;
  align-items: center;
  margin: -${glsp(0.5)} -${glsp()};
  padding: ${glsp(0.5)} ${glsp()};

  &,
  &:visited {
    color: inherit;
  }
  &:active {
    transform: none;
  }
  &:after {
    ${collecticon('chevron-down--small')}
    margin-left: auto;
    transition: transform 240ms ease-in-out;
    transform: ${({ isExpanded }) =>
      isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;


function FiltersForm (props) {
  const {
    preset,
    setPreset,
    filters
  } = props;
  return (
    <FormWrapper
      name='filters'
      icon='filter'
      presets={preset}
      setPreset={setPreset}
    >

      <Accordion
        initialState={[
          true,
          ...filters.reduce((seen, filt) => {
            if (!seen.includes(filt.category)) {
              seen.push(filt);
            }
            return seen;
          }, [])
            .slice(1)
            .map((_) => false)
        ]}
        foldCount={Object.keys(filters).length + 1}
        allowMultiple
      >
        {({ checkExpanded, setExpanded }) => (
          <>
            <AccordionFold
              forwardedAs={FormGroupWrapper}
              isFoldExpanded={checkExpanded(0)}
              setFoldExpanded={(v) => setExpanded(0, v)}
              renderHeader={({ isFoldExpanded, setFoldExpanded }) => (
                <AccordionFoldTrigger
                  isExpanded={isFoldExpanded}
                  onClick={() => setFoldExpanded(!isFoldExpanded)}
                >
                  <Heading size='small' variation='primary'>
                    {makeTitleCase('Output Filters')}
                  </Heading>
                </AccordionFoldTrigger>
              )}
              renderBody={({ isFoldExpanded }) => (
                <>
                  <PanelOption hidden={!isFoldExpanded}>
                    <OptionHeadline>
                      <PanelOptionTitle>{maxZoneScoreO.name}</PanelOptionTitle>
                      {maxZoneScoreO.info && (
                        <InfoButton info={maxZoneScoreO.info} id={maxZoneScoreO.name}>
                                Info
                        </InfoButton>
                      )}
                    </OptionHeadline>
                    {inputOfType({
                      ...maxZoneScoreO,
                      input: {
                        ...maxZoneScoreO.input,
                        value: maxZoneScore
                      }
                    }, ({ min, max }) => {
                      setMaxZoneScore({ min: round(min), max: round(max) });
                    })}
                  </PanelOption>

                  {/* <PanelOption hidden={!isFoldExpanded}>
                        <OptionHeadline>
                          <PanelOptionTitle>{maxLCOEO.name}</PanelOptionTitle>
                          {maxLCOEO.info && (
                            <InfoButton info={maxLCOEO.info} id={maxLCOEO.name}>
                                Info
                            </InfoButton>
                          )}
                        </OptionHeadline>
                        {inputOfType({
                          ...maxLCOEO,
                          input: {
                            ...maxLCOEO.input,
                            value: maxLCOE
                          }
                        }, ({ min, max }) => {
                          setMaxLCOE({ min: round(min), max: round(max) });
                        })}
                      </PanelOption> */}
                </>
              )}
            />

            {Object.entries(filters.reduce((accum, filt) => {
              if (!accum[filt.category]) {
                accum[filt.category] = [];
              }
              accum[filt.category].push(filt);
              return accum;
            }, {}))
              .map(([group, list], idx) => {
                idx += 1;
                return (
                  <AccordionFold
                    key={group}
                    forwardedAs={FormGroupWrapper}
                    isFoldExpanded={checkExpanded(idx)}
                    setFoldExpanded={(v) => setExpanded(idx, v)}
                    renderHeader={({ isFoldExpanded, setFoldExpanded }) => (
                      <AccordionFoldTrigger
                        isExpanded={isFoldExpanded}
                        onClick={() => setFoldExpanded(!isFoldExpanded)}
                      >
                        <Heading size='small' variation='primary'>
                          {makeTitleCase(group.replace(/_/g, ' '))}
                        </Heading>
                      </AccordionFoldTrigger>
                    )}
                    renderBody={({ isFoldExpanded }) =>
                      list.map((filter, ind) => (
                        checkIncluded(filter, resource) &&
                        <PanelOption key={filter.name} hidden={!isFoldExpanded}>
                          <OptionHeadline>
                            <PanelOptionTitle>{`${filter.name}`.concat(filter.unit ? ` (${filter.unit})` : '')}</PanelOptionTitle>
                            {filter.info && (
                              <InfoButton info={filter.info} id={filter.name}>
                                Info
                              </InfoButton>
                            )}
                            <FormSwitch
                              hideText
                              name={`toggle-${filter.name.replace(/ /g, '-')}`}
                              disabled={filter.disabled}
                              checked={filter.active}
                              onChange={() => {
                                const ind = filters.findIndex(f => f.id === filter.id);
                                setFilters(updateStateList(filters, ind, {
                                  ...filter,
                                  active: !filter.active,
                                  input: {
                                    ...filter.input,
                                    value: filter.input.type === BOOL ? !filter.active : filter.input.value
                                  }
                                }));
                              }}
                            >
                              Toggle filter
                            </FormSwitch>
                          </OptionHeadline>
                          {
                            inputOfType(filter, (value) => {
                              if (filter.active) {
                                const ind = filters.findIndex(f => f.id === filter.id);
                                setFilters(updateStateList(filters, ind, {
                                  ...filter,
                                  input: {
                                    ...filter.input,
                                    value
                                  }

                                }));
                              }
                            })
                          }

                        </PanelOption>
                      ))}
                  />
                );
              })}
          </>
        )}
      </Accordion>
    </FormWrapper>

  );
}

export default FiltersForm;
