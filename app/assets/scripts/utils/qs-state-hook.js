import { useEffect, useState, useRef } from 'react';
import qs from 'qs';
import debounce from 'lodash.debounce';

import history from './history';
import { isEqualObj } from './utils';

// Each hook handles a single value, however there are times where multiple
// hooks are called simultaneously triggering several url updates. An example of
// this would be a map state. We'd have a hook for the center point and another
// for the zoom level, however these 2 values should be stored in the url at the
// same time to ensure a proper navigation. When we press the back key we want
// to go back to the previous center and zoom, and not only one at a time. The
// solution for this is to store the properties to be changed and only commit
// the to the url once all the changes were made. This is done using a debounced
// function that triggers 100ms after the last action.
let commitQueue = {};

const commit = debounce(() => {
  const parsedQS = qs.parse(history.location.search.substr(1));

  // New object that is going to be stringified to the url.
  // Current properties plus the ones to be changed.
  const qsObject = {
    ...parsedQS,
    ...commitQueue
  };

  history.push({ search: qs.stringify(qsObject, { skipNulls: true }) });
  // Once the commit happens clear the commit queue.
  commitQueue = {};
}, 100);

function storeInURL (k, v) {
  // Store the new value in the queue.
  commitQueue = {
    ...commitQueue,
    [k]: v
  };
  // Try to commit.
  commit();
}

/**
 * Qs State is used to sync a state object with url search string.
 * It will keep the state value in sync with the url.
 * The value will be validated according to the state definition
 *
 * Example:
 * {
 *    key: 'field',
 *    hydrator: (v) => v,
 *    dehydrator: (v) => v,
 *    default: 'all',
 *    validator: [1, 2, 3]
 * }
 *
 * {string} key - Key name to use on the search string
 * {func} hydrator - Any transformation to apply to the value from the search
 *                   string before using it. Converting to number for example.
 * {func} dehydrator - Any transformation to apply to the value before adding it
 *                     to the search. Converting a number to string for example.
 * {string|num} default - Default value. To note that when a state value is
 *                        default it won't go to the search string.
 * {array|func} validator - Validator function for the value. If is an array
 *                          should contain valid options. If it is a function
 *                          should return true or false.
 *
 * @param {object} definition The definition object.
 *
 */
export default function useQsState (def) {
  // Setup defaults.
  const {
    // Function to convert the value from the string before using it.
    hydrator = v => v,
    // Function to convert the value to the string before using it.
    dehydrator = v => v
  } = def;

  // Get the correct validator. Array of items, function or default.
  const validator = (v) => {
    if (def.validator && typeof def.validator.indexOf === 'function') {
      return def.validator.indexOf(v) !== -1;
    } else if (typeof def.validator === 'function') {
      return def.validator(v);
    } else {
      return !!v;
    }
  };

  // Parse the value from the url.
  const getValueFromURL = (searchString) => {
    const parsedQS = qs.parse(searchString);
    // Hydrate the value:
    // Convert from a string to the final type.
    const value = hydrator(parsedQS[def.key]);

    return validator(value) ? value : def.default;
  };

  // Store the state relative to this qs key.
  const [valueState, setValueState] = useState(getValueFromURL(history.location.search.substr(1)));
  // We need a ref to store the state value, otherwise the closure created by
  // the history listen always shows the original value.
  // Similar issue: https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  const stateRef = useRef();
  stateRef.current = valueState;

  const setValue = (value) => {
    const v = validator(value) ? value : def.default;
    // Dehydrate the value:
    // Convert to a string usable in the url.
    const dehydratedVal = dehydrator(v);

    // Store value in state.
    setValueState(v);

    storeInURL(def.key, v !== def.default
      ? dehydratedVal
      : null);
  };

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      // Manual actions (Push/Replace) should not trigger a state update
      if (action === 'POP') {
        const v = getValueFromURL(location.search.substr(1));
        if (!isEqualObj(v, stateRef.current)) {
          setValueState(v);
        }
      }
    });

    return () => {
      unlisten();
    };
  }, []);

  return [valueState, setValue];
}
