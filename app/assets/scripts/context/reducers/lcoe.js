import { fetchJSON, makeAPIReducer } from './reduxeed';
import config from '../../config';
import { wrapLogReducer } from './../contexeed';
import {
  INPUT_CONSTANTS
} from '../../components/explore/panel-data';

const { apiEndpoint } = config;

export const lcoeReducer = wrapLogReducer(makeAPIReducer('FETCH_LCOE'));
/*
 * Make async request to api for lcoe schema
 * dispatch updates to some context using 'dispatch' function
*/
export async function fetchLcoe (selectedAreaId, selectedResource, dispatch) {
  dispatch({ type: 'REQUEST_FETCH_LCOE' });
  try {
    const { body: lcoe } = await fetchJSON(
      `${apiEndpoint}/lcoe/${selectedResource}/${selectedAreaId}/schema`
    );

    const apiLcoe = Object.keys(lcoe)
      .map(id => {
        const cost = lcoe[id];

        const type = cost.options ? INPUT_CONSTANTS.DROPDOWN : INPUT_CONSTANTS.TEXT;

        const opts = cost.options ? {
          options: cost.options
        } : {};

        const isPercentage = cost.title.includes('%');

        return ({
          ...cost,
          id,
          name: cost.title,
          info: cost.description,
          category: cost.category,
          priority: cost.priority || 1,
          input: {
            type,
            ...opts,
            // TODO add range if exists
            // range: [cost.gte, cost.lte],
            // Percentage values are served as decimal, rendered as integer 0 - 100
            default: isPercentage ? cost.default * 100 : cost.default
          },
          isPercentage
        });
      }
      );
    dispatch({ type: 'RECEIVE_FETCH_LCOE', data: apiLcoe });
  } catch (err) {
    dispatch({ type: 'ERROR', error: err });
  }
}
