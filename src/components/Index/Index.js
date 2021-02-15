import axios from "axios";
import React, { Component } from "react";

import Navbar from "./Navbar.js";
import IndexCarousel from "./IndexCarousel.js";
import CustomerLoginForm from "./Forms/CustomerLoginForm.js";
import EmployeeLoginForm from "./Forms/EmployeeLoginForm.js";
import RegistrationModal from "./Forms/RegistrationModal.js";
import Footer from "../Footer.js";

class EmployeeLogin extends Component {
  state = {
    activeId: 2,
    customers: [],
    customerConnected: false,
    customerConnectionFailed: false,
    employees: [],
    employeeConnected: false,
    employeeConnectionFailed: false,
  };

  componentDidMount = () => {
    this.getCustomersData();
    this.getEmployeesData();
  };

  retryCustomersData = () => {
    this.getCustomersData();
    this.onRegister();
  };

  retryEmployeesData = () => {
    this.getEmployeesData();
    const employeeConnected = false;
    const employeeConnectionFailed = false;
    this.setState({ employeeConnected, employeeConnectionFailed });
  };

  onRegister = () => {
    const customerConnected = false;
    const customerConnectionFailed = false;
    this.setState({ customerConnected, customerConnectionFailed });
  };

  switchActiveId = (id) => {
    const activeId = id;
    this.setState({ activeId });
  };

  render() {
    return (
      <React.Fragment>
        <Navbar
          activeId={this.state.activeId}
          sourceId={1}
          switchActiveId={this.switchActiveId}
        />
        <div className="container-fluid">
          <div className="h-full row bg-warning justify-content-center text-dark">
            <div className="col-lg-7 d-lg-inline d-none align-self-center">
              <IndexCarousel />
            </div>
            <div className="col-lg-5 bg-light">
              <div className="row h-full justify-content-center align-items-center">
                <div className="col-sm-10 col-md-8 col-lg-12">
                  {this.state.activeId === 2 ? (
                    <CustomerLoginForm
                      history={this.props.history}
                      records={this.state.customers}
                      connected={this.state.customerConnected}
                      connectionFailed={this.state.customerConnectionFailed}
                      getData={this.retryCustomersData}
                    />
                  ) : (
                    <EmployeeLoginForm
                      history={this.props.history}
                      records={this.state.employees}
                      connected={this.state.employeeConnected}
                      connectionFailed={this.state.employeeConnectionFailed}
                      getData={this.retryEmployeesData}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <RegistrationModal
          customers={this.state.customers}
          onRegister={this.onRegister}
          getData={this.retryCustomersData}
          connected={this.state.customerConnected}
          connectionFailed={this.state.customerConnectionFailed}
        />
        <Footer />
      </React.Fragment>
    );
  }

  getCustomersData = () => {
    axios
      .get("http://princemc.heliohost.us/veterinaryClinic/viewCustomers.php")
      .then((res) => {
        const customers = res.data;
        const customerConnected = true;
        this.setState({ customers, customerConnected });
      })
      .catch((error) => {
        console.log(error);
        const customerConnectionFailed = true;
        this.setState({ customerConnectionFailed });
      });
  };

  getEmployeesData = () => {
    axios
      .get("http://princemc.heliohost.us/veterinaryClinic/viewEmployees.php")
      .then((res) => {
        const employees = res.data;
        const employeeConnected = true;
        this.setState({ employees, employeeConnected });
      })
      .catch((error) => {
        console.log(error);
        const employeeConnectionFailed = true;
        this.setState({ employeeConnectionFailed });
      });
  };
}

export default EmployeeLogin;
