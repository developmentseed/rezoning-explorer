import { fetchJSON, makeAPIReducer } from './reduxeed';
import config from '../../config';
import { wrapLogReducer } from './../contexeed';
import {
  allowedTypes,
  INPUT_CONSTANTS
} from '../../components/explore/panel-data';

const abbreviateUnit = (unit, id) => {
  if (id === 'f_srtm90' || id === 'f_gebco') {
    // Do not convert elevation or bathymetry
    return 'm';
  }
  switch (unit) {
    case 'meters':
      // Convert meters to km
      return 'km';
    default:
      return unit;
  }
};

const { apiEndpoint } = config;

export const filtersReducer = wrapLogReducer(makeAPIReducer('FETCH_FILTERS'));
/*
 * Request filter schema from api
 * dispatch updates to some context using 'dispatch' function
*/
export async function fetchFilters (dispatch) {
  dispatch({ type: 'REQUEST_FETCH_FILTERS' });
  try {
    const { body: filters } = await fetchJSON(
      `${apiEndpoint}/filter/schema`
    );

    // Prepare filters from the API to be consumed by the frontend
    const apiFilters = Object.keys(filters)
      .map((filterId) => ({ ...filters[filterId], id: filterId }))
      .filter(
        ({ id, type, pattern }) =>
          (allowedTypes.has(type === 'string' ? pattern : type) &&
            ![
              'f_capacity_value',
              'f_lcoe_gen',
              'f_lcoe_transmission',
              'f_lcoe_road'
            ].includes(id)) // disable some filters not supported by the API
      )
      .map((filter) => {
        const isRange = filter.pattern === 'range_filter';
        const opts = filter.pattern === 'categorical_filter' ? {
          options: filter.options
        } : {};

        const isPercentage = filter.unit === '%';
        return {
          ...filter,
          type: 'filter',
          id: filter.id,
          name: filter.title,
          info: filter.description,
          unit: abbreviateUnit(filter.unit, filter.id),
          category: filter.category,
          // TODO this line is remporary
          active: true,
          isRange,
          input: {
            range: isPercentage ? [0, 100] : INPUT_CONSTANTS.DEFAULT_RANGE,
            type: allowedTypes.get(filter.type === 'string' ? filter.pattern : filter.type),
            ...opts
          },
          isPercentage
        };
      });
    dispatch({ type: 'RECEIVE_FETCH_FILTERS', data: apiFilters });
  } catch (err) {
    dispatch({ type: 'ERROR', error: err });
  }
}
