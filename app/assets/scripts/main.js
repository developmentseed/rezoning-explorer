import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
// import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import history from './utils/history';

import GlobalStyles from './styles/global';

import theme from './styles/theme/theme';

// Views
import Home from './components/home';

// Root component.
class Root extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      windowHeight: window.innerHeight
    };

    window.addEventListener('resize', () => {
      // Store the height to set the page min height. This is needed for mobile
      // devices to account for the address bar, since 100vh does not work.
      // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      this.setState({ windowHeight: window.innerHeight });
    });
  }

  componentDidMount () {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }

  render () {
    return (
      <Router history={history}>
        <ThemeProvider theme={theme.main}>
          <GlobalStyles innerHeight={this.state.windowHeight} />
          <Switch>
            <Route exact path='/' component={Home} />
          </Switch>
        </ThemeProvider>
      </Router>
    );
  }
}
render(<Root />, document.querySelector('#app-container'));
