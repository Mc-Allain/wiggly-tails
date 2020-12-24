import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-table/dist/bootstrap-table.css';
import 'bootstrap-table/dist/bootstrap-table.js'
import 'jquery/dist/jquery.js';
import 'jquery/dist/jquery.slim.js';
import '@fortawesome/fontawesome-free/css/all.css';
import '@popperjs/core/dist/cjs/popper.js';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
