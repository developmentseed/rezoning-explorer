import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import config from '../../config';

import { NavLink } from 'react-router-dom';
import {
  themeVal,
  stylizeFunction,
  filterComponentProps
} from '../../styles/utils/general';

import { rgba } from 'polished';
import { stackSkin } from '../../styles/skins';
import { visuallyHidden } from '../../styles/helpers';
import collecticon from '../../styles/collecticons';
import { multiply, divide } from '../../styles/utils/math';

const _rgba = stylizeFunction(rgba);

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

const GlobalMenuLink = styled.a.attrs({
  'data-place': 'right'
})`
  position: relative;
  display: block;
  width: 4rem;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  transition: all 0.24s ease 0s;

  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
    font-size: 1.25rem
  }

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${divide(themeVal('layout.space'), 4)};
    background: ${themeVal('color.link')};
    content: '';
    opacity: 0;
    transition: all 0.24s ease 0s;
  }

  &,
  &:visited {
    color: inherit;
  }

  &:hover {
    color: ${themeVal('color.link')};
    opacity: 1;
    background: ${_rgba(themeVal('color.link'), 0.08)};
  }

  &.active {
    color: ${themeVal('color.link')};

    &::after {
      opacity: 1;
    }
  }

  span {
    ${visuallyHidden()}
  }
`;

// See documentation of filterComponentProp as to why this is
const propsToFilter = ['variation', 'size', 'hideText', 'useIcon', 'active'];
const NavLinkFilter = filterComponentProps(NavLink, propsToFilter);

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
                <GlobalMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/'
                  useIcon='house'
                  title='Visit the home page'
                  data-tip='Home'
                >
                  <span>Home</span>
                </GlobalMenuLink>
              </li>
              <li>
                <GlobalMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/explore'
                  useIcon='compass'
                  data-tip='Explore'
                  title='View Explore page'
                >
                  <span>Explore</span>
                </GlobalMenuLink>
              </li>
              <li>
                <GlobalMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/about'
                  useIcon='circle-information'
                  data-tip='About'
                  title='View About page'
                >
                  <span>About</span>
                </GlobalMenuLink>
              </li>
              <li>
                <GlobalMenuLink
                  as={NavLinkFilter}
                  exact
                  to='/share'
                  useIcon='share'
                  data-tip='Share'
                  title='ViewShare page'
                >
                  <span>Share</span>
                </GlobalMenuLink>
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
