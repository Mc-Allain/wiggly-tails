import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';

import './App.css';

import Index from './components/Index/Index.js';

import Customer from './components/Customer/Customer.js';
import ViewTransactions from './components/Customer/Transactions/ViewTransactions.js';
import ViewAdmission from './components/Customer/Admission/ViewAdmission.js';
import CustomerManagePets from './components/Customer/Pets/ManagePets.js';
import AboutUs from './components/Customer/AboutUs.js';

import Admin from './components/Admin/Admin.js';
import ManageTransactions from './components/Admin/Transactions/ManageTransactions.js';
import ManageAdmission from './components/Admin/Admission/ManageAdmission.js';
import ManageCustomers from './components/Admin/Customers/ManageCustomers';
import ManagePets from './components/Admin/Pets/ManagePets';
import ManageEmployees from './components/Admin/Employees/ManageEmployees.js';
import AdminAboutUs from './components/Admin/AboutUs.js';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/wiggly-tails" component={Index} />

        <Route exact path="/wiggly-tails/customer" component={Customer} />
        <Route path="/wiggly-tails/customer/view-transactions" component={ViewTransactions} />
        <Route path="/wiggly-tails/customer/view-admission" component={ViewAdmission} />
        <Route path="/wiggly-tails/customer/manage-pets" component={CustomerManagePets} />
        <Route path="/wiggly-tails/customer/about-us" component={AboutUs} />

        <Route exact path="/wiggly-tails/admin" component={Admin} />
        <Route path="/wiggly-tails/admin/manage-transactions" component={ManageTransactions} />
        <Route path="/wiggly-tails/admin/manage-admission" component={ManageAdmission} />
        <Route path="/wiggly-tails/admin/manage-customers" component={ManageCustomers} />
        <Route path="/wiggly-tails/admin/manage-pets" component={ManagePets} />
        <Route path="/wiggly-tails/admin/manage-employees" component={ManageEmployees} />
        <Route path="/wiggly-tails/admin/about-us" component={AdminAboutUs} />
      </Switch>
    </Router>
  );
}

export default App;
