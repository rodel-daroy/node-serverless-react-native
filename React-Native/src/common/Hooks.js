import { useCallback, useState } from 'react';

export const useAsyncState = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const setter = (x) =>
    new Promise((resolve) => {
      setValue(x);
      resolve(x);
    });
  return [value, setter];
};

export const useSetState = (defaultState) => {
  const [state, setState] = useState(defaultState);

  const updateState = useCallback(
    (newState, merge = true) => {
      setState((prevState) => {
        // if we have a function, pass previous state
        const updatedState =
          typeof newState === 'function' ? newState(prevState) : newState;
        let stateUpdate = null;

        // merge new state with previous state
        if (merge) {
          stateUpdate = {
            ...prevState,
            ...updatedState,
          };

          // if merge is disabled, merge with the default state
        } else {
          stateUpdate = {
            ...defaultState,
            ...updatedState,
          };
        }

        return stateUpdate;
      });
    },
    [true],
  );

  return [state, updateState];
};
