import axios from "axios";
import React, { Component } from "react";

class CustomerLoginForm extends Component {
  state = {
    record: {
      emailAddress: "",
      email: "@yahoo.com",
      userPassword: "",
    },
    errors: {
      emailAddress: "Please input your Email Address",
      userPassword: "Please input your Password",
    },
    submitError: false,
    loginError: false,
  };

  onChangeRecord = (e) => {
    let { name, value } = e.target;

    if (name === "emailAddress") {
      value = this.removeSpaces(value);
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
      case "emailAddress":
        errors.emailAddress =
          value.length === 0 ? "Please input your Email Address" : "";
        break;

      case "userPassword":
        errors.userPassword =
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

      this.setState({ submitError, loginError });

      const result = records.filter(
        (row) =>
          (row.emailAddress + row.email).toLowerCase() ===
            (record.emailAddress + record.email).toLowerCase() &&
          row.userPassword === record.userPassword
      );

      if (result.length > 0) {
        const { history } = this.props;
        axios.post(
          "http://princemc.heliohost.us/veterinaryClinic/customerLogin.php",
          result[0]
        );
        history.replace("/wiggly-tails/customer", {
          verified: true,
          id: result[0].id,
          fullName: result[0].lastName + ", " + result[0].firstName,
        });
      } else {
        submitError = true;
        loginError = true;
        record.userPassword = "";
        errors.userPassword = "Please input your Password";
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
      if (errorMsg.length > 0) {
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
          <span className="lh-0 my-1">Incorrect Email Address or Password</span>
        </div>
      );
    }
  };

  onReset = (e) => {
    e.preventDefault();
    const record = { ...this.state.record };
    record.emailAddress = "";
    record.email = "@yahoo.com";
    record.userPassword = "";

    const errors = { ...this.state.errors };
    errors.emailAddress = "Please input your Email Address";
    errors.userPassword = "Please input your Password";

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
        <h2 className="text-center">Customer Login</h2>
        <h5 className="font-weight-normal text-center mb-4">
          Please input your credentials.
        </h5>{" "}
        {this.renderLoginError()}
        <div className="form-group">
          <label className="m-0 ml-2">Email Address</label>
          <div className="input-group d-block d-sm-flex px-0">
            <input
              className={
                "w-xs-100 " + this.inputFieldClasses(errors.emailAddress)
              }
              type="text"
              name="emailAddress"
              value={record.emailAddress}
              onChange={this.onChangeRecord}
              noValidate
            />
            <div className="input-group-append justify-content-end">
              <span className="input-group-text">@</span>
              <select
                className="input-group-text form-control"
                name="email"
                value={record.email}
                onChange={this.onChangeRecord}
                noValidate
              >
                <option value="@yahoo.com">yahoo.com</option>
                <option value="@gmail.com">gmail.com</option>
                <option value="@outlook.com">outlook.com</option>
              </select>
            </div>
          </div>
          {this.renderRecordErrors(errors.emailAddress)}
        </div>
        <div className="form-group">
          <label className="m-0 ml-2">Password</label>
          <input
            className={this.inputFieldClasses(errors.userPassword)}
            type="password"
            name="userPassword"
            value={record.userPassword}
            onChange={this.onChangeRecord}
            noValidate
          />
          {this.renderRecordErrors(errors.userPassword)}
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
      <div className="text-center">
        {
          this.props.insecureContentPermission ?
           <React.Fragment>
            <h1 className="mb-1 text-danger">Database Connection Failed</h1>
            <h3 className="mb-3 text-danger">Please try again later.</h3>
          </React.Fragment> :
           <React.Fragment>
            <h2 className="mb-1 text-warning">Permission Needed</h2>
            <h5 className="mb-3 text-warning">
              The Veterinary Clinic wants you to provide your personal information in this website,
              please allow the insecure content in site permissions.<br/>
              If you are on mobile, the usage of UC Browser application is highly recommended.
            </h5>
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

  removeSpaces = (value) => {
    let result = "";
    for (var i = 0; i < value.length; i++) {
      if (value.charAt(i) !== " ") {
        result += value.charAt(i);
      }
    }
    return result;
  };
}

export default CustomerLoginForm;
