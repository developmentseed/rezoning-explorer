import React from 'react';
import styled from 'styled-components';
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
import { themeVal, filterComponentProps } from '../../styles/utils/general';
// import HomepageBackground from './background';

import { Link } from 'react-router-dom';

// See documentation of filterComponentProp as to why this is
const propsToFilter = ['variation', 'size', 'hideText', 'useIcon', 'active'];
const StyledLink = filterComponentProps(Link, propsToFilter);

const HomeInpage = styled(Inpage)`
  background: rgb(2, 0, 36);
  color: ${themeVal('color.background')};
  padding-top: 12rem;
  ${Button} {
    margin-top: 4rem;
  }
`;

function Home () {
  return (
    <App pageTitle='Home'>
      <HomeInpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Welcome to Rezoning</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>
            <Prose>Identify and explore high potential project areas for solar, wind and offshore wind development</Prose>
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
      </HomeInpage>
      {/* <HomepageBackground /> */}
    </App>
  );
}

export default Home;
