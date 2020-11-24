import React, { Component } from 'react';
import T from 'prop-types';
import { withRouter } from 'react-router';
import styled from 'styled-components';

import MetaTags from './meta-tags';
import PageHeader from './page-header';
import PageFooter from './page-footer';

import config from '../../config';
import SizeAwareElement from './size-aware-element';
import media from '../../styles/utils/media-queries';

const { appTitle, appDescription } = config;

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1;
  grid-template-rows: minmax(4rem, max-content) auto 0;
  ${media.mediumUp`
    grid-template-columns: minmax(4rem, max-content) auto 0;
  `}
`;

const PageBody = styled.main`
  padding: 0;
  margin: 0;
`;

class App extends Component {
  render () {
    const { pageTitle, hideFooter, children } = this.props;
    const title = pageTitle ? `${pageTitle} — ` : '';

    return (
      <SizeAwareElement
        element={Page}
        className='page'
        onChange={this.resizeListener}
        hideFooter={hideFooter}
      >
        <MetaTags title={`${title}${appTitle}`} description={appDescription} />
        <PageHeader />
        <PageBody role='main'>
          {children}
        </PageBody>
        <PageFooter />
      </SizeAwareElement>
    );
  }
}

App.propTypes = {
  pageTitle: T.string,
  hideFooter: T.bool,
  children: T.node
};

export default withRouter(App);
