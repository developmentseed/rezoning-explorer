/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme/theme';
import Panel from '../common/panel';

describe('Page Header', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<ThemeProvider theme={theme.main}><Panel /></ThemeProvider>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
