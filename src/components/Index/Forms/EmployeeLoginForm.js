import axios from "axios";
import React, { Component } from "react";

class EmployeeLoginForm extends Component {
  state = {
    record: {
      id: "",
      empLastName: "",
      empPassword: "",
    },
    errors: {
      id: "Please input your ID",
      empLastName: "Please input your Last Name",
      empPassword: "Please input your Password",
    },
    submitError: false,
    loginError: false,
  };

  onChangeRecord = (e) => {
    let { name, value } = e.target;

    if (name === "id") {
      value = value.toUpperCase();
    }

    if (name === "empLastName") {
      value = this.toAbsProperCase(value);
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
  };

  onCheckRecordErrors = (e) => {
    const { name, value } = e.target;
    const errors = { ...this.state.errors };

    switch (name) {
      case "id":
        errors.id =
          value.length === 0
            ? "Please input your ID"
            : value.length !== 6
            ? "Must be at exact 6 characters"
            : "";
        break;

      case "empLastName":
        errors.empLastName =
          value.length === 0
            ? "Please input your Last Name"
            : value.length < 2 || value.length > 24
            ? "Must be at between 2 and 24 characters"
            : "";
        break;

      case "empPassword":
        errors.empPassword =
          value.length === 0 ? "Please input your Password" : "";
        break;

      default:
        break;
    }

    this.setState({ errors });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { records } = this.props;
    const errors = { ...this.state.errors };
    const record = { ...this.state.record };

    if (this.validForm({ errors })) {
      let submitError = false;
      let loginError = false;

      const result = records.filter(
        (row) =>
          row.id === record.id &&
          row.empLastName === record.empLastName &&
          row.empPassword === record.empPassword
      );

      if (result.length > 0) {
        const { history } = this.props;
        axios.post(
          "http://princemc.heliohost.us/veterinaryClinic/employeeLogin.php",
          result[0]
        );
        history.replace("/wiggly-tails/admin", {
          verified: true,
          id: result[0].id,
          fullName: result[0].empLastName + ", " + result[0].empFirstName,
        });
      } else {
        submitError = true;
        loginError = true;
        record.empPassword = "";
        errors.empPassword = "Please input your Password";
      }

      this.setState({ record, errors, submitError, loginError });
    } else {
      const submitError = true;
      this.setState({ submitError });
    }
  };

  validForm = ({ errors }) => {
    let valid = true;

    Object.values(errors).forEach((value) => {
      value.length > 0 && (valid = false);
    });

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

  renderLoginError = () => {
    if (this.state.loginError) {
      return (
        <div className="alert alert-danger d-flex align-items-center my-1 py-0">
          <i className="fa fa-exclamation text-danger mr-2"></i>
          <span className="lh-0 my-1">Incorrect ID, Last Name or Password</span>
        </div>
      );
    }
  };

  onReset = (e) => {
    e.preventDefault();
    const record = { ...this.state.record };
    record.id = "";
    record.empLastName = "";
    record.empPassword = "";

    const errors = { ...this.state.errors };
    errors.id = "Please input your ID";
    errors.empLastName = "Please input your Last Name";
    errors.empPassword = "Please input your Password";

    const submitError = false;
    const loginError = false;

    this.setState({ record, errors, submitError, loginError });
  };

  render() {
    const { record, errors } = this.state;
    return this.props.connected ? (
      <form
        className="form-light p-5 mt-4"
        noValidate
        onSubmit={this.onSubmit}
        onReset={this.onReset}
      >
        <h2 className="text-center">Employee Login</h2>
        <h5 className="font-weight-normal text-center mb-4">
          Please input your credentials.
        </h5>{" "}
        {this.renderLoginError()}
        <div className="form-group">
          <label className="m-0 ml-2">ID</label>
          <input
            className={this.inputFieldClasses(errors.id)}
            type="text"
            name="id"
            value={record.id}
            maxLength="6"
            onChange={this.onChangeRecord}
            noValidate
          />
          {this.renderRecordErrors(errors.id)}
        </div>
        <div className="form-group">
          <label className="m-0 ml-2">Last Name</label>
          <input
            className={this.inputFieldClasses(errors.empLastName)}
            type="text"
            name="empLastName"
            value={record.empLastName}
            onChange={this.onChangeRecord}
            noValidate
          />
          {this.renderRecordErrors(errors.empLastName)}
        </div>
        <div className="form-group">
          <label className="m-0 ml-2">Password</label>
          <input
            className={this.inputFieldClasses(errors.empPassword)}
            type="password"
            name="empPassword"
            value={record.empPassword}
            onChange={this.onChangeRecord}
            noValidate
          />
          {this.renderRecordErrors(errors.empPassword)}
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button type="submit" className="btn btn-primary w-49">
            <i className="fa fa-sign-in-alt"></i>
            <span className="ml-1">Login</span>
          </button>
          <button type="reset" className="btn btn-danger w-49">
            <i className="fa fa-eraser"></i>
            <span className="ml-1">Reset</span>
          </button>
        </div>
      </form>
    ) : this.props.connectionFailed ? (
      <div className="text-center text-danger">
        {
          this.props.insecureContentPermission ?
          <React.Fragment>
            <h1 className="mb-1 text-danger">Database Connection Failed</h1>
            <h3 className="mb-3 text-danger">Please try again later.</h3>
          </React.Fragment> :
           <React.Fragment>
            <h1 className="mb-1 text-warning">Website Permission Needed</h1>
            <h5 className="mb-3 text-warning">To use your personal information in this website, please allow the insecure content in site permissions.</h5>
          </React.Fragment>
        }
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={this.props.getData}
        >
          Retry
        </button>
      </div>
    ) : (
      <div className="text-center">
        <h1 className="mb-1">Loading Data</h1>
        <h3>Please wait...</h3>
      </div>
    );
  }

  inputFieldClasses = (errorMsg) => {
    let classes = "form-control ";
    classes +=
      errorMsg.length > 0 && this.state.submitError
        ? "border border-danger"
        : "";
    return classes;
  };

  toAbsProperCase = (value) => {
    let propervalue = "";
    let isCapital = false;
    for (var i = 0; i < value.length; i++) {
      if (value.charAt(i) === " ") {
        if (i !== 0 && value.charAt(i - 1) !== " ") {
          propervalue += value.charAt(i);
        }
        isCapital = true;
      } else {
        if (i === 0 || isCapital === true) {
          propervalue += value.charAt(i).toUpperCase();
          isCapital = false;
        } else {
          propervalue += value.charAt(i).toLowerCase();
        }
      }
    }
    return propervalue;
  };
}

export default EmployeeLoginForm;
