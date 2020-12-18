import { round } from '../utils/format';
import {
  INPUT_CONSTANTS,
  setRangeByUnit
} from '../components/explore/panel-data';

const {
  SLIDER,
  BOOL,
  DROPDOWN,
  MULTI,
  TEXT,
  DEFAULT_RANGE
} = INPUT_CONSTANTS;

export const castByFilterType = type => {
  switch (type) {
    case BOOL:
      return Boolean;
    case DROPDOWN:
    case MULTI:
    case TEXT:
      return String;
    case SLIDER:
      return Number;
    default:
      return String;
  }
};

export const initByType = (obj, ranges, resource) => {
  // Api filter schema includes layer property
  // Use to resolve correct range from api /filter/{country}/layers
  const apiRange = ranges[obj.layer];
  const { input, options } = obj;

  const range = setRangeByUnit(
    (apiRange && [round(apiRange.min), round(apiRange.max)]) ||
      obj.input.range ||
      DEFAULT_RANGE,
    obj.unit
  );

  switch (input.type) {
    case SLIDER:
      return {
        ...input,
        range,
        unit: input.unit,
        value:
          input.value ||
          input.default ||
          (obj.isRange
            ? { min: round(range[0]), max: round(range[1]) }
            : range[0])
      };
    case TEXT:
      return {
        ...input,
        range: input.range || DEFAULT_RANGE,
        unit: input.unit,
        value: input.value || input.default || (input.range || DEFAULT_RANGE)[0]
      };
    case BOOL:
      return {
        ...input,
        value: false,
        range: [true, false]
      };
    case MULTI:
      return {
        ...input,
        // For multi select use first option as default value
        value: input.value || [0],
        unit: null
      };
    case DROPDOWN:
      return {
        ...input,
        value: obj.value || (options[resource] && options[resource][0]) || '',
        availableOptions: options[resource] || [],
        unit: null
      };
    default:
      return {};
  }
};

export const weightQsSchema = (w) => ({
  key: w.id,
  hydrator: (v) => {
    const base = {
      ...w,
      input: initByType(w, {}),
      active: w.active === undefined ? true : w.active
    };
    let inputUpdate = {};
    if (v) {
      const [value, active] = v.split(',');
      inputUpdate = {
        value: castByFilterType(base.input.type)(value),
        active: active === undefined
      };
    }
    return {
      ...base,
      active:
        inputUpdate.active === undefined ? base.active : inputUpdate.active,
      input: {
        ...base.input,
        value: inputUpdate.value || base.input.value
      }
    };
  },
  dehydrator: (w) => {
    const { value } = w.input;
    let shard = `${value}`;
    shard = w.active ? shard : `${shard},${false}`;
    return shard;
  }
});
