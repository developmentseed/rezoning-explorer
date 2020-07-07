import React from 'react';
import styled from 'styled-components';

import config from '../../config';

import { Link, NavLink } from 'react-router-dom';
import {
  themeVal,
  stylizeFunction,
  filterComponentProps
} from '../../styles/utils/general';

import ShareOptions from './share-options';

import { rgba } from 'polished';
import { visuallyHidden } from '../../styles/helpers';
import collecticon from '../../styles/collecticons';
import { multiply } from '../../styles/utils/math';

const _rgba = stylizeFunction(rgba);

const { appTitle, appShortTitle } = config;

const PageHead = styled.header`
  background-color: ${themeVal('color.base')};
  color: ${themeVal('color.baseLight')};
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

const HomeLink = styled.a`
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

  &,
  &:visited {
    color: inherit;
  }

  &.active {
    color: ${themeVal('color.baseLight')};
    opacity: 1;
    background: ${_rgba(themeVal('color.baseLight'), 0.08)};
  }

  span {
    ${visuallyHidden()}
  }
`;

const GlobalMenuLink = styled.a`
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

  &,
  &:visited {
    color: inherit;
  }

  &.active {
    color: ${themeVal('color.baseLight')};
    opacity: 1;
    background: ${_rgba(themeVal('color.baseLight'), 0.08)};
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
    return (
      <PageHead role='banner'>
        <PageHeadInner>
          <PageNav role='navigation'>
            <GlobalMenu>
              <li>
                <HomeLink
                  as={Link}
                  exact
                  to='/'
                  useIcon='house'
                  title='Visit the home page'
                  data-tip={appShortTitle}
                >
                  <span>{appTitle}</span>
                </HomeLink>
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
                <ShareOptions />
              </li>
            </GlobalMenu>
          </PageNav>
        </PageHeadInner>
      </PageHead>
    );
  }
}

PageHeader.propTypes = {
};

export default PageHeader;
