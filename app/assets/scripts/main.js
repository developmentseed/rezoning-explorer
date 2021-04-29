import './wdyr';
import '@babel/polyfill';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalProvider } from './context/global-context';
import history from './utils/history.js';

import GlobalStyles from './styles/global';
import { GlobalLoading } from './components/common/global-loading';
import { ToastContainerCustom } from './components/common/toasts';

import theme from './styles/theme/theme';

// Views
import Home from './components/home';
import Explore from './components/explore';
import About from './components/about';
import { useState } from 'react';

// Root component.
function Root() {
  const [windowHeight, setWindowHeight] = useState(null);

  const updateWindowHeight = () => {
    // Store the height to set the page min height. This is needed for mobile
    // devices to account for the address bar, since 100vh does not work.
    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
    window.addEventListener('resize', updateWindowHeight);
    return () => {
      window.removeEventListener(updateWindowHeight);
    };
  }, []);

  return (
    <Router history={history}>
      <ThemeProvider theme={theme.main}>
        <GlobalProvider>
          <GlobalStyles innerHeight={windowHeight} />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/explore' component={Explore} />
            <Route exact path='/about' component={About} />
          </Switch>
          <GlobalLoading />
          <ToastContainerCustom />
        </GlobalProvider>
      </ThemeProvider>
    </Router>
  );
}
render(<Root />, document.querySelector('#app-container'));
