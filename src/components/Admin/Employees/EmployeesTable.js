import axios from "axios";
import React, { Component } from "react";

import TablePagination from "../../TablePagination";
import AddEmployeeModal from "./AddEmployeeModal";
import ViewEmployeeModal from "./ViewEmployeeModal";

class EmployeesTable extends Component {
  state = {
    recordsPerPage: 10,
    recordStartIndex: 0,
    activePage: 1,
    admin: {
      id: "",
      adminId: "",
      fullName: "",
    },
  };

  renderItems = (employees) => {
    const { recordsPerPage, recordStartIndex } = this.state;
    const { history } = this.props;
    const { state } = history.location;
    let items = [];
    const recordStopIndex =
      employees.length <= recordStartIndex + recordsPerPage
        ? employees.length
        : recordStartIndex + recordsPerPage;

    for (var i = this.state.recordStartIndex; i < recordStopIndex; i++) {
      let index = i;
      items.push(
        <tr key={employees[i].id} className="table-row">
          <td>
            {employees[i].empLastName +
              ", " +
              employees[i].empFirstName +
              " " +
              employees[i].empMiddleName}
          </td>
          <td className="d-none d-sm-table-cell">{employees[i].empType}</td>
          <td>
            {state.empType === "Admin" &&
            (employees[i].empType === "Master Admin" ||
              (employees[i].empType === "Admin" &&
                employees[i].id !== state.adminId)) ? (
              <button
                className="btn btn-outline-secondary btn-sm mr-1"
                disabled
              >
                <i className="fa fa-eye"></i>
                <span className="ml-1">View</span>
              </button>
            ) : (
              <button
                className="btn btn-outline-primary btn-sm mr-1"
                data-toggle="modal"
                data-target={"#viewEmployeeModal-" + employees[i].id}
                onClick={() => this.logEmployeeView(employees[index].id)}
              >
                <i className="fa fa-eye"></i>
                <span className="ml-1">View</span>
              </button>
            )}
          </td>
        </tr>
      );
    }

    return [items];
  };

  logEmployeeView = (id) => {
    const admin = { ...this.state.admin };
    admin.id = id;
    this.setState({ admin }, () => {
      axios.post(
        "http://princemc.heliohost.us/veterinaryClinic/logEmployeeView.php",
        admin
      );
    });
  };

  setPage = (recordStartIndex, activePage) => {
    this.setState({ recordStartIndex, activePage });
  };

  componentDidMount = () => {
    const { history } = this.props;
    const admin = { ...this.state.admin };
    admin.adminId = history.location.state.adminId;
    admin.fullName = history.location.state.adminName;
    this.setState({ admin });
  };

  render() {
    const {
      employees,
      onRefresh,
      onSearch,
      searchValue,
      onClear,
      connected,
      onSubmitForm,
      history,
    } = this.props;
    const { recordsPerPage, recordStartIndex, activePage } = this.state;
    return (
      <React.Fragment>
        <div className="d-flex mb-2">
          <button
            className="btn btn-outline-primary mr-auto"
            data-toggle="modal"
            data-target="#addEmployeeModal"
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
              <th>Employee Name</th>
              <th className="d-none d-sm-table-cell">Employee Type</th>
              <th className="w-100px">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 && connected
              ? this.renderItems(employees)
              : null}
          </tbody>
        </table>
        {employees.length > 0 && connected ? (
          <TablePagination
            setPage={this.setPage}
            recordsPerPage={recordsPerPage}
            recordStartIndex={recordStartIndex}
            activePage={activePage}
            totalRecords={employees.length}
          />
        ) : null}
        <AddEmployeeModal
          onRefresh={onRefresh}
          onSubmitForm={onSubmitForm}
          history={history}
        />
        {employees.map((employee) => (
          <ViewEmployeeModal
            key={employee.id}
            employee={employee}
            onRefresh={onRefresh}
            connected={connected}
            onSubmitForm={onSubmitForm}
            history={history}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default EmployeesTable;
