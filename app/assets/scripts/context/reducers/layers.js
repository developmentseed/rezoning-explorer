import { fetchJSON, makeAPIReducer } from './reduxeed';
import config from '../../config';
import { wrapLogReducer } from './../contexeed';

const { apiEndpoint } = config;

export const inputLayersReducer = wrapLogReducer(
  makeAPIReducer('LAYERS')
);

/*
 * Fetch filter ranges for the selected area from API
 */
export async function fetchInputLayers (dispatch) {
  dispatch({ type: 'REQUEST_LAYERS' });
  try {
    const layers = (
      await fetchJSON(`${apiEndpoint}/layers`)
    ).body;

    dispatch({ type: 'RECEIVE_LAYERS', data: layers });
  } catch (err) {
    dispatch({ type: 'INVALIDATE_LAYERS', error: err });
  }
}
