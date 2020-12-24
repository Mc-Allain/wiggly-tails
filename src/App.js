import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';

import './App.css';

import Index from './components/Index/Index.js';

import Customer from './components/Customer/Customer.js';
import ViewTransactions from './components/Customer/ViewTransactions.js';
import ViewAdmission from './components/Customer/ViewAdmission.js';
import CustomerManagePets from './components/Customer/ManagePets.js';
import AboutUs from './components/Customer/AboutUs.js';

import Admin from './components/Admin/Admin.js';
import ManageTransactions from './components/Admin/ManageTransactions.js';
import ManageAdmission from './components/Admin/ManageAdmission.js';
import ManageCustomers from './components/Admin/ManageCustomers';
import ManagePets from './components/Admin/ManagePets';
import ManageEmployees from './components/Admin/ManageEmployees.js';

function App() {
  return (
  <Router>
    <Switch>
      <Route exact path = "/" component = { Index } />

      <Route exact path = "/customer" component = { Customer } />
      <Route path = "/customer/view-transactions" component = { ViewTransactions } />
      <Route path = "/customer/view-admission" component = { ViewAdmission } />
      <Route path = "/customer/manage-pets" component = { CustomerManagePets } />
      <Route path = "/customer/about-us" component = { AboutUs } />

      <Route exact path = "/admin" component = {Admin} />
      <Route path = "/admin/manage-transactions" component = {ManageTransactions} />
      <Route path = "/admin/manage-admission" component = { ManageAdmission } />
      <Route path = "/admin/manage-customers" component = {ManageCustomers} />
      <Route path = "/admin/manage-pets" component = {ManagePets} />
      <Route path = "/admin/manage-employees" component = {ManageEmployees} />
    </Switch>
  </Router>
  );
}

export default App;
