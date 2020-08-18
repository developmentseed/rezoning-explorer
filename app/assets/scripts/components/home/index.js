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
import Button from '../../styles/button/button';
import Prose from '../../styles/type/prose';
import { filterComponentProps } from '../../styles/utils/general';

import { Link } from 'react-router-dom';

// See documentation of filterComponentProp as to why this is
const propsToFilter = ['variation', 'size', 'hideText', 'useIcon', 'active'];
const StyledLink = filterComponentProps(Link, propsToFilter);

function Home () {
  return (
    <App pageTitle='Home'>
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Welcome to Rezoning</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>
            <Prose>Explore Project Areas of High Potential</Prose>
            <Button
              as={StyledLink}
              to='/explore'
              variation='base-raised-light'
              title='Visit Explore Page'
            >
              Explore
            </Button>
          </InpageBodyInner>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Home;
