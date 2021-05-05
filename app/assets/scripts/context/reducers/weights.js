import { fetchJSON, makeAPIReducer } from './reduxeed';
import config from '../../config';
import { wrapLogReducer } from './../contexeed';
import {
  INPUT_CONSTANTS
} from '../../components/explore/panel-data';

const { apiEndpoint } = config;

export const weightsReducer = wrapLogReducer(makeAPIReducer('FETCH_WEIGHTS'));
/*
 * Make async request to api for weights schema
 * dispatch updates to some context using 'dispatch' function
*/
export async function fetchWeights (dispatch) {
  dispatch({ type: 'REQUEST_FETCH_WEIGHTS' });
  try {
    const { body: weights } = await fetchJSON(
      `${apiEndpoint}/zone/schema`
    );

    const apiWeights = Object.keys(weights)
      .map(id => {
        const weight = weights[id];
        return ({
          ...weight,
          id,
          name: weight.title,
          info: weight.description,
          input: {
            type: INPUT_CONSTANTS.SLIDER,
            range: [weight.gte, weight.lte * 100],
            default: weight.default * 100
          }
        });
      }
      );

    dispatch({ type: 'RECEIVE_FETCH_WEIGHTS', data: apiWeights });
  } catch (err) {
    dispatch({ type: 'ERROR', error: err });
  }
}
