import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import config from '../../config';

import { Link } from 'react-router-dom';
import { themeVal } from '../../styles/utils/general';

import { Button } from '@devseed-ui/button';
//import Button from '../../styles/button/button';

import { multiply } from '../../styles/utils/math';
import { stackSkin } from '../../styles/skins';

const { appTitle, appShortTitle } = config;

const PageHead = styled.header`
  ${stackSkin()}
  position: sticky;
  z-index: 20;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
`;

const PageHeadInner = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: ${themeVal('layout.space')} 0
    ${multiply(themeVal('layout.space'), 1.5)} 0;
  margin: 0 auto;
  height: 100%;
`;

const PageHeadline = styled.div`
  margin: ${multiply(themeVal('layout.space'), 2)} 0 0 0;
  order: 2;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  line-height: 1;
  writing-mode: vertical-rl;
  text-align: center;
  transform: rotate(180deg);
  margin: 0;
  * {
    display: block;
  }
  a {
    transition: all 0.24s ease 0s;
    &,
    &:visited {
      color: inherit;
    }
    &:hover {
      color: ${themeVal('color.link')};
      opacity: 1;
    }
  }
`;

const PageNav = styled.nav`
  flex-flow: column nowrap;
  flex: 1;
  display: flex;
`;

const GlobalMenu = styled.ul`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin: 0;
  list-style: none;

  > * {
    margin: 0;
  }
  > *:last-child {
    margin: 0;
  }
`;

const GlobalMenuButton = styled(Button)`
  color: ${themeVal('color.base')};
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
          <PageNav role='navigation'>

            <GlobalMenu>
              <li>
                <GlobalMenuButton
                  element={Link}
                  to='/explore'
                  useIcon='house'
                  title='Show menu'
                  hideText
                  size='large'
                >
                  Show menu
                </GlobalMenuButton>
              </li>
              <li>
                <GlobalMenuButton
                  element={Link}
                  to='/explore'
                  useIcon='cog'
                  title='Show menu'
                  hideText
                  size='large'
                >
                  Show menu
                </GlobalMenuButton>
              </li>

              <li>
                <GlobalMenuButton
                  element={Link}
                  to='/explore'
                  useIcon='compass'
                  title='Show menu'
                  hideText
                  size='large'
                >
                  Show menu
                </GlobalMenuButton>
              </li>

              <li>
                <GlobalMenuButton
                  element={Link}
                  to='/explore'
                  useIcon='book'
                  title='Show menu'
                  hideText
                  size='large'
                >
                  Show menu
                </GlobalMenuButton>
              </li>

            </GlobalMenu>
          </PageNav>
        </PageHeadInner>
      </PageHead>
    );
  }
}

PageHeader.propTypes = {
  useShortTitle: T.bool
};

export default PageHeader;
