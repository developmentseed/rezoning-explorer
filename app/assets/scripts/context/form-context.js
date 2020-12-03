import React, { useContext, createContext, useReducer, useEffect, useState } from 'react';
import T from 'prop-types';
import { fetchFilterRanges, filterRangesReducer } from './reducers/filter-ranges';
import { fetchFilters, filtersReducer } from './reducers/filters';
import { fetchWeights, weightsReducer } from './reducers/weights';
import { fetchLcoe, lcoeReducer } from './reducers/lcoe';
import {
  presets,
  INPUT_CONSTANTS
} from '../components/explore/panel-data';
import ExploreContext from './explore-context';
import { initialApiRequestState } from './contexeed';
import { randomRange } from '../utils/utils';
import {
  hideGlobalLoading
} from '../components/common/global-loading';

const FormContext = createContext({});
export function FormProvider (props) {
  const { selectedAreaId, currentZones } = useContext(ExploreContext);
  const [inputTouched, setInputTouched] = useState(true);
  const [zonesGenerated, setZonesGenerated] = useState(false);

  const [filtersList, dispatchFiltersList] = useReducer(
    filtersReducer,
    initialApiRequestState
  );
  const [filterRanges, dispatchFilterRanges] = useReducer(
    filterRangesReducer,
    initialApiRequestState
  );

  const [weightsList, dispatchWeightsList] = useReducer(
    weightsReducer,
    initialApiRequestState
  );

  const [lcoeList, dispatchLcoeList] = useReducer(
    lcoeReducer,
    initialApiRequestState
  );

  useEffect(() => {
    if (!filtersList.isReady()) {
      return;
    }

    // Apply a mock "Optimization" scenario to filter presets, just random numbers
    presets.filters = {
      Optimization: filtersList.getData().map(filter => ({
        ...filter,
        active: Math.random() > 0.5,
        input: {
          ...filter.input,
          value: filter.input.type === INPUT_CONSTANTS.SLIDER ? {
            max: filter.range
              ? randomRange(filter.range[0], filter.range[1])
              : randomRange(0, 100),
            min: filter.range ? filter.range[0] : 0
          } : false
        }
      }))
    };
  }, [filtersList]);

  useEffect(() => {
    fetchFilterRanges(selectedAreaId, dispatchFilterRanges);
  }, [selectedAreaId]);

  useEffect(() => {
    fetchFilters(dispatchFiltersList);
    fetchWeights(dispatchWeightsList);
    fetchLcoe(dispatchLcoeList);
  }, []);

  useEffect(() => {
    if (currentZones.fetched) {
      hideGlobalLoading();
      !zonesGenerated && setZonesGenerated(true);
      setInputTouched(false);
    }
  }, [currentZones]);

  return (
    <>
      <FormContext.Provider
        value={
          {
            filtersLists: (filtersList.isReady() && presets.filters) ? filtersList.getData() : null,
            weightsList: (weightsList.isReady() && presets.weights) ? weightsList.getData() : null,
            lcoeList: (lcoeList.isReady() && presets.lcoe) ? lcoeList.getData() : null,
            filterRanges,
            presets,
            inputTouched,
            setInputTouched,
            zonesGenerated,
            setZonesGenerated

          }
        }
      >
        {props.children}
      </FormContext.Provider>
    </>
  );
}

FormProvider.propTypes = {
  children: T.node
};

export default FormContext;
