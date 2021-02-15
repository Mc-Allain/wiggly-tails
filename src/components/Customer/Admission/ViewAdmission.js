import axios from "axios";
import React, { Component } from "react";

import CustomerNavbar from "../CustomerNavbar.js";
import AdmissionTable from "./AdmissionTable.js";
import Footer from "../../Footer.js";
import Forbidden from "../Forbidden.js";

class ViewAdmission extends Component {
  state = {
    admission: [],
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

  renderContent = () => {
    const { history } = this.props;
    return (
      <React.Fragment>
        <CustomerNavbar activeId={1} history={history} />
        <div className="container-fluid">
          <div className="min-h-full row bg-light justify-content-center text-dark pt-4">
            <div className="col-12 mt-5 table-responsive">
              <h3>View Admission</h3>
              <AdmissionTable
                admission={this.state.admission}
                history={history}
                onRefresh={this.onRefresh}
                onSearch={this.onSearch}
                searchValue={this.state.searchValue}
                onClear={this.onClear}
                connected={this.state.connected}
              />
              <div className="text-center mt-5">
                {this.state.connected ? (
                  this.state.admission.length === 0 ? (
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
        {verified ? this.renderContent() : <Forbidden history={history} />}
      </React.Fragment>
    );
  }

  getData = () => {
    const { history } = this.props;
    axios
      .get(
        "http://princemc.heliohost.us/veterinaryClinic/viewTransactionAdmission.php?id=" +
          history.location.state.transId
      )
      .then((res) => {
        const admission = res.data;
        const connected = true;
        this.setState({ admission, connected });
      })
      .catch((error) => {
        console.log(error);
        const connectionFailed = true;
        this.setState({ connectionFailed });
      });
  };

  searchData = (searchValue) => {
    const { history } = this.props;
    axios
      .get(
        "http://princemc.heliohost.us/veterinaryClinic/searchTransactionAdmission.php?id=" +
          history.location.state.admissionId +
          "&search=" +
          searchValue
      )
      .then((res) => {
        const admission = res.data;
        const connected = true;
        this.setState({ admission, connected });
      })
      .catch((error) => {
        console.log(error);
        const connectionFailed = true;
        this.setState({ connectionFailed });
      });
  };

  formatDate = (dateValue) => {
    const MMM = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    dateValue = new Date(dateValue);
    const day = dateValue.getDate();
    const month = MMM[dateValue.getMonth()];
    const year = dateValue.getFullYear();

    return year + "-" + month + "-" + day;
  };
}

export default ViewAdmission;
