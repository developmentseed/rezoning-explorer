import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import config from '../../config';

// import { Link } from 'react-router-dom';
import { themeVal } from '../../styles/utils/general';
import { reveal } from '../../styles/animation';
import { panelSkin } from '../../styles/skins';
import { glsp } from '../../styles/utils/theme-values';

const { appTitle, appShortTitle } = config;

const PageHead = styled.header`
  ${panelSkin()}
  position: sticky;
  z-index: 20;
  top: 0;
  left: 0;
  bottom: 0;
  /* Animation */
  animation: ${reveal} 0.32s ease 0s 1;
`;

const PageHeadInner = styled.div`
  display: flex;
  padding: 0 ${glsp(0.5)};
  align-items: center;
  margin: 0 auto;
  height: 100%;
`;

const PageHeadline = styled.div`
  display: flex;
  white-space: nowrap;
  align-items: center;
`;

const PageTitle = styled.h1`
  display: flex;
  text-align: center;
  align-items: center;
  margin: 0;
  font-weight: ${themeVal('type.base.bold')};
  text-transform: uppercase;
  a {
    display: flex;
    align-items: center;
    transition: all 0.24s ease 0s;
    &,
    &:visited {
      color: inherit;
    }
  }
  span {
    font-size: 1rem;
    line-height: 1;
  }
`;

const PageNav = styled.nav`
  display: flex;
  flex-flow: row nowrap;
  margin: 0 0 0 auto;
  padding: 0 0 0 ${glsp(1)};
`;

class PageHeader extends React.Component {
  render () {
    const { useShortTitle } = this.props;

    return (
      <PageHead role='banner'>
        <PageHeadInner>
          <PageHeadline>
            <PageTitle>
              <span>
                {useShortTitle ? appShortTitle || 'REZoning' : appTitle}
              </span>
            </PageTitle>
          </PageHeadline>
          <PageNav role='navigation' />
        </PageHeadInner>
      </PageHead>
    );
  }
}

PageHeader.propTypes = {
  useShortTitle: T.bool
};

export default PageHeader;
