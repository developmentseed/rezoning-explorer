import React, { useCallback } from 'react';
import T from 'prop-types';

import {
  FormWrapper,
  FormGroupWrapper,
  PanelOption,
  OptionHeadline,
  PanelOptionTitle,
  EmptyState
} from '../../../styles/form/form';
import FormIntro from './form-intro';
import { Accordion, AccordionFold, AccordionFoldTrigger } from '../../../components/accordion';
import Heading from '../../../styles/type/heading';
import { makeTitleCase } from '../../../styles/utils/general';

import InfoButton from '../../common/info-button';
import { FormSwitch } from '../../../styles/form/switch';
import { INPUT_CONSTANTS } from '../panel-data';

import FormInput from './form-input';

const { BOOL } = INPUT_CONSTANTS;

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
    checkIncluded,
    resource,
    active,
    disabled
  } = props;

  return (
    <>
      {disabled && (
        <EmptyState>
          Select Area and Resource to view and interact with input parameters.
        </EmptyState>
      )}
      <FormWrapper active={active} disabled={disabled}>
        <FormIntro
          formTitle='Spatial Filters'
          introText='This step identifies areas suitable for solar PV (or wind or offshore wind) development by applying spatial filters. Suitable areas will then be used to generate solar energy zones, which can be scored with user-provided weights and economic assumptions.'
        />
        <Accordion
          initialState={[
            true,
            ...filters
              .reduce((seen, [filt, setFilt]) => {
                if (!seen.includes(filt.category)) {
                  seen.push(filt);
                }
                return seen;
              }, [])
              .slice(1)
              .map((_) => false)
          ]}
          // foldCount={Object.keys(filters).length + 1}
          allowMultiple
        >
          {({ checkExpanded, setExpanded }) => (
            <>
              {Object.entries(
                filters.reduce((accum, filt) => {
                  const [get] = filt;
                  if (!accum[get.category]) {
                    accum[get.category] = [];
                  }
                  accum[get.category].push(filt);
                  return accum;
                }, {})
              ).map(([group, list], idx) => {
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
                      list
                        .sort(([a, _a], [b, _b]) => {
                          return a.priority - b.priority;
                        })
                        .filter(
                          ([f, _]) => f.input.range[0] !== f.input.range[1]
                        )
                        .map(([filter, setFilter], ind) => {
                          const inputOnChange = useCallback(
                            (value) => {
                              if (filter.active) {
                                setFilter({
                                  ...filter,
                                  input: {
                                    ...filter.input,
                                    value
                                  }
                                });
                              }
                            },

                            [filter]
                          );

                          const switchOnChange = useCallback(() => {
                            setFilter({
                              ...filter,
                              active: !filter.active,
                              input: {
                                ...filter.input,
                                value:
                                  filter.input.type === BOOL
                                    ? !filter.active
                                    : filter.input.value
                              }
                            });
                          }, [filter]);
                          return (
                            checkIncluded(filter, resource) && (
                              <PanelOption
                                key={filter.name}
                                hidden={!isFoldExpanded}
                              >
                                <OptionHeadline>
                                  <PanelOptionTitle>
                                    {`${filter.name}`.concat(
                                      filter.unit ? ` (${filter.unit})` : ''
                                    )}
                                  </PanelOptionTitle>
                                  {filter.info && (
                                    <InfoButton
                                      info={filter.info}
                                      id={filter.name}
                                    >
                                      Info
                                    </InfoButton>
                                  )}

                                  {filter.input.type === BOOL && (
                                    <FormSwitch
                                      hideText
                                      name={`toggle-${filter.name.replace(
                                        / /g,
                                        '-'
                                      )}`}
                                      disabled={filter.disabled}
                                      checked={filter.active}
                                      onChange={switchOnChange}
                                    >
                                      Toggle filter
                                    </FormSwitch>
                                  )}
                                </OptionHeadline>
                                <FormInput
                                  option={filter}
                                  onChange={inputOnChange}
                                />
                              </PanelOption>
                            )
                          );
                        })}
                  />
                );
              })}
            </>
          )}
        </Accordion>
      </FormWrapper>
    </>
  );
}

FiltersForm.propTypes = {
  /* eslint-disable react/no-unused-prop-types */
  presets: T.object,
  setPreset: T.func,
  name: T.string,
  icon: T.string,
  filters: T.array,
  resource: T.string,
  setFilters: T.func,
  outputFilters: T.array,
  checkIncluded: T.func,
  active: T.bool,
  disabled: T.bool
};
if (process.env.NODE_ENV === 'development') {
  FiltersForm.whyDidYouRender = true;
}

export default React.memo(FiltersForm);
