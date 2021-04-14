import React from 'react';
import styled from 'styled-components';
import App from '../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageTitle,
  InpageBody,
  InpageBodyInner
} from '../../styles/inpage';
import Dl from '../../styles/type/definition-list';
import { themeVal } from '../../styles/utils/general';
import media from '../../styles/utils/media-queries.js';
import { visuallyHidden } from '../../styles/helpers/index';

const AboutPageBodyInner = styled(InpageBodyInner)`
  max-width: 60rem;
  margin-top: 6rem;

  p {
    margin-bottom: 1rem;
  }
`;

const LogoList = styled(Dl)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 0 1rem;
  list-style: none;
  padding: 0;
  margin: 0;

  dt {
    grid-column: 1 / span 12;

    &:not(:first-child) {
      margin-top: 1rem
    }
  }

  dd {
    grid-column: auto / span 6;

    ${media.smallUp`
      grid-column: auto / span 4;
    `}
  }

  a {
    display: flex;
    flex-direction: column;
    flex: 1 1 100%;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    height: 6rem;
    position: relative;
    z-index: 1;
    border-radius: ${themeVal('shape.rounded')};
    box-shadow: inset 0 0 0 1px ${themeVal('color.baseAlphaC')};
    transition: all .16s ease 0s;
  }

  span {
    ${visuallyHidden()}
  }

  img {
    display: inline-flex;
    width: auto;
    max-width: 100%;
    max-height: 3rem;
  }

  /* Compensate DevSeed logo proportions and alignment */
  .logo-devseed img {
    max-height: 2rem;
  }

  /* Compensate ESMAP logo proportions and alignment */
  .logo-esmap img {
    max-height: 2.25rem;
  }
`;

function Explore () {
  return (
    <App
      pageTitle='Explore'
    >
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageTitle>About ReZoning</InpageTitle>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <AboutPageBodyInner>
            <p>The Renewable Energy Zoning (ReZoning) tool is an interactive platform designed to identify, visualize and rank zones that are most suitable for the development of solar, onshore or offshore wind projects. Users can customize the spatial filters and economic parameters to meet their specific needs or to best represent the country context.</p>
            <p>Inspired by <a rel='noreferrer' target='_blank' href='https://mapre.lbl.gov/'>Berkley’s MapRE</a> and developed by <a rel='noreferrer' target='_blank' href='https://esmap.org/'>ESMAP</a> the tool bring together complex spatial analysis and economic calculations into an online, user-friendly environment that allows users and decision makers to obtain insights into the technical and economic potential of renewable energy resources for any country.</p>
            <p>
            The ReZoning tool is powered by global geospatial datasets and baseline assumptions for the economic parameters. No input dataset, nor simulation outcome produced by the tool represents the official position of the World Bank Group. A list of the input datasets can be found here (link to ED.info datasets) and the methodology is thoroughly described here (link to github).
            </p>
          </AboutPageBodyInner>
          <InpageBodyInner>
            <LogoList>
              <dt>Partners</dt>
              <dd>
                <a
                  href='https://www.worldbank.org/'
                  title='Visit World Bank'
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    alt='WBG Logo'
                    src='/assets/graphics/content/logos/logo-wbg.png'
                  />
                  <span>World Bank Group</span>
                </a>
              </dd>
              <dd>
                <a
                  href='https://www.esmap.org/'
                  title='Visit Energy Sector Management Assistance Program'
                  className='logo-esmap'
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    alt='ESMAP Logo'
                    src='/assets/graphics/content/logos/logo-esmap.png'
                  />
                  <span>ESMAP</span>
                </a>
              </dd>
              <dd>
                <a
                  href='https://www.ucsb.edu/'
                  title='Visit University of California Santa Barbara'
                  className='logo-ucsb'
                  target='_blank'
                  rel='noreferrer'
                >
                  <img
                    alt='UCSB Logo'
                    src='/assets/graphics/content/logos/logo-ucsb.png'
                  />
                  <span>University of California Santa Barbara</span>
                </a>
              </dd>
            </LogoList>
          </InpageBodyInner>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Explore;
