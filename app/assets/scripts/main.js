import './wdyr';
import '@babel/polyfill';
import React, { useEffect, useContext } from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalContext, { GlobalProvider } from './context/global-context';
import history from './utils/history.js';

import GlobalStyles from './styles/global';
import { GlobalLoading } from './components/common/global-loading';
import { ToastContainerCustom } from './components/common/toasts';

import theme from './styles/theme/theme';

// Views
import Home from './components/home';
import Sandbox from './components/sandbox';
import Explore from './components/explore';
import About from './components/about';

// Root component.
function Root () {
  const { windowHeight } = useContext(GlobalContext);

  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  return (
    <Router history={history}>
      <ThemeProvider theme={theme.main}>
        <GlobalProvider>
          <GlobalStyles innerHeight={windowHeight} />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/sandbox' component={Sandbox} />
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
