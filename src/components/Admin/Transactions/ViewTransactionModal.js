import axios from "axios";
import { isNumeric } from "jquery";
import React, { Component } from "react";

class ViewTransactionModal extends Component {
  state = {
    record: {
      id: "",
      transType: "",
      transDate: "",
      petId: "",
      petName: "",
      customerId: "",
      customerName: "",
      petWeight: "",
      remarks: "",
      empId: "",
      empName: "",
      checkUp: {
        findings: "",
        treatment: "",
        admissionDate: "",
        releasedDate: "",
        addInfo: "",
      },
      groom: {
        activity: "",
      },
      lastVisit: "",
      prevVisit: "",
      employee: {
        empId: "",
        empName: "",
      },
    },
    errors: {
      transType: "",
      petId: "",
      customerId: "",
      petWeight: "",
      remarks: "",
      empId: "",
      checkUpErrors: {
        findings: "",
        treatment: "",
        addInfo: "",
      },
      groomErrors: {
        activity: "",
      },
    },
    checkUpConnected: false,
    checkUpConnectionFailed: false,
    groomConnected: false,
    groomConnectionFailed: false,
    connected: false,
    customer: {
      search: false,
      searchValue: "",
    },
    pet: {
      search: false,
      searchValue: "",
    },
    employee: {
      search: false,
      searchValue: "",
    },
    submitError: false,
    submitted: false,
    updated: false,
    failed: false,
  };

  componentDidMount = () => {
    const { transaction, history } = this.props;
    if (transaction.transType === "C") {
      this.getCheckUpData(transaction.id);
    } else if (transaction.transType === "G") {
      this.getGroomData(transaction.id);
    }

    const record = { ...this.state.record };
    const checkUp = { ...this.state.record.checkUp };
    const groom = { ...this.state.record.groom };

    record.id = transaction.id;
    record.transType = transaction.transType;
    record.transDate = transaction.transDate;
    record.petId = transaction.petId;
    record.petName = transaction.petName;
    record.customerId = transaction.customerId;
    record.customerName =
      transaction.lastName +
      ", " +
      transaction.firstName +
      " " +
      transaction.middleName;
    record.petWeight = transaction.petWeight;
    record.remarks = transaction.remarks;
    record.empId = transaction.empId;
    record.empName =
      transaction.empLastName +
      ", " +
      transaction.empFirstName +
      " " +
      transaction.empMiddleName;
    record.checkUp = checkUp;
    record.groom = groom;

    record.employee.empId = history.location.state.id;
    record.employee.empName = history.location.state.fullName;

    this.setState({ record });
  };

  getCurrentDate = () => {
    const dateObj = new Date();
    const currentMonth =
      dateObj.getMonth() + 1 < 10
        ? "0" + (dateObj.getMonth() + 1)
        : dateObj.getMonth() + 1;
    const currentDay =
      dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
    const currentDate =
      dateObj.getFullYear() + "-" + currentMonth + "-" + currentDay;
    return currentDate;
  };

  onChangeRecord = (e) => {
    let { name, value } = e.target;

    if (name === "remarks") {
      value = this.toSentenceCase(value);
    }

    this.setState(
      (currentState) => ({
        ...currentState,
        record: {
          ...currentState.record,
          [name]: value,
        },
      }),
      () => this.onCheckRecordErrors(e)
    );

    if (name === "transType") {
      const checkUp = { ...this.state.record.checkUp };
      const checkUpErrors = { ...this.state.errors.checkUpErrors };

      checkUp.findings = "";
      checkUp.treatment = "";
      const currentDate = this.getCurrentDate();
      checkUp.admissionDate = currentDate;
      checkUp.releasedDate = currentDate;
      checkUp.addInfo = "";

      checkUpErrors.findings = " ";
      checkUpErrors.treatment = " ";
      checkUpErrors.addInfo = "";

      const groom = { ...this.state.record.groom };
      const groomErrors = { ...this.state.errors.groomErrors };

      groom.activity = "";

      groomErrors.activity = " ";

      const checkUpConnected = true;
      const groomConnected = true;
      const connected = true;

      this.setState((currentState) => ({
        ...currentState,
        record: {
          ...currentState.record,
          checkUp,
          groom,
        },
        errors: {
          ...currentState.errors,
          checkUpErrors,
          groomErrors,
        },
        checkUpConnected,
        groomConnected,
        connected,
      }));
    }
  };

  onCheckRecordErrors = (e) => {
    const { name, value } = e.target;
    const errors = { ...this.state.errors };

    switch (name) {
      case "transType":
        errors.transType = value.length === 0 ? " " : "";
        break;

      case "empId":
        errors.empId = value.length === 0 ? " " : "";
        break;

      case "customerId":
        errors.customerId = value.length === 0 ? " " : "";
        break;

      case "petId":
        errors.petId = value.length === 0 ? " " : "";
        break;

      case "petWeight":
        errors.petWeight =
          value.length === 0
            ? " "
            : !isNumeric(value)
            ? "Please input a valid value"
            : value.length > 6
            ? "Must be at maximum of 6 numbers"
            : "";
        break;

      case "remarks":
        errors.remarks =
          value.length > 128 ? "Must be at maximum of 128 characters" : "";
        break;

      default:
        break;
    }

    this.setState({ errors }, () => {
      if (name === "customerId") {
        const record = { ...this.state.record };
        record.petId = "";
        errors.petId = " ";
        this.setState({ record, errors });
        const pet = { ...this.state.pet };
        if (pet.search) this.onTogglePetSearch();
      }
    });
  };

  onChangeCheckUp = (e) => {
    let { name, value } = e.target;

    if (name !== "admissionDate" && name !== "releasedDate") {
      value = this.toSentenceCase(value);
    }

    this.setState(
      (currentState) => ({
        ...currentState,
        record: {
          ...currentState.record,
          checkUp: {
            ...currentState.record.checkUp,
            [name]: value,
          },
        },
      }),
      () => this.onCheckCheckUpErrors(e)
    );
  };

  onCheckCheckUpErrors = (e) => {
    const { name, value } = e.target;
    const checkUpErrors = { ...this.state.errors.checkUpErrors };
    const properLength = this.removeSpaces(value).length;

    switch (name) {
      case "findings":
        checkUpErrors.findings =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 128
            ? "Must be at between 2 and 128 characters"
            : properLength === 0
            ? " "
            : "";
        break;

      case "treatment":
        checkUpErrors.treatment =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 128
            ? "Must be at between 2 and 128 characters"
            : properLength === 0
            ? " "
            : "";
        break;

      case "addInfo":
        checkUpErrors.addInfo =
          value.length > 128 ? "Must be at maximum of 128 characters" : "";
        break;

      default:
        break;
    }

    this.setState((currentState) => ({
      ...currentState,
      errors: {
        ...currentState.errors,
        checkUpErrors,
      },
    }));
  };

  onChangeGroom = (e) => {
    let { name, value } = e.target;

    if (name === "activity") {
      value = this.toSentenceCase(value);
    }

    this.setState(
      (currentState) => ({
        ...currentState,
        record: {
          ...currentState.record,
          groom: {
            ...currentState.record.groom,
            [name]: value,
          },
        },
      }),
      () => this.onCheckGroomErrors(e)
    );
  };

  onCheckGroomErrors = (e) => {
    const { name, value } = e.target;
    const groomErrors = { ...this.state.errors.groomErrors };
    const properLength = this.removeSpaces(value).length;

    switch (name) {
      case "activity":
        groomErrors.activity =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 32
            ? "Must be at between 2 and 32 characters"
            : properLength === 0
            ? " "
            : "";
        break;

      default:
        break;
    }

    this.setState((currentState) => ({
      ...currentState,
      errors: {
        ...currentState.errors,
        groomErrors,
      },
    }));
  };

  onSubmit = () => {
    const errors = { ...this.state.errors };

    if (this.validForm({ errors })) {
      const { onRefresh } = this.props;
      const record = { ...this.state.record };

      record.remarks = this.removeLastSpace(record.remarks);
      record.checkUp.findings = this.removeLastSpace(record.checkUp.findings);
      record.checkUp.treatment = this.removeLastSpace(record.checkUp.treatment);
      record.checkUp.addInfo = this.removeLastSpace(record.checkUp.addInfo);
      record.groom.activity = this.removeLastSpace(record.groom.activity);

      const petRecord = this.props.pets.filter(
        (row) => record.petId === row.id
      );

      if (petRecord[0].lastVisit === null || petRecord[0].lastVisit === "") {
        record.lastVisit = record.id;
      } else {
        const lastVisit = this.props.transactions.filter(
          (row) => petRecord[0].lastVisit === row.transDate
        );

        record.lastVisit =
          petRecord[0].lastVisit > record.transDate
            ? lastVisit[0].id
            : record.id;
      }

      const transactions = this.props.transactions.filter(
        (row) => this.props.transaction.petId === row.petId
      );

      record.prevVisit = transactions.length > 1 ? transactions[1].id : "";

      this.props.onSubmitForm();
      this.submission();

      axios
        .post(
          "http://princemc.heliohost.us/veterinaryClinic/updateTransaction.php",
          record
        )
        .then(() => {
          onRefresh();
          this.postSubmit();
        })
        .catch((error) => {
          console.log(error);
          onRefresh();
          this.failedSubmit();
        });
    } else {
      const submitError = true;
      this.setState({ submitError });
    }
  };

  submission = () => {
    const submitted = true;
    const submitError = false;
    this.setState({ submitted, submitError });
  };

  postSubmit = () => {
    const submitted = false;
    let updated = true;
    this.setState({ submitted, updated });
    setTimeout(() => {
      updated = false;
      this.setState({ updated });
    }, 5000);
  };

  failedSubmit = () => {
    const submitted = false;
    let failed = true;
    this.setState({ submitted, failed });
    setTimeout(() => {
      failed = false;
      this.setState({ failed });
    }, 5000);
  };

  validForm = ({ errors }) => {
    const { record } = this.state;
    let valid = true;

    Object.values(errors).forEach((value) => {
      value.length > 0 && (valid = false);
    });

    if (record.transType === "C") {
      Object.values(errors.checkUpErrors).forEach((value) => {
        value.length > 0 && (valid = false);
      });
    } else if (record.transType === "G") {
      Object.values(errors.groomErrors).forEach((value) => {
        value.length > 0 && (valid = false);
      });
    }

    return valid;
  };

  renderRecordErrors = (errorMsg) => {
    if (this.state.submitError) {
      if (errorMsg.length > 0 && errorMsg !== " ") {
        return (
          <small className="text-danger ml-2">
            <i className="fa fa-exclamation text-danger mr-1"></i>
            {errorMsg}
          </small>
        );
      }
    }
  };

  onReset = () => {
    const { transaction } = this.props;
    const checkUpConnected = false;
    const groomConnected = false;
    const connected = false;

    this.setState({ checkUpConnected, groomConnected, connected });

    if (transaction.transType === "C") {
      this.getCheckUpData(transaction.id);
    } else if (transaction.transType === "G") {
      this.getGroomData(transaction.id);
    }

    const record = { ...this.state.record };
    let checkUp = { ...this.state.record.checkUp };
    let groom = { ...this.state.record.groom };
    const errors = { ...this.state.errors };
    const checkUpErrors = { ...this.state.errors.checkUp };
    const groomErrors = { ...this.state.errors.groom };

    const submitError = false;
    const updated = false;
    const failed = false;

    record.id = transaction.id;
    record.transType = transaction.transType;
    record.transDate = transaction.transDate;
    record.petId = transaction.petId;
    record.customerId = transaction.customerId;
    record.petWeight = transaction.petWeight;
    record.remarks = transaction.remarks;
    record.empId = transaction.empId;
    record.checkUp = checkUp;
    record.groom = groom;

    groomErrors.activity = "";
    checkUpErrors.findings = "";
    checkUpErrors.treatment = "";
    checkUpErrors.addInfo = "";

    errors.transType = "";
    errors.petId = "";
    errors.customerId = "";
    errors.remarks = "";
    errors.empId = "";

    errors.checkUpErrors = checkUpErrors;
    errors.groomErrors = groomErrors;

    this.setState({ record, errors, submitError, updated, failed });
  };

  onToggleCustomerSearch = () => {
    const customer = { ...this.state.customer };
    customer.search = !customer.search;
    customer.searchValue = "";
    this.setState({ customer });
  };

  onClearCustomerSearch = () => {
    const customer = { ...this.state.customer };
    customer.searchValue = "";
    this.setState({ customer });
  };

  onChangeCustomerSearch = (e) => {
    const { name, value } = e.target;
    const record = { ...this.state.record };
    const errors = { ...this.state.errors };
    record.customerId = "";
    errors.customerId = " ";
    record.petId = "";
    errors.petId = " ";
    this.setState(
      (currentState) => ({
        ...currentState,
        record,
        errors,
        customer: {
          ...currentState.customer,
          [name]: value,
        },
      }),
      () => {
        const pet = { ...this.state.pet };
        if (pet.search) this.onTogglePetSearch();
      }
    );
  };

  onClearRecordCustomerId = () => {
    const record = { ...this.state.record };
    const errors = { ...this.state.errors };
    record.customerId = "";
    errors.customerId = " ";
    this.setState({ record, errors });
  };

  onTogglePetSearch = () => {
    const pet = { ...this.state.pet };
    pet.search = !pet.search;
    pet.searchValue = "";
    this.setState({ pet });
  };

  onClearPetSearch = () => {
    const pet = { ...this.state.pet };
    pet.searchValue = "";
    this.setState({ pet });
  };

  onChangePetSearch = (e) => {
    const { name, value } = e.target;
    const record = { ...this.state.record };
    const errors = { ...this.state.errors };
    record.petId = "";
    errors.petId = " ";
    this.setState((currentState) => ({
      ...currentState,
      record,
      errors,
      pet: {
        ...currentState.pet,
        [name]: value,
      },
    }));
  };

  onClearRecordPetId = () => {
    const record = { ...this.state.record };
    const errors = { ...this.state.errors };
    record.petId = "";
    errors.petId = " ";
    if (!this.customerIdExists()) {
      record.customerId = "";
      errors.customerId = " ";
    }
    this.setState({ record, errors });
  };

  onToggleEmployeeSearch = () => {
    const employee = { ...this.state.employee };
    employee.search = !employee.search;
    employee.searchValue = "";
    this.setState({ employee });
  };

  onClearEmployeeSearch = () => {
    const employee = { ...this.state.employee };
    employee.searchValue = "";
    this.setState({ employee });
  };

  onChangeEmployeeSearch = (e) => {
    const { name, value } = e.target;
    const record = { ...this.state.record };
    const errors = { ...this.state.errors };
    record.empId = "";
    errors.empId = " ";
    this.setState((currentState) => ({
      ...currentState,
      record,
      errors,
      employee: {
        ...currentState.employee,
        [name]: value,
      },
    }));
  };

  onClearRecordEmpId = () => {
    const record = { ...this.state.record };
    const errors = { ...this.state.errors };
    record.empId = "";
    errors.empId = " ";
    this.setState({ record, errors });
  };

  render() {
    const {
      record,
      errors,
      customer,
      employee,
      pet,
      connected,
      submitted,
      updated,
      failed,
    } = this.state;
    const { transaction } = this.props;
    return (
      <React.Fragment>
        <div
          className="modal fade"
          id={"viewTransactionModal-" + transaction.id}
          tabIndex="-1"
          role="dialog"
          data-backdrop="static"
          aria-labelledby={"viewTransactionModalTitle-" + transaction.id}
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id={"viewTransactionModalTitle-" + transaction.id}
                >
                  Transaction Info
                </h5>
                {!submitted && this.props.connected ? (
                  <button
                    className="btn btn-light text-danger p-1"
                    data-dismiss="modal"
                    onClick={this.onReset}
                  >
                    <i className="fa fa-window-close fa-lg"></i>
                  </button>
                ) : (
                  <button
                    className="btn btn-light text-danger p-1"
                    data-dismiss="modal"
                  >
                    <i className="fa fa-window-close fa-lg"></i>
                  </button>
                )}
              </div>
              <div className="modal-body">
                {submitted ? (
                  <div className="alert alert-primary d-flex align-items-center mb-3">
                    <i className="fa fa-pen text-primary mr-2"></i>
                    <span>Updating a record...</span>
                  </div>
                ) : updated ? (
                  <div className="alert alert-success d-flex align-items-center mb-3">
                    <i className="fa fa-check text-success mr-2"></i>
                    <span>Record was successfully updated.</span>
                  </div>
                ) : failed ? (
                  <div className="alert alert-danger d-flex align-items-center mb-3">
                    <i className="fa fa-exclamation text-danger mr-2"></i>
                    <span>Database Connection Failed.</span>
                  </div>
                ) : null}
                <form className="row form-light mx-2 p-4" noValidate>
                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Transaction Date
                      <span className="text-danger ml-1">
                        *<span className="small ml-1">Required</span>
                      </span>
                    </label>
                    {submitted ? (
                      <input
                        className="form-control"
                        type="date"
                        name="transDate"
                        value={record.transDate}
                        noValidate
                        disabled
                      />
                    ) : (
                      <input
                        className="form-control border border-success"
                        type="date"
                        name="transDate"
                        value={record.transDate}
                        onChange={this.onChangeRecord}
                        noValidate
                      />
                    )}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Transaction Type
                      <span className="text-danger ml-1">*</span>
                    </label>
                    {submitted ? (
                      <select
                        className="form-control"
                        name="transType"
                        value={record.transType}
                        noValidate
                        disabled
                      >
                        <option value="">Choose one</option>
                        <option value="C">Check-up</option>
                        <option value="G">Groom</option>
                      </select>
                    ) : (
                      <select
                        className={this.inputFieldClasses(errors.transType)}
                        name="transType"
                        value={record.transType}
                        onChange={this.onChangeRecord}
                        noValidate
                      >
                        <option value="">Choose one</option>
                        <option value="C">Check-up</option>
                        <option value="G">Groom</option>
                      </select>
                    )}
                    {this.renderRecordErrors(errors.transType)}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Served by<span className="text-danger ml-1">*</span>
                    </label>
                    {this.props.employeeConnected || submitted ? (
                      <React.Fragment>
                        <div className="input-group">
                          {submitted ? (
                            <select
                              className="form-control"
                              name="empId"
                              value={record.empId}
                              noValidate
                              disabled
                            >
                              <option value="">Choose one</option>
                              {this.props.employees.length > 0
                                ? this.props.employees
                                    .filter(
                                      (row) =>
                                        (
                                          row.empLastName +
                                          ", " +
                                          row.empFirstName +
                                          " " +
                                          row.empMiddleName
                                        )
                                          .toLowerCase()
                                          .match(
                                            employee.searchValue.toLowerCase()
                                          ) || employee.searchValue === ""
                                    )
                                    .map((row) => (
                                      <option key={row.id} value={row.id}>
                                        {row.id +
                                          " | " +
                                          row.empLastName +
                                          ", " +
                                          row.empFirstName +
                                          " " +
                                          row.empMiddleName}
                                      </option>
                                    ))
                                : null}
                            </select>
                          ) : this.empIdExists() ||
                            this.state.record.empId === "" ? (
                            <React.Fragment>
                              <select
                                className={
                                  "zi-10 " +
                                  this.inputFieldClasses(errors.empId)
                                }
                                name="empId"
                                value={record.empId}
                                onChange={this.onChangeRecord}
                                noValidate
                              >
                                <option value="">Choose one</option>
                                {this.props.employees.length > 0
                                  ? this.props.employees
                                      .filter(
                                        (row) =>
                                          (
                                            row.empLastName +
                                            ", " +
                                            row.empFirstName +
                                            " " +
                                            row.empMiddleName
                                          )
                                            .toLowerCase()
                                            .match(
                                              employee.searchValue.toLowerCase()
                                            ) || employee.searchValue === ""
                                      )
                                      .map((row) => (
                                        <option key={row.id} value={row.id}>
                                          {row.id +
                                            " | " +
                                            row.empLastName +
                                            ", " +
                                            row.empFirstName +
                                            " " +
                                            row.empMiddleName}
                                        </option>
                                      ))
                                  : null}
                              </select>
                              <div className="input-group-append">
                                <button
                                  type="button"
                                  className="btn btn-light input-group-text"
                                  onClick={this.onToggleEmployeeSearch}
                                >
                                  Search
                                </button>
                              </div>
                            </React.Fragment>
                          ) : (
                            <div className="input-group">
                              <input
                                className="form-control zi-10"
                                value={
                                  "Deleted Record: " +
                                  record.empId +
                                  " | " +
                                  record.empName
                                }
                                noValidate
                                disabled
                              />
                              <div className="input-group-append">
                                <button
                                  type="button"
                                  className="btn btn-light input-group-text"
                                  onClick={this.onClearRecordEmpId}
                                >
                                  Change
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {employee.search && !submitted ? (
                          <div className="input-group">
                            <input
                              className="form-control"
                              type="text"
                              name="searchValue"
                              value={employee.searchValue}
                              onChange={this.onChangeEmployeeSearch}
                              placeholder="Search by Employee Name"
                              noValidate
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                className="btn btn-light input-group-text"
                                onClick={this.onClearEmployeeSearch}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        ) : null}{" "}
                        {this.renderRecordErrors(errors.empId)}
                      </React.Fragment>
                    ) : this.props.employeeConnectionFailed ? (
                      <div className="input-group px-0">
                        <input
                          className="form-control border border-danger zi-10"
                          value="Database Connection Failed: Please try again later."
                          noValidate
                          disabled
                        />
                        <div className="input-group-append justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light input-group-text"
                            onClick={this.props.retryEmployeesData}
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    ) : (
                      <input
                        className="form-control"
                        value="Loading Data: Please wait..."
                        noValidate
                        disabled
                      />
                    )}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Customer ID<span className="text-danger ml-1">*</span>
                    </label>
                    {this.props.customerConnected || submitted ? (
                      <React.Fragment>
                        <div className="input-group">
                          {submitted ? (
                            <select
                              className="form-control"
                              name="customerId"
                              value={record.customerId}
                              noValidate
                              disabled
                            >
                              <option value="">Choose one</option>
                              {this.props.customers.length > 0
                                ? this.props.customers
                                    .filter(
                                      (row) =>
                                        (
                                          row.lastName +
                                          ", " +
                                          row.firstName +
                                          " " +
                                          row.middleName
                                        )
                                          .toLowerCase()
                                          .match(
                                            customer.searchValue.toLowerCase()
                                          ) || customer.searchValue === ""
                                    )
                                    .map((row) => (
                                      <option key={row.id} value={row.id}>
                                        {row.id +
                                          " | " +
                                          row.lastName +
                                          ", " +
                                          row.firstName +
                                          " " +
                                          row.middleName}
                                      </option>
                                    ))
                                : null}
                            </select>
                          ) : this.customerIdExists() ||
                            this.state.record.customerId === "" ? (
                            <React.Fragment>
                              <select
                                className={
                                  "zi-10 " +
                                  this.inputFieldClasses(errors.customerId)
                                }
                                name="customerId"
                                value={record.customerId}
                                onChange={this.onChangeRecord}
                                noValidate
                              >
                                <option value="">Choose one</option>
                                {this.props.customers.length > 0
                                  ? this.props.customers
                                      .filter(
                                        (row) =>
                                          (
                                            row.lastName +
                                            ", " +
                                            row.firstName +
                                            " " +
                                            row.middleName
                                          )
                                            .toLowerCase()
                                            .match(
                                              customer.searchValue.toLowerCase()
                                            ) || customer.searchValue === ""
                                      )
                                      .map((row) => (
                                        <option key={row.id} value={row.id}>
                                          {row.id +
                                            " | " +
                                            row.lastName +
                                            ", " +
                                            row.firstName +
                                            " " +
                                            row.middleName}
                                        </option>
                                      ))
                                  : null}
                              </select>
                              <div className="input-group-append">
                                <button
                                  type="button"
                                  className="btn btn-light input-group-text"
                                  onClick={this.onToggleCustomerSearch}
                                >
                                  Search
                                </button>
                              </div>
                            </React.Fragment>
                          ) : (
                            <div className="input-group">
                              <input
                                className="form-control zi-10"
                                value={
                                  "Deleted Record: " +
                                  record.customerId +
                                  " | " +
                                  record.customerName
                                }
                                noValidate
                                disabled
                              />
                              <div className="input-group-append">
                                <button
                                  type="button"
                                  className="btn btn-light input-group-text"
                                  onClick={this.onClearRecordCustomerId}
                                >
                                  Change
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        {customer.search && !submitted ? (
                          <div className="input-group">
                            <input
                              className="form-control"
                              type="text"
                              name="searchValue"
                              value={customer.searchValue}
                              onChange={this.onChangeCustomerSearch}
                              placeholder="Search by Customer Name"
                              noValidate
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                className="btn btn-light input-group-text"
                                onClick={this.onClearCustomerSearch}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        ) : null}{" "}
                        {this.renderRecordErrors(errors.customerId)}
                      </React.Fragment>
                    ) : this.props.customerConnectionFailed ? (
                      <div className="input-group px-0">
                        <input
                          className="form-control border border-danger zi-10"
                          value="Database Connection Failed: Please try again later."
                          noValidate
                          disabled
                        />
                        <div className="input-group-append justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light input-group-text"
                            onClick={this.props.retryCustomersData}
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    ) : (
                      <input
                        className="form-control"
                        value="Loading Data: Please wait..."
                        noValidate
                        disabled
                      />
                    )}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Pet ID<span className="text-danger ml-1">*</span>
                    </label>
                    {this.props.petConnected || submitted ? (
                      <React.Fragment>
                        <div className="input-group">
                          {submitted ? (
                            <select
                              className="form-control"
                              name="petId"
                              value={record.petId}
                              noValidate
                              disabled
                            >
                              {this.props.pets.filter(
                                (row) =>
                                  (row.petName
                                    .toLowerCase()
                                    .match(pet.searchValue.toLowerCase()) &&
                                    row.ownerId === record.customerId) ||
                                  (pet.searchValue === "" &&
                                    row.ownerId === record.customerId)
                              ).length > 0 || pet.searchValue.length > 0 ? (
                                <option value="">Choose one</option>
                              ) : record.customerId.length > 0 ? (
                                <option value="">No pet found</option>
                              ) : (
                                <option value="">
                                  Customer ID is required
                                </option>
                              )}
                              {this.props.pets.length > 0
                                ? this.props.pets
                                    .filter(
                                      (row) =>
                                        (row.petName
                                          .toLowerCase()
                                          .match(
                                            pet.searchValue.toLowerCase()
                                          ) &&
                                          row.ownerId === record.customerId) ||
                                        (pet.searchValue === "" &&
                                          row.ownerId === record.customerId)
                                    )
                                    .map((row) => (
                                      <option key={row.id} value={row.id}>
                                        {row.id + " | " + row.petName}
                                      </option>
                                    ))
                                : null}
                            </select>
                          ) : this.petIdExists() ||
                            this.state.record.petId === "" ? (
                            <select
                              className={
                                "zi-10 " + this.inputFieldClasses(errors.petId)
                              }
                              name="petId"
                              value={record.petId}
                              onChange={this.onChangeRecord}
                              noValidate
                            >
                              {this.props.pets.filter(
                                (row) =>
                                  (row.petName
                                    .toLowerCase()
                                    .match(pet.searchValue.toLowerCase()) &&
                                    row.ownerId === record.customerId) ||
                                  (pet.searchValue === "" &&
                                    row.ownerId === record.customerId)
                              ).length > 0 || pet.searchValue.length > 0 ? (
                                <option value="">Choose one</option>
                              ) : record.customerId.length > 0 ? (
                                <option value="">No pet found</option>
                              ) : (
                                <option value="">
                                  Customer ID is required
                                </option>
                              )}
                              {this.props.pets.length > 0
                                ? this.props.pets
                                    .filter(
                                      (row) =>
                                        (row.petName
                                          .toLowerCase()
                                          .match(
                                            pet.searchValue.toLowerCase()
                                          ) &&
                                          row.ownerId === record.customerId) ||
                                        (pet.searchValue === "" &&
                                          row.ownerId === record.customerId)
                                    )
                                    .map((row) => (
                                      <option key={row.id} value={row.id}>
                                        {row.id + " | " + row.petName}
                                      </option>
                                    ))
                                : null}
                            </select>
                          ) : (
                            <div className="input-group">
                              <input
                                className="form-control zi-10"
                                value={
                                  "Deleted Record: " +
                                  record.petId +
                                  " | " +
                                  record.petName
                                }
                                noValidate
                                disabled
                              />
                              <div className="input-group-append">
                                <button
                                  type="button"
                                  className="btn btn-light input-group-text"
                                  onClick={this.onClearRecordPetId}
                                >
                                  Change
                                </button>
                              </div>
                            </div>
                          )}
                          {(this.props.pets.filter(
                            (row) =>
                              (row.petName.match(pet.searchValue) &&
                                row.ownerId === record.customerId) ||
                              (pet.searchValue === "" &&
                                row.ownerId === record.customerId)
                          ).length > 0 ||
                            pet.searchValue.length > 0) &&
                          !submitted &&
                          (this.petIdExists() || record.petId === "") ? (
                            <div className="input-group-append">
                              <button
                                type="button"
                                className="btn btn-light input-group-text"
                                onClick={this.onTogglePetSearch}
                              >
                                Search
                              </button>
                            </div>
                          ) : null}
                        </div>
                        {pet.search && !submitted ? (
                          <div className="input-group">
                            <input
                              className="form-control"
                              type="text"
                              name="searchValue"
                              value={pet.searchValue}
                              onChange={this.onChangePetSearch}
                              placeholder="Search by Pet Name"
                              noValidate
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                className="btn btn-light input-group-text"
                                onClick={this.onClearPetSearch}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        ) : null}{" "}
                        {this.renderRecordErrors(errors.petId)}
                      </React.Fragment>
                    ) : this.props.petConnectionFailed ? (
                      <div className="input-group px-0">
                        <input
                          className="form-control border border-danger zi-10"
                          value="Database Connection Failed: Please try again later."
                          noValidate
                          disabled
                        />
                        <div className="input-group-append justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light input-group-text"
                            onClick={this.props.retryPetsData}
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    ) : (
                      <input
                        className="form-control"
                        value="Loading Data: Please wait..."
                        noValidate
                        disabled
                      />
                    )}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Pet Weight<span className="text-danger ml-1">*</span>
                    </label>
                    <div className="input-group">
                      {submitted ? (
                        <input
                          className="form-control"
                          type="text"
                          name="petWeight"
                          value={record.petWeight}
                          noValidate
                          disabled
                        />
                      ) : (
                        <input
                          className={this.inputFieldClasses(errors.petWeight)}
                          type="text"
                          name="petWeight"
                          value={record.petWeight}
                          onChange={this.onChangeRecord}
                          noValidate
                        />
                      )}
                      <div className="input-group-append">
                        <span className="input-group-text">Kilogram</span>
                      </div>
                    </div>
                    {this.renderRecordErrors(errors.petWeight)}
                  </div>

                  <div className="form-group col">
                    <label className="m-0 ml-2">Remarks</label>
                    {submitted ? (
                      <textarea
                        className="form-control"
                        type="text"
                        name="remarks"
                        value={record.remarks}
                        rows="2"
                        placeholder="(Optional)"
                        noValidate
                        disabled
                      />
                    ) : (
                      <textarea
                        className={this.inputFieldClasses(errors.remarks)}
                        type="text"
                        name="remarks"
                        value={record.remarks}
                        onChange={this.onChangeRecord}
                        rows="2"
                        placeholder="(Optional)"
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.remarks)}
                  </div>
                  {record.transType === "C"
                    ? this.checkUpForm()
                    : record.transType === "G"
                    ? this.groomForm()
                    : null}
                </form>
                {submitted ? (
                  <div className="alert alert-primary d-flex align-items-center mt-3 mb-1 d-lg-none">
                    <i className="fa fa-pen text-primary mr-2"></i>
                    <span>Updating a record...</span>
                  </div>
                ) : updated ? (
                  <div className="alert alert-success d-flex align-items-center mt-3 mb-1 d-lg-none">
                    <i className="fa fa-check text-success mr-2"></i>
                    <span>Record was successfully updated.</span>
                  </div>
                ) : failed ? (
                  <div className="alert alert-danger d-flex align-items-center mt-3 mb-1 d-lg-none">
                    <i className="fa fa-exclamation text-danger mr-2"></i>
                    <span>Database Connection Failed.</span>
                  </div>
                ) : null}
              </div>

              <div className="modal-footer">
                <div className="d-flex justify-content-end w-100">
                  {!submitted &&
                  connected &&
                  this.props.customerConnected &&
                  this.props.petConnected &&
                  this.props.employeeConnected ? (
                    <React.Fragment>
                      {record.transType === "C" ? (
                        <button
                          className="btn btn-success w-auto mr-1"
                          data-dismiss="modal"
                          onClick={() =>
                            this.onViewAdmission(
                              "/wiggly-tails/admin/manage-admission"
                            )
                          }
                        >
                          <i className="fa fa-hand-holding-medical fa-sm"></i>
                          <span className="ml-1">Admissions</span>
                        </button>
                      ) : null}
                      <button
                        className="btn btn-primary w-auto mr-1"
                        onClick={this.onSubmit}
                      >
                        <i className="fa fa-pen fa-sm"></i>
                        <span className="d-none d-sm-inline ml-1">Update</span>
                      </button>
                      {this.props.connected ? (
                        <button
                          className="btn btn-danger w-auto mr-1"
                          onClick={this.onReset}
                        >
                          <i className="fa fa-eraser"></i>
                          <span className="d-none d-sm-inline ml-1">Reset</span>
                        </button>
                      ) : (
                        <button className="btn btn-danger w-auto mr-1" disabled>
                          <i className="fa fa-eraser"></i>
                          <span className="d-none d-sm-inline ml-1">Reset</span>
                        </button>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {record.transType === "C" ? (
                        <button
                          className="btn btn-success w-auto mr-1"
                          data-dismiss="modal"
                          onClick={() =>
                            this.onViewAdmission(
                              "/wiggly-tails/admin/manage-admission"
                            )
                          }
                        >
                          <i className="fa fa-hand-holding-medical fa-sm"></i>
                          <span className="ml-1">Admissions</span>
                        </button>
                      ) : null}
                      <button className="btn btn-primary w-auto mr-1" disabled>
                        <i className="fa fa-pen fa-sm"></i>
                        <span className="d-none d-sm-inline ml-1">Update</span>
                      </button>
                      <button className="btn btn-danger w-auto mr-1" disabled>
                        <i className="fa fa-eraser"></i>
                        <span className="d-none d-sm-inline ml-1">Reset</span>
                      </button>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  empIdExists = () => {
    return (
      this.props.employees.filter((row) => this.state.record.empId === row.id)
        .length === 1
    );
  };

  customerIdExists = () => {
    return (
      this.props.customers.filter(
        (row) => this.state.record.customerId === row.id
      ).length === 1
    );
  };

  petIdExists = () => {
    return (
      this.props.pets.filter((row) => this.state.record.petId === row.id)
        .length === 1
    );
  };

  onViewAdmission = (link) => {
    const { record } = this.state;
    const { history } = this.props;
    history.push(link, {
      ...history.location.state,
      transId: record.id,
      customerName: record.customerName,
      petName: record.petName,
      transDate: record.transDate,
    });
  };

  checkUpForm = () => {
    const { submitted } = this.state;
    const { checkUp } = this.state.record;
    const { checkUpErrors } = this.state.errors;

    return (
      <div className="col-12 sub-form bt-1 mt-3">
        <div className="row mt-3">
          {this.state.checkUpConnected ? (
            <React.Fragment>
              <div className="form-group col-lg-6">
                <label className="m-0 ml-2">
                  Findings<span className="text-danger ml-1">*</span>
                </label>
                {submitted ? (
                  <input
                    className="form-control"
                    type="text"
                    name="findings"
                    value={checkUp.findings}
                    noValidate
                    disabled
                  />
                ) : (
                  <input
                    className={this.inputFieldClasses(checkUpErrors.findings)}
                    type="text"
                    name="findings"
                    value={checkUp.findings}
                    onChange={this.onChangeCheckUp}
                    noValidate
                  />
                )}
                {this.renderRecordErrors(checkUpErrors.findings)}
              </div>

              <div className="form-group col-lg-6">
                <label className="m-0 ml-2">
                  Treatment<span className="text-danger ml-1">*</span>
                </label>
                {submitted ? (
                  <input
                    className="form-control"
                    type="text"
                    name="treatment"
                    value={checkUp.treatment}
                    noValidate
                    disabled
                  />
                ) : (
                  <input
                    className={this.inputFieldClasses(checkUpErrors.treatment)}
                    type="text"
                    name="treatment"
                    value={checkUp.treatment}
                    onChange={this.onChangeCheckUp}
                    noValidate
                  />
                )}
                {this.renderRecordErrors(checkUpErrors.treatment)}
              </div>

              <div className="form-group col-lg-6">
                <label className="m-0 ml-2">
                  Admission Date<span className="text-danger ml-1">*</span>
                </label>
                {submitted ? (
                  <input
                    className="form-control"
                    type="date"
                    name="admissionDate"
                    value={checkUp.admissionDate}
                    noValidate
                    disabled
                  />
                ) : (
                  <input
                    className="form-control border border-success"
                    type="date"
                    name="admissionDate"
                    value={checkUp.admissionDate}
                    onChange={this.onChangeCheckUp}
                    noValidate
                  />
                )}
              </div>

              <div className="form-group col-lg-6">
                <label className="m-0 ml-2">
                  Released Date<span className="text-danger ml-1">*</span>
                </label>
                {submitted ? (
                  <input
                    className="form-control"
                    type="date"
                    name="releasedDate"
                    value={checkUp.releasedDate}
                    noValidate
                    disabled
                  />
                ) : (
                  <input
                    className="form-control border border-success"
                    type="date"
                    name="releasedDate"
                    value={checkUp.releasedDate}
                    onChange={this.onChangeCheckUp}
                    noValidate
                  />
                )}
              </div>

              <div className="form-group col">
                <label className="m-0 ml-2">Additional Information</label>
                {submitted ? (
                  <textarea
                    className="form-control"
                    type="text"
                    name="addInfo"
                    value={checkUp.addInfo}
                    rows="2"
                    placeholder="(Optional)"
                    noValidate
                    disabled
                  />
                ) : (
                  <textarea
                    className={this.inputFieldClasses(checkUpErrors.addInfo)}
                    type="text"
                    name="addInfo"
                    value={checkUp.addInfo}
                    onChange={this.onChangeCheckUp}
                    rows="2"
                    placeholder="(Optional)"
                    noValidate
                  />
                )}
                {this.renderRecordErrors(checkUpErrors.addInfo)}
              </div>
            </React.Fragment>
          ) : this.state.checkUpConnectionFailed ? (
            <div className="col-12 text-center text-danger">
              <h3 className="mb-1">Database Connection Failed</h3>
              <h5 className="mb-3">Please try again later.</h5>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.retryCheckUpData}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="col-12 text-center">
              <h3 className="mb-1">Loading Data</h3>
              <h5>Please wait...</h5>
            </div>
          )}
        </div>
      </div>
    );
  };

  groomForm = () => {
    const { submitted } = this.state;
    const { groom } = this.state.record;
    const { groomErrors } = this.state.errors;

    return (
      <div className="col-12 sub-form bt-1 mt-3">
        <div className="row mt-3">
          {this.state.groomConnected ? (
            <React.Fragment>
              <div className="form-group col">
                <label className="m-0 ml-2">
                  Activity<span className="text-danger ml-1">*</span>
                </label>
                {submitted ? (
                  <input
                    className="form-control"
                    type="text"
                    name="activity"
                    value={groom.activity}
                    noValidate
                    disabled
                  />
                ) : (
                  <input
                    className={this.inputFieldClasses(groomErrors.activity)}
                    type="text"
                    name="activity"
                    value={groom.activity}
                    onChange={this.onChangeGroom}
                    noValidate
                  />
                )}
                {this.renderRecordErrors(groomErrors.activity)}
              </div>
            </React.Fragment>
          ) : this.state.groomConnectionFailed ? (
            <div className="col-12 text-center text-danger">
              <h3 className="mb-1">Database Connection Failed</h3>
              <h5 className="mb-3">Please try again later.</h5>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.retryGroomData}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="col-12 text-center">
              <h3 className="mb-1">Loading Data</h3>
              <h5>Please wait...</h5>
            </div>
          )}
        </div>
      </div>
    );
  };

  inputFieldClasses = (errorMsg) => {
    let classes = "form-control ";
    classes +=
      errorMsg.length > 0
        ? this.state.submitError
          ? "border border-danger"
          : ""
        : "border border-success";
    return classes;
  };

  retryCheckUpData = () => {
    this.getCheckUpData(this.state.record.id);
    const checkUpConnected = false;
    const checkUpConnectionFailed = false;
    const connected = false;
    this.setState({ checkUpConnected, checkUpConnectionFailed, connected });
  };

  getCheckUpData = (id) => {
    axios
      .get(
        "http://princemc.heliohost.us/veterinaryClinic/viewTransactionCheckUp.php?id=" +
          id
      )
      .then((res) => {
        let checkUp = res.data;
        const checkUpConnected = true;
        const connected = true;
        checkUp = checkUp[0];
        this.setState((currentState) => ({
          ...currentState,
          record: {
            ...currentState.record,
            checkUp,
          },
          checkUpConnected,
          connected,
        }));
      })
      .catch((error) => {
        console.log(error);
        const checkUpConnectionFailed = true;
        this.setState({ checkUpConnectionFailed });
      });
  };

  retryGroomData = () => {
    this.getGroomData(this.state.record.id);
    const groomConnected = false;
    const groomConnectionFailed = false;
    const connected = false;
    this.setState({ groomConnected, groomConnectionFailed, connected });
  };

  getGroomData = (id) => {
    axios
      .get(
        "http://princemc.heliohost.us/veterinaryClinic/viewTransactionGroom.php?id=" +
          id
      )
      .then((res) => {
        let groom = res.data;
        const groomConnected = true;
        const connected = true;
        groom = groom[0];
        this.setState((currentState) => ({
          ...currentState,
          record: {
            ...currentState.record,
            groom,
          },
          groomConnected,
          connected,
        }));
      })
      .catch((error) => {
        console.log(error);
        const groomConnectionFailed = true;
        this.setState({ groomConnectionFailed });
      });
  };

  removeLastSpace = (value) => {
    let result = value;
    if (value.charAt(value.length - 1) === " ") {
      result = value.substring(0, value.length - 1);
    }
    return result;
  };

  removeSpaces = (value) => {
    let result = "";
    for (var i = 0; i < value.length; i++) {
      if (value.charAt(i) !== " ") {
        result += value.charAt(i);
      }
    }
    return result;
  };

  toSentenceCase = (value) => {
    let propervalue = "";
    let isCapital = false;
    for (var i = 0; i < value.length; i++) {
      if (value.charAt(i) === " ") {
        if (i !== 0 && value.charAt(i - 1) !== " ") {
          propervalue += value.charAt(i);
        }
        if (i !== 0 && value.charAt(i - 1) === ".") {
          isCapital = true;
        }
      } else {
        if (i === 0 || isCapital === true) {
          propervalue += value.charAt(i).toUpperCase();
          isCapital = false;
        } else {
          propervalue += value.charAt(i);
        }
      }
    }
    return propervalue;
  };
}

export default ViewTransactionModal;
