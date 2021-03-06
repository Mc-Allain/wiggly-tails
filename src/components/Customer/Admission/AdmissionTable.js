import axios from "axios";
import React, { Component } from "react";

import ViewAdmissionModal from "./ViewAdmissionModal.js";
import TablePagination from "../../TablePagination";

class AdmissionTable extends Component {
  state = {
    customer: {
      id: "",
      customerId: "",
      fullName: "",
    }
  };

  renderItems = (admission) => {
    const { recordsPerPage, recordStartIndex } = this.props;
    let items = [];
    const recordStopIndex =
      admission.length <= recordStartIndex + recordsPerPage
        ? admission.length
        : recordStartIndex + recordsPerPage;

    for (var i = this.props.recordStartIndex; i < recordStopIndex; i++) {
      let index = i;
      items.push(
        <tr key={admission[i].id} className="table-row">
          <td>{admission[i].title}</td>
          <td className="d-none d-md-table-cell">{admission[i].content}</td>
          <td className="d-table-cell">
            <button
              className="btn btn-outline-primary btn-sm mr-1"
              data-toggle="modal"
              data-target={"#viewAdmissionModal-" + admission[i].id}
              onClick={() => this.logAdmissionView(admission[index].id)}
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

  logAdmissionView = (id) => {
    const customer = { ...this.state.customer };
    customer.id = id;
    this.setState({ customer }, () => {
      axios.post(
        "http://princemc.heliohost.us/veterinaryClinic/logAdmissionView.php",
        customer
      );
    });
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
      admission,
      onRefresh,
      onSearch,
      searchValue,
      onClear,
      history,
      connected,
      setPage,
      recordsPerPage,
      recordStartIndex,
      activePage
    } = this.props;
    const { state } = history.location;
    return (
      <React.Fragment>
        <div className="d-flex mb-2">
          <button className="btn btn-warning mr-2 ml-auto" onClick={onRefresh}>
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
              <th colSpan="3">
                <div className="row align-items-center">
                  <div
                    className="col-12 col-md-6 text-center mb-2 pb-2
                                    m-md-0 p-md-0 bottom-border-dark border-md-0"
                  >
                    {"Pet Name: " + state.petName}
                  </div>
                  <div className="col-12 col-md-6 text-center">
                    {"Transaction Date: " + state.transDate}
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th>Title</th>
              <th className="d-none d-md-table-cell">Content</th>
              <th className="d-table-cell w-100px">Action</th>
            </tr>
          </thead>
          <tbody>
            {admission.length > 0 && connected
              ? this.renderItems(admission)
              : null}
          </tbody>
        </table>
        {admission.length > 0 && connected ? (
          <TablePagination
            setPage={setPage}
            recordsPerPage={recordsPerPage}
            recordStartIndex={recordStartIndex}
            activePage={activePage}
            totalRecords={admission.length}
          />
        ) : null}
        {admission.map((admission) => (
          <ViewAdmissionModal
            key={admission.id}
            admission={admission}
            onRefresh={onRefresh}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default AdmissionTable;
