import axios from "axios";
import React, { Component } from "react";

import AdminNavbar from "../AdminNavbar.js";
import EmployeesTable from "./EmployeesTable.js";
import Footer from "../../Footer.js";

class ManageEmployees extends Component {
  state = {
    employees: [],
    connected: false,
    connectionFailed: false,
    searchValue: "",
  };

  componentDidMount() {
    this.getData();
  }

  onSubmitForm = () => {
    const connected = false;
    const connectionFailed = false;
    this.setState({ connected, connectionFailed });
  };

  onRefresh = () => {
    this.getData();
    this.onSubmitForm();
  };

  onSearch = (e) => {
    const searchValue = e.target.value;
    searchValue.length > 0 ? this.searchData(searchValue) : this.getData();
    const connected = false;
    const connectionFailed = false;
    this.setState({ connected, connectionFailed, searchValue });
  };

  onClear = () => {
    const searchValue = "";
    this.getData();
    const connected = false;
    const connectionFailed = false;
    this.setState({ connected, connectionFailed, searchValue });
  };

  onBackToLogin = () => {
    const { history } = this.props;
    const link = "/wiggly-tails";
    history.replace(link, { verified: true });
  };

  renderForbidden = () => {
    return (
      <div className="container-fluid">
        <div className="row min-h-full justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6 form-light">
            <div className="alert alert-warning text-warning text-center my-3 mx-1 py-4">
              <div className="d-flex justify-content-center align-items-center">
                <i className="fa fa-exclamation fa-lg"></i>
                <span className="ml-2">
                  <h2 className="font-weight-normal">Forbidden Access</h2>
                </span>
              </div>
              <h5 className="font-weight-light">
                Please login the Master account first.
              </h5>
            </div>
            <div className="text-center mb-3">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={this.onBackToLogin}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderContent = () => {
    const { history } = this.props;
    return (
      <React.Fragment>
        <AdminNavbar sourceId={1} activeId={5} history={this.props.history} />
        <div className="container-fluid">
          <div className="min-h-full row bg-light justify-content-center text-dark pt-4">
            <div className="col-12 mt-5 table-responsive">
              <h3>Manage Employees</h3>
              <EmployeesTable
                employees={this.state.employees}
                history={history}
                onRefresh={this.onRefresh}
                onSearch={this.onSearch}
                searchValue={this.state.searchValue}
                onClear={this.onClear}
                connected={this.state.connected}
                onSubmitForm={this.onSubmitForm}
              />
              <div className="text-center mt-5">
                {this.state.connected ? (
                  this.state.employees.length === 0 ? (
                    <h1>No Record Found</h1>
                  ) : null
                ) : this.state.connectionFailed ? (
                  <div className="text-danger">
                    <h1 className="mb-1">Database Connection Failed</h1>
                    <h3 className="mb-3">Please try again later.</h3>
                    <button
                      type="button"
                      className="btn btn-primary btn-lg"
                      onClick={this.onRefresh}
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <React.Fragment>
                    <h1 className="mb-1">Loading Data</h1>
                    <h3>Please wait...</h3>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  };

  render() {
    const { history } = this.props;
    let verified = false;
    try {
      verified = history.location.state.verified;
    } catch (error) {
      verified = false;
    }

    return (
      <React.Fragment>
        {verified ? this.renderContent() : this.renderForbidden()}
      </React.Fragment>
    );
  }

  getData = () => {
    axios
      .get("https://princemc.heliohost.us/veterinaryClinic/viewEmployees.php")
      .then((res) => {
        const employees = res.data;
        const connected = true;
        this.setState({ employees, connected });
      })
      .catch((error) => {
        console.log(error);
        const connectionFailed = true;
        this.setState({ connectionFailed });
      });
  };

  searchData = (searchValue) => {
    axios
      .get(
        "https://princemc.heliohost.us/veterinaryClinic/searchEmployee.php?search=" +
          searchValue
      )
      .then((res) => {
        const employees = res.data;
        const connected = true;
        this.setState({ employees, connected });
      })
      .catch((error) => {
        console.log(error);
        const connectionFailed = true;
        this.setState({ connectionFailed });
      });
  };
}

export default ManageEmployees;
