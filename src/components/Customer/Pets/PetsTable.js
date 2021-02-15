import axios from "axios";
import React, { Component } from "react";

import TablePagination from "../../TablePagination.js";
import AddPetModal from "./AddPetModal.js";
import ViewPetModal from "./ViewPetModal.js";

class PetsTable extends Component {
  state = {
    recordsPerPage: 10,
    recordStartIndex: 0,
    activePage: 1,
    customer: {
      id: "",
      customerId: "",
      fullName: "",
    },
  };

  renderItems = (pets) => {
    const { recordsPerPage, recordStartIndex } = this.state;
    let items = [];
    const recordStopIndex =
      pets.length <= recordStartIndex + recordsPerPage
        ? pets.length
        : recordStartIndex + recordsPerPage;

    for (var i = this.state.recordStartIndex; i < recordStopIndex; i++) {
      let index = i;
      items.push(
        <tr key={pets[i].id} className="table-row">
          <td>{pets[i].petName}</td>
          <td className="d-none d-md-table-cell">
            {this.formatDate(pets[i].birthdate)}
          </td>
          <td className="d-none d-lg-table-cell">{pets[i].petClass}</td>
          <td className="d-none d-sm-table-cell">
            {pets[i].lastVisit === null
              ? "Not visiting yet"
              : this.formatDate(pets[i].lastVisit)}
          </td>
          <td>
            <button
              className="btn btn-outline-primary btn-sm mr-1"
              data-toggle="modal"
              data-target={"#viewPetModal" + pets[i].id}
              onClick={() => this.logPetView(pets[index].id)}
            >
              <i className="fa fa-eye"></i>
              <span className="ml-1">View</span>
            </button>
          </td>
        </tr>
      );
    }

    return [items];
  };

  logPetView = (id) => {
    const customer = { ...this.state.customer };
    customer.id = id;
    this.setState({ customer }, () => {
      axios.post(
        "http://princemc.heliohost.us/veterinaryClinic/logPetView.php",
        customer
      );
    });
  };

  setPage = (recordStartIndex, activePage) => {
    this.setState({ recordStartIndex, activePage });
  };

  componentDidMount = () => {
    const { history } = this.props;
    const customer = { ...this.state.customer };
    customer.customerId = history.location.state.id;
    customer.fullName = history.location.state.fullName;
    this.setState({ customer });
  };

  render() {
    const {
      pets,
      ownerId,
      onRefresh,
      onSearch,
      searchValue,
      onClear,
      connected,
      onSubmitForm,
    } = this.props;
    const { recordsPerPage, recordStartIndex, activePage } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex mb-2">
          <button
            className="btn btn-outline-primary mr-auto"
            data-toggle="modal"
            data-target="#addPetModal"
          >
            <i className="fa fa-plus"></i>
            <span className="ml-1 d-sm-inline d-none">New</span>
          </button>
          <button className="btn btn-warning mr-2" onClick={onRefresh}>
            <i className="fa fa-sync"></i>
            <span className="ml-1 d-sm-inline d-none">Refresh</span>
          </button>
          <input
            type="text"
            className="form-control w-25 min-w-175px"
            placeholder="Search"
            onChange={onSearch}
            value={searchValue}
          ></input>
          <button className="btn btn-danger ml-2" onClick={onClear}>
            <i className="fa fa-eraser"></i>
            <span className="ml-1 d-sm-inline d-none">Clear</span>
          </button>
        </div>

        <table className="table table-bordered">
          <thead className="thead-dark text-light">
            <tr>
              <th>Pet Name</th>
              <th className="d-none d-md-table-cell">Birthdate</th>
              <th className="d-none d-lg-table-cell">Pet Class</th>
              <th className="d-none d-sm-table-cell">Last Visit</th>
              <th className="w-100px">Action</th>
            </tr>
          </thead>
          <tbody>
            {pets.length > 0 && connected ? this.renderItems(pets) : null}
          </tbody>
        </table>
        {pets.length > 0 && connected ? (
          <TablePagination
            setPage={this.setPage}
            recordsPerPage={recordsPerPage}
            recordStartIndex={recordStartIndex}
            activePage={activePage}
            totalRecords={pets.length}
          />
        ) : null}
        <AddPetModal
          onRefresh={onRefresh}
          ownerId={ownerId}
          onSubmitForm={onSubmitForm}
        />
        {pets.map((pet) => (
          <ViewPetModal
            key={pet.id}
            pet={pet}
            onRefresh={onRefresh}
            connected={connected}
            onSubmitForm={onSubmitForm}
          />
        ))}
      </React.Fragment>
    );
  }

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

export default PetsTable;
