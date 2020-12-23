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

const AboutPageBodyInner = styled(InpageBodyInner)`
  max-width: 60rem;
  margin-top: 6rem;

  p {
    margin-bottom: 1rem;
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
            <InpageTitle>About REZoning</InpageTitle>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <AboutPageBodyInner>
            <p>The Renewable Energy Zoning (REZoning) tool is an interactive platform designed to identify, visualize and rank zones that are most suitable for the development of solar, wind or offshore wind projects. Users can customize the spatial filters and economic parameters to meet their specific needs or to best represent the country context.</p>
            <p>Inspired by <a href='https://mapre.lbl.gov/'>Berkley’s MapRE</a> and developed by <as href='https://esmap.org/'>ESMAP</as> the tool bring together complex spatial analysis and economic calculations into an online, user-friendly environment that allows users and decision makers to obtain insights into the technical and economic potential of renewable energy resources for any country.</p>
            <p>
            The REZoning tool is powered by global geospatial datasets and baseline assumptions for the economic parameters. No input dataset, nor simulation outcome produced by the tool represents the official position of the World Bank Group. A list of the input datasets can be found here (link to ED.info datasets) and the methodology is thoroughly described here (link to github).
            </p>
          </AboutPageBodyInner>
        </InpageBody>
      </Inpage>
    </App>
  );
}

export default Explore;
