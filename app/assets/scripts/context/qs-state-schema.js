import { round } from '../utils/format';
import get from 'lodash.get';
import inRange from 'lodash.inrange';
import intersection from 'lodash.intersection';
import {
  INPUT_CONSTANTS,
  DEFAULT_WEIGHT_RANGE,
  DEFAULT_WEIGHT_VALUE,
  setRangeByUnit,
  apiResourceNameMap
} from '../components/explore/panel-data';

const { SLIDER, BOOL, DROPDOWN, MULTI, TEXT, DEFAULT_RANGE } = INPUT_CONSTANTS;

export const castByFilterType = (type) => {
  switch (type) {
    case BOOL:
      return Boolean;
    case DROPDOWN:
      return (value) => value?.id || value; // value might be object or string
    case MULTI:
    case TEXT:
      return String;
    case SLIDER:
      return Number;
    default:
      return String;
  }
};

/* eslint-disable camelcase */
export const accessResourceDefault = (object, resource, range) => {
  const { resource_defaults } = object;

  if (!resource_defaults) {
    return null;
  }
  if (Array.isArray(resource_defaults)) {
    const [min, max] = setRangeByUnit(resource_defaults, object.unit);
    return (
      {
        min: Math.max(min < range[1] ? min : -Infinity, range[0]),
        max: Math.min(max > range[0] ? max : Infinity, range[1])
      });
  } else {
    const [min, max] = resource_defaults[resource] ? setRangeByUnit(resource_defaults[resource], object.unit) : [];

    return (
      {
        min: Math.max(min < range[1] ? min : -Infinity, range[0]),
        max: Math.min(max > range[0] ? max : Infinity, range[1])
      });
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
  ).map((v) => round(v));

  switch (input.type) {
    case SLIDER:
      return {
        ...input,
        range,
        unit: input.unit,
        value:
          input.value ||
          accessResourceDefault(obj, resource, range) ||
          (obj.isRange ? { min: range[0], max: range[1] } : range[0])
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
        // For multi select, select all by default
        value: input.value || obj.resource_defaults || input.options.map((e, i) => i),
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

/**
 * Return filter querystring schema to configure useQsSchemma hook
 * @param {object} f Filter definition
 * @param {object} filterRanges Filter ranges
 * @param {string} resource Currently selected resource
 */
export const filterQsSchema = (f, filterRanges, resource) => {
  const base = {
    ...f,
    input: initByType(f, filterRanges, apiResourceNameMap[resource]),
    active: f.active === undefined ? true : f.active
  };

  return {
    key: f.id,
    default: undefined,
    hydrator: (v) => {
      let inputUpdate;
      if (v) {
        if (base.isRange) {
          const value = {};

          // get defaults
          const defaultMin = get(base, 'input.range[0]');
          const defaultMax = get(base, 'input.range[1]');

          // parse value string
          let [min, max, active] = v.split(',');
          min = Number(min);
          max = Number(max);

          // max should be valid and not bigger than default max
          value.max = isNaN(max) || max > defaultMax ? defaultMax : max;

          // min should be valid and not bigger than max
          value.min =
            isNaN(min) || min < defaultMin || min > value.max
              ? defaultMin
              : min;

          inputUpdate = {
            value,
            active: active === undefined
          };
        } else if (base.input.options) {
          v = v.split(',');
          let active = true;
          if (v[v.length - 1] === 'false') {
            // remove active
            v = v.slice(0, v.length - 2).map(Number);
            active = false;
          } else {
            v = v.map(Number);
          }

          inputUpdate = {
            value: intersection(
              base.input.options.map((opt, i) => i), // restrict to existing options indexes
              v
            ),
            active
          };
        } else {
          const [val, active] = v.split(',');
          inputUpdate = {
            value: castByFilterType(base.input.type)(val),
            active: active === undefined
          };
        }

        return {
          ...base,
          active: inputUpdate.active,
          input: {
            ...base.input,
            value: inputUpdate.value || base.input.value
          }
        };
      }
    },
    dehydrator: (f) => {
      const { value } = f.input;
      let shard;
      if (f.isRange) {
        shard = `${value.min}, ${value.max}`;
      } else if (f.input.options) {
        shard = value.join(',');
      } else {
        shard = `${value}`;
      }
      shard = f.active ? shard : `${shard},${false}`;
      return shard;
    }
  };
};

/**
 * Return weight querystring schema to configure useQsSchemma hook
 * @param {object} w Weight definition
 */
export const weightQsSchema = (w) => {
  const defaultValue = get(w, 'input.default', DEFAULT_WEIGHT_VALUE);
  const min = get(w, 'input.range[0]', DEFAULT_WEIGHT_RANGE[0]);
  const max = get(w, 'input.range[1]', DEFAULT_WEIGHT_RANGE[1]);

  return {
    key: w.id,
    default: defaultValue,
    hydrator: (v) => {
      const value = Number(v);
      return {
        ...w,
        active: true,
        input: {
          ...w.input,
          value: inRange(value, min, max) ? value : defaultValue
        }
      };
    },
    dehydrator: (v) => {
      return Number(get(v, 'input.value', defaultValue));
    },
    validator: (v) => {
      const value = get(v, 'input.value');

      if (isNaN(value)) return false;

      const floatValue = Number(value);

      return floatValue === max || inRange(floatValue, min, max);
    }
  };
};

/**
 * Return LCOE querystring schema to configure useQsSchemma hook
 * @param {object} c Weight definition
 * @param {string} c Selected resource
 */
export const lcoeQsSchema = (c, resource) => {
  const resourceApiId = apiResourceNameMap[resource];
  const base = {
    ...c,
    input: initByType(c, {}, apiResourceNameMap[resource]),
    active: c.active === undefined ? true : c.active
  };

  const min = get(base, 'input.range[0]');
  const max = get(base, 'input.range[1]');
  const defaultValue = get(base, 'input.default');

  return {
    key: c.id,
    default: undefined,
    hydrator: (v) => {
      let inputUpdate = {};
      if (v) {
        const [qsvalue, active] = v.split(',');
        let value = get(c, 'input.default');
        const parsedValue = castByFilterType(base.input.type)(qsvalue);

        // Validate supported LCOE types: options, integer, number
        if (base.input.options) {
          // Get options from schema
          const options = get(base, `input.options.${resourceApiId}`, []);

          // If options are objects, check if option has `id` equal to value (like capacity_factor)
          // or do simple comparison
          const optionValue = options.find((o) =>
            typeof o === 'object' ? o.id === v : o === v
          );

          // Apply if found
          if (optionValue) {
            value = optionValue;
          }
        } else if (base.input.range) {
          value = Number(parsedValue);
          value = inRange(value, min, max) ? value : defaultValue;
        }

        inputUpdate = {
          value,
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
    dehydrator: (v) => {
      // Use id if value is type of object
      const value = typeof v.input.value === 'object' ? v.input.value.id : v.input.value;

      // Build shard
      let shard = `${value}`;
      shard = v.active ? shard : `${shard},${false}`;
      return shard;
    }
  };
};
