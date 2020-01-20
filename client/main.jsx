import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';

import App from '/imports/ui/App';
import theme from './theme';

Meteor.startup(() => {
  render(
    <ThemeProvider theme={theme}><App /></ThemeProvider>
    , document.getElementById('app'));
});
