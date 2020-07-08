import { makeActions, makeFetchThunk, makeAPIReducer } from './reduxeed';

const queryDataActions = makeActions('QUERY_DATA_SINGLE');

export function fetchQueryData (type) {
  return makeFetchThunk({
    url: `http://localhost:8080/${type}.json`,
    // cache: true,
    // statePath: ['spotlight', 'single', id],
    requestFn: queryDataActions.request,
    receiveFn: queryDataActions.receive
  });
}

const queryDataReducer = makeAPIReducer('QUERY_DATA_SINGLE');
export default queryDataReducer;
