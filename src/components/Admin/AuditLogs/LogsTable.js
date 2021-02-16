import axios from "axios";
import React, { Component } from "react";

import ViewLogModal from "./ViewLogModal.js";
import TablePagination from "../../TablePagination";

class LogsTable extends Component {
  state = {
    employee: {
      id: "",
      empId: "",
      empName: "",
    }
  };

  renderItems = (logs) => {
    const { recordsPerPage, recordStartIndex } = this.props;
    let items = [];
    const recordStopIndex =
      logs.length <= recordStartIndex + recordsPerPage
        ? logs.length
        : recordStartIndex + recordsPerPage;

    for (var i = this.props.recordStartIndex; i < recordStopIndex; i++) {
      let index = i;
      items.push(
        <tr key={logs[i].id} className="table-row">
          <td>{logs[i].id}</td>
          <td>{this.formatDate(logs[i].timestamp)}</td>
          <td className="d-none d-sm-table-cell">{logs[i].activity}</td>
          <td className="d-table-cell">
            <button
              className="btn btn-outline-primary btn-sm mr-1"
              data-toggle="modal"
              data-target={"#viewLogModal-" + logs[i].id}
              onClick={() => this.logLogView(logs[index].id)}
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

  logLogView = (id) => {
    const employee = { ...this.state.employee };
    employee.id = id;
    this.setState({ employee }, () => {
      axios.post(
        "http://princemc.heliohost.us/veterinaryClinic/logLogView.php",
        employee
      );
    });
  };

  componentDidMount = () => {
    const { history } = this.props;
    const employee = { ...this.state.employee };
    employee.empId = history.location.state.id;
    employee.empName = history.location.state.fullName;
    this.setState({ employee });
  };

  render() {
    const {
      logs,
      onRefresh,
      onSearch,
      searchValue,
      onClear,
      connected,
      setPage,
      recordsPerPage,
      recordStartIndex,
      activePage
    } = this.props;
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
              <th>ID</th>
              <th>Timestamp</th>
              <th className="d-none d-sm-table-cell">Activity</th>
              <th className="d-table-cell w-100px">Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 && connected ? this.renderItems(logs) : null}
          </tbody>
        </table>
        {logs.length > 0 && connected ? (
          <TablePagination
            setPage={setPage}
            recordsPerPage={recordsPerPage}
            recordStartIndex={recordStartIndex}
            activePage={activePage}
            totalRecords={logs.length}
          />
        ) : null}
        {logs.map((log) => (
          <ViewLogModal key={log.id} log={log} onRefresh={onRefresh} />
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

    dateValue = new Date(dateValue + "+00:00");
    const day = dateValue.getDate();
    const month = MMM[dateValue.getMonth()];
    const year = dateValue.getFullYear();

    let time = "AM";
    let hour = dateValue.getHours();
    if(hour === 0) {
      hour = 12;
    }
    if (hour > 12) {
      hour -= 12;
      time = "PM";
    }
    if (hour < 10) hour = "0" + hour;

    let minute = dateValue.getMinutes();
    if (minute < 10) {
      minute = "0" + minute;
    }

    let second = dateValue.getSeconds();
    if (second < 10) {
      second = "0" + second;
    }

    return (
      year +
      "-" +
      month +
      "-" +
      day +
      " | " +
      hour +
      ":" +
      minute +
      ":" +
      second +
      " " +
      time
    );
  };
}

export default LogsTable;
