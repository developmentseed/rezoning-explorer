import { fetchJSON, makeAPIReducer } from './reduxeed';
import config from '../../config';
import { wrapLogReducer } from './../contexeed';

const { apiEndpoint } = config;

export const filterRangesReducer = wrapLogReducer(
  makeAPIReducer('FILTER_RANGES')
);

/*
 * Fetch filter ranges for the selected area from API
 */
export async function fetchFilterRanges (selectedAreaId, dispatch) {
  dispatch({ type: 'REQUEST_FILTER_RANGES' });
  try {
    const layers = (
      await fetchJSON(`${apiEndpoint}/filter/${selectedAreaId}/layers`)
    ).body;

    // Filters have "f_" prefix, apply
    const filterRanges = Object.keys(layers).reduce((acc, layerId) => {
      acc[layerId] = layers[layerId];
      return acc;
    }, {});

    dispatch({ type: 'RECEIVE_FILTER_RANGES', data: filterRanges });
  } catch (err) {
    dispatch({ type: 'INVALIDATE_FILTER_RANGES', error: err });
  }
}
