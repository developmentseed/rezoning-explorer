import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { FormWrapper, FormGroupWrapper, PanelOption, OptionHeadline, PanelOptionTitle } from './form';
import { Accordion, AccordionFold } from '../../../components/accordion';
import collecticon from '../../../styles/collecticons';
import { glsp } from '../../../styles/utils/theme-values';
import Heading from '../../../styles/type/heading';
import { makeTitleCase } from '../../../styles/utils/general';

import InfoButton from '../../common/info-button';
import { FormSwitch } from '../../../styles/form/switch';
import { INPUT_CONSTANTS } from '../panel-data';
const { BOOL } = INPUT_CONSTANTS;

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

/* Filters form
 * @param outputFilters is an array of shape
 *  [
 *    [getFilter1 (value), setFilter1 (func), filter1Object (object) ],
 *    ...
 *  ]
 *  @param presets - required, accessed by parent TabbedBlockBody
 *  @param setPreset - requred, accessed by parent TabbedBlockBody
*/
function FiltersForm (props) {
  const {
    filters,
    inputOfType,
    checkIncluded,
    resource,
    setFilters,
    updateStateList,
    outputFilters,
    active
  } = props;

  return (
    <FormWrapper
      active={active}
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
          /* Output filters, not toggleable */
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
                  {
                    outputFilters.filter(([filterObject, setFilterObject]) => filterObject.active)
                      .map(([filterObject, setFilterObject]) => (
                        <PanelOption key={filterObject.name} hidden={!isFoldExpanded}>
                          <OptionHeadline>
                            <PanelOptionTitle>{`${filterObject.name}`.concat(filterObject.unit ? ` (${filterObject.unit})` : '')}</PanelOptionTitle>
                            {filterObject.info && (
                              <InfoButton info={filterObject.info} id={filterObject.name}>
                                Info
                              </InfoButton>
                            )}
                          </OptionHeadline>
                          {inputOfType(
                            filterObject,
                            (value) => {
                              setFilterObject({
                                ...filterObject,
                                input: {
                                  ...filterObject.input,
                                  value
                                }
                              }
                              );
                            })}
                        </PanelOption>

                      ))
                  }
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
                /* Filters, built as AccordionFolds for each category */
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

FiltersForm.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  presets: T.object,
  setPreset: T.func,
  name: T.string,
  icon: T.string,
  filters: T.array,
  inputOfType: T.func,
  resource: T.string,
  setFilters: T.func,
  updateStateList: T.func,
  outputFilters: T.array,
  checkIncluded: T.func,
  active: T.bool

};

export default FiltersForm;
