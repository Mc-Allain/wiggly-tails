import axios from "axios";
import React, { Component } from "react";

import CustomerNavbar from "../CustomerNavbar.js";
import PetsTable from "./PetsTable.js";
import Footer from "../../Footer.js";
import Forbidden from "../Forbidden.js";

class ManagePets extends Component {
  state = {
    pets: [],
    connected: false,
    connectionFailed: false,
    searchValue: "",
    recordsPerPage: 10,
    recordStartIndex: 0,
    activePage: 1
  };

  componentDidMount() {
    this.getData();
  }

  setPage = (recordStartIndex, activePage) => {
    this.setState({ recordStartIndex, activePage });
  };

  onSubmitForm = () => {
    const connected = false;
    const connectionFailed = false;
    const activePage = 1;
    const recordStartIndex = 0;
    this.setState({ connected, connectionFailed, activePage, recordStartIndex });
  };

  onRefresh = () => {
    const searchValue = this.state;
    searchValue.length > 0 ? this.searchData(searchValue) : this.getData();
    this.onSubmitForm();
  };

  onSearch = (e) => {
    const searchValue = e.target.value;
    searchValue.length > 0 ? this.searchData(searchValue) : this.getData();
    const connected = false;
    const connectionFailed = false;
    const activePage = 1;
    const recordStartIndex = 0;
    this.setState({ connected, connectionFailed, searchValue, activePage, recordStartIndex });
  };

  onClear = () => {
    const searchValue = "";
    this.getData();
    const connected = false;
    const connectionFailed = false;
    const activePage = 1;
    const recordStartIndex = 0;
    this.setState({ connected, connectionFailed, searchValue, activePage, recordStartIndex });
  };

  renderContent = () => {
    const { history } = this.props;
    return (
      <React.Fragment>
        <CustomerNavbar activeId={2} history={history} />
        <div className="container-fluid">
          <div className="min-h-full row bg-light justify-content-center text-dark pt-4">
            <div className="col-12 mt-5 table-responsive">
              <h3>Manage Pets</h3>
              <PetsTable
                pets={this.state.pets}
                ownerId={history.location.state.id}
                onRefresh={this.onRefresh}
                onSearch={this.onSearch}
                history={history}
                searchValue={this.state.searchValue}
                onClear={this.onClear}
                connected={this.state.connected}
                onSubmitForm={this.onSubmitForm}
                setPage = {this.setPage}
                recordsPerPage={this.state.recordsPerPage}
                recordStartIndex={this.state.recordStartIndex}
                activePage={this.state.activePage}
              />
              <div className="text-center mt-5">
                {this.state.connected ? (
                  this.state.pets.length === 0 ? (
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
        "http://princemc.heliohost.us/veterinaryClinic/viewAccountPets.php?id=" +
          history.location.state.id
      )
      .then((res) => {
        const pets = res.data;
        const connected = true;
        this.setState({ pets, connected });
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
        "http://princemc.heliohost.us/veterinaryClinic/searchAccountPet.php?id=" +
          history.location.state.id +
          "&search=" +
          searchValue
      )
      .then((res) => {
        const pets = res.data;
        const connected = true;
        this.setState({ pets, connected });
      })
      .catch((error) => {
        console.log(error);
        const connectionFailed = true;
        this.setState({ connectionFailed });
      });
  };
}

export default ManagePets;
