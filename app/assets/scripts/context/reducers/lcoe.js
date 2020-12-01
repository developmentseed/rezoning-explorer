import { fetchJSON, makeAPIReducer } from './reduxeed';
import config from '../../config';
import { wrapLogReducer } from './../contexeed';
import {
  INPUT_CONSTANTS
} from '../../components/explore/panel-data';

const { apiEndpoint } = config;

export const lcoeReducer = wrapLogReducer(makeAPIReducer('FETCH_LCOE'));
/*
 * Make all asynchronous requests to load zone score from REZoning API
 * dispatch updates to some context using 'dispatch' function
*/
export async function fetchLcoe (dispatch) {
  dispatch({ type: 'REQUEST_FETCH_LCOE' });
  try {
    const { body: lcoe } = await fetchJSON(
      `${apiEndpoint}/lcoe/schema`
    );

    const apiLcoe = Object.keys(lcoe)
      .map(id => {
        const cost = lcoe[id];
        return ({
          ...cost,
          id,
          name: cost.title,
          info: cost.description,
          input: {
            type: INPUT_CONSTANTS.TEXT,
            // TODO add range if exists
            // range: [cost.gte, cost.lte],
            default: cost.default
          }
        });
      }
      );

    // Prepare filters from the API to be consumed by the frontend
    dispatch({ type: 'RECEIVE_FETCH_LCOE', data: apiLcoe });
  } catch (err) {
    dispatch({ type: 'ERROR', error: err });
  }
}
