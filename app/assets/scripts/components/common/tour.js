import React from 'react';
import Joyride from 'react-joyride';

const steps = [
  {
    target: '#select-area-button',
    content: 'This is my text'
  }
];
function Tour (props) {
  return (<>
    <Joyride
      steps={steps}
      autoStart
      run
    />
          </>);
}

export default Tour;
