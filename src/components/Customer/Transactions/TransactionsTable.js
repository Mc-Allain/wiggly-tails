import axios from "axios";
import React, { Component } from "react";

import ViewTransactionModal from "./ViewTransactionModal.js";
import TablePagination from "../../TablePagination";

class TransactionsTable extends Component {
  state = {
    customer: {
      id: "",
      customerId: "",
      fullName: "",
    }
  };

  renderItems = (transactions) => {
    const { recordsPerPage, recordStartIndex } = this.state;
    let items = [];
    const recordStopIndex =
      transactions.length <= recordStartIndex + recordsPerPage
        ? transactions.length
        : recordStartIndex + recordsPerPage;

    for (var i = this.state.recordStartIndex; i < recordStopIndex; i++) {
      let index = i;
      items.push(
        <tr key={transactions[i].id} className="table-row">
          <td>{this.formatDate(transactions[i].transDate)}</td>
          <td>{transactions[i].petName}</td>
          <td className="d-none d-lg-table-cell">
            {transactions[i].petWeight}
          </td>
          <td className="d-none d-md-table-cell">
            {transactions[i].empLastName +
              ", " +
              transactions[i].empFirstName +
              " " +
              transactions[i].empMiddleName}
          </td>
          <td className="d-none d-sm-table-cell">
            {this.formatTransType(transactions[i].transType)}
          </td>
          <td>
            <button
              className="btn btn-outline-primary btn-sm mr-1"
              data-toggle="modal"
              data-target={"#viewTransactionModal-" + transactions[i].id}
              onClick={() => this.logTransactionView(transactions[index].id)}
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

  logTransactionView = (id) => {
    const customer = { ...this.state.customer };
    customer.id = id;
    this.setState({ customer }, () => {
      axios.post(
        "http://princemc.heliohost.us/veterinaryClinic/logTransactionView.php",
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
      transactions,
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
              <th>Transaction Date</th>
              <th>Pet Name</th>
              <th className="w-110px d-none d-lg-table-cell">Pet Weight</th>
              <th className="d-none d-md-table-cell">Served by</th>
              <th className="w-110px d-none d-sm-table-cell">Trans. Type</th>
              <th className="w-100px">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 && connected
              ? this.renderItems(transactions)
              : null}
          </tbody>
        </table>
        {transactions.length > 0 && connected ? (
          <TablePagination
            setPage={setPage}
            recordsPerPage={recordsPerPage}
            recordStartIndex={recordStartIndex}
            activePage={activePage}
            totalRecords={transactions.length}
          />
        ) : null}
        {transactions.map((transaction) => (
          <ViewTransactionModal
            key={transaction.id}
            transaction={transaction}
            onRefresh={onRefresh}
            history={history}
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

  formatTransType = (transType) => {
    return transType === "C" ? "Check-up" : "Groom";
  };
}

export default TransactionsTable;
