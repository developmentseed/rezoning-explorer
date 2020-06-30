import React from 'react';
import App from '../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner
} from '../../styles/inpage';

import PrimePanel from './prime-panel';

function Explore (props) {
  return (
    <App
      pageTitle='Explore'
    >
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Explore</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>

            <PrimePanel />
          </InpageBodyInner>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Explore;
