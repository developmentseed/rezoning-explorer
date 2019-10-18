import React from 'react';
import { render } from 'react-dom';

// Root component.
class Root extends React.Component {
  componentDidMount () {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }

  render () {
    return (
      <p>Hello from Starter</p>
    );
  }
}

// render(<Root />, document.querySelector('#app-container'));
