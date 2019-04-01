// @flow

// Entry point

import React from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';
import { App } from './app';

const appRoot = document.getElementsByClassName('todoapp')[0];

invariant(appRoot != null, 'No root element');

ReactDOM.render(<App />, appRoot);
