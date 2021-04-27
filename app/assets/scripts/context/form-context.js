import React, {
  useContext,
  createContext,
  useReducer,
  useEffect,
  useState
} from 'react';
import T from 'prop-types';
import {
  fetchFilterRanges,
  filterRangesReducer
} from './reducers/filter-ranges';
import { fetchFilters, filtersReducer } from './reducers/filters';
import { fetchWeights, weightsReducer } from './reducers/weights';
import { fetchLcoe, lcoeReducer } from './reducers/lcoe';
import ExploreContext, {
  useArea,
  useResource,
  useZone
} from './explore-context';
import { initialApiRequestState } from './contexeed';
import { hideGlobalLoading } from '../components/common/global-loading';
import { useMemo } from 'react';

const FormContext = createContext({});
export function FormProvider(props) {
  // const { selectedAreaId, selectedResource, currentZones } = useContext(ExploreContext);

  const { selectedAreaId } = useArea();
  const { selectedResource } = useResource();
  const { currentZones } = useZone();

  const [inputTouched, setInputTouched] = useState(true);
  const [zonesGenerated, setZonesGenerated] = useState(false);

  const [showSelectAreaModal, setShowSelectAreaModal] = useState(
    !selectedAreaId
  );
  const [showSelectResourceModal, setShowSelectResourceModal] = useState(
    !selectedResource
  );

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

  // Show modals based on selection
  useEffect(() => {
    setShowSelectAreaModal(!selectedAreaId);
    setShowSelectResourceModal(!selectedResource);
  }, [selectedAreaId, selectedResource]);

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
        value={{
          filtersLists: filtersList.isReady() ? filtersList.getData() : null,
          weightsList: weightsList.isReady() ? weightsList.getData() : null,
          lcoeList: lcoeList.isReady() ? lcoeList.getData() : null,
          filterRanges,
          inputTouched,
          setInputTouched,
          zonesGenerated,
          setZonesGenerated,
          showSelectAreaModal,
          setShowSelectAreaModal,
          showSelectResourceModal,
          setShowSelectResourceModal
        }}
      >
        {props.children}
      </FormContext.Provider>
    </>
  );
}

FormProvider.propTypes = {
  children: T.node
};

// Check if consumer function is used properly
export const useFormContext = (fnName) => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <FormContext> component's context.`
    );
  }

  return context;
};

export const useAreaModal = () => {
  const { showSelectAreaModal, setShowSelectAreaModal } = useFormContext(
    'useAreaModal'
  );

  return useMemo(
    () => ({
      showSelectAreaModal,
      setShowSelectAreaModal
    }),
    [showSelectAreaModal]
  );
};

export const useResourceModal = () => {
  const {
    showSelectResourceModal,
    setShowSelectResourceModal
  } = useFormContext('useResourceModal');

  return useMemo(
    () => ({
      showSelectResourceModal,
      setShowSelectResourceModal
    }),
    [showSelectResourceModal]
  );
};

export const useFormListsAndRanges = () => {
  const {
    filtersLists,
    weightsList,
    lcoeList,
    filterRanges,
    setInputTouched,
    setZonesGenerated
  } = useFormContext('useFormListsAndRanges');

  return useMemo(
    () => ({
      filtersLists,
      weightsList,
      lcoeList,
      filterRanges,
      setInputTouched,
      setZonesGenerated
    }),
    [filtersLists, weightsList, lcoeList, filterRanges]
  );
};

export default FormContext;
