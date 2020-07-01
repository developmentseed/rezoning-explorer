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
import Prose from '../../styles/type/prose';

function Home () {
  return (
    <App
      pageTitle='Home'
    >
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Home</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>
            <Prose>
              Some Text about the website
            </Prose>
          </InpageBodyInner>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Home;
