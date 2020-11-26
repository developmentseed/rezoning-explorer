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
import media from '../../styles/utils/media-queries.js';
import HomepageBackground from './background';

import { Link } from 'react-router-dom';

// See documentation of filterComponentProp as to why this is
const propsToFilter = ['variation', 'size', 'hideText', 'useIcon', 'active'];
const StyledLink = filterComponentProps(Link, propsToFilter);

const HomeInpage = styled(Inpage)`
  background: rgb(2, 0, 36);
  color: ${themeVal('color.background')};
  padding-top: 8vh;
  position: relative;
  
  p, ${Button} {
    margin-top: 1rem;
    margin-right: 1rem;
  }

  ${media.mediumUp`
    padding-top: 12vh;
    p,${Button} {
      margin-top: 4rem;
    }
    ${InpageBodyInner} {
      max-width: 40rem;
    }
  `}
`;

const CTAButtons = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
  ${media.xsmallOnly`
    flex-flow: column nowrap;
  `}
  ${media.smallUp`
    justify-content: flex-start;
  `}
`;

const HomeTitle = styled(InpageTitle)`
  span {
    font-size: 1.25rem;
    text-transform: uppercase;
    display: block;
  }
  ${media.mediumUp`
    font-size: 3.5rem;
    line-height: 4rem;
  `}

`;

const Lead = styled(Prose)`
  font-size: 1.25rem;
  line-height: 2rem;
`;

const BackgroundWrapper = styled.figure`
  display: none;
  ${media.mediumUp`
    display: block;
    position: absolute;
    top: 20vh;
    left: 50vw;
    width: 100%;
    height: 100%;
    pointer-events: none;
  `}
`;

const PartnerLogos = styled.ul`
  display: flex;
  flex-flow: column nowrap;
  list-style: none;
  margin-top: 2rem;
  li {
    margin-right: 2rem;
  }
  ${media.smallUp`
    flex-flow: row nowrap;
  `}
`;

function Home () {
  return (
    <App pageTitle='Home'>
      <HomeInpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <HomeTitle size='xlarge'>
                <span>Welcome to </span>
                Rezoning
              </HomeTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <InpageBodyInner>
            <Lead>
              Identify and explore high potential project areas for solar, wind
              and offshore wind development
            </Lead>
            <CTAButtons>
              <Button
                as={StyledLink}
                to='/explore'
                variation='primary-raised-dark'
                size='xlarge'
                title='Visit Explore Page'
              >
                Explore
              </Button>
              <Button
                as={StyledLink}
                to='/about'
                variation='base-raised-light'
                size='xlarge'
                title='Visit About Page'
              >
                Learn More
              </Button>
            </CTAButtons>
            <p>Inspired by <a href='https://mapre.lbl.gov/'>MapRE</a></p>
            <PartnerLogos>
              <li><img src='https://via.placeholder.com/140x60.png/EFEFEF/000000/?text=Partner+Logo+1' /></li>
              <li><img src='https://via.placeholder.com/140x60.png/EFEFEF/000000/?text=Partner+Logo+2' /></li>
            </PartnerLogos>
          </InpageBodyInner>
        </InpageBody>
      </HomeInpage>
      <BackgroundWrapper>
        <HomepageBackground />
      </BackgroundWrapper>
    </App>
  );
}

export default Home;
