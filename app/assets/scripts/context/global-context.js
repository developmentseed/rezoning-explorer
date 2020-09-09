import React, { createContext, useState, useEffect, useReducer } from 'react';
import T from 'prop-types';

const GlobalContext = createContext({});

export function GlobalProvider (props) {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    window.addEventListener('resize', () => {
      // Store the height to set the page min height. This is needed for mobile
      // devices to account for the address bar, since 100vh does not work.
      // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      setWindowHeight(window.innerHeight);
    });
    const visited = localStorage.getItem('site-tour');
    if (visited !== null) {
      setTourStep(Number(visited));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('site-tour', tourStep);
  }, [tourStep]);

  return (
    <>
      <GlobalContext.Provider
        value={{
          windowHeight,
          tourStep,
          setTourStep
        }}
      >
        {props.children}
      </GlobalContext.Provider>
    </>
  );
}

GlobalProvider.propTypes = {
  children: T.array
};

export default GlobalContext;
