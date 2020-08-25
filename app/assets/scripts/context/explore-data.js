import { makeActions, makeFetchThunk, makeAPIReducer } from './reduxeed';
import { wrapLogReducer } from './contexeed';
import config from '../config';

const { api } = config;

const queryDataActions = makeActions('QUERY_DATA_SINGLE');

export function fetchQueryData (query) {
  return makeFetchThunk({
    url: `${api}/${query}`,
    // cache: true,
    // statePath: ['spotlight', 'single', id],
    requestFn: queryDataActions.request,
    receiveFn: queryDataActions.receive
  });
}

export const queryDataReducer = wrapLogReducer(makeAPIReducer('QUERY_DATA_SINGLE'));

const generateZonesActions = makeActions('GENERATE_ZONES');

export function fetchGenerateZones () {
  return makeFetchThunk({
    url: 'http://localhost:8080/zones.json',
    // cache: true,
    // statePath: ['spotlight', 'single', id],
    requestFn: generateZonesActions.request,
    receiveFn: generateZonesActions.receive
  });
}

export const generateZonesReducer = wrapLogReducer(makeAPIReducer('GENERATE_ZONES'));
