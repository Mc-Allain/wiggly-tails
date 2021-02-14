import axios from "axios";
import React, { Component } from "react";

class ViewAdmissionModal extends Component {
  state = {
    record: {
      id: "",
      transId: "",
      title: "",
      content: "",
      employee: {
        empId: "",
        empName: "",
      },
    },
    errors: {
      title: "",
      content: "",
    },
    submitError: false,
    submitted: false,
    updated: false,
    failed: false,
  };

  componentDidMount = () => {
    const { admission, history } = this.props;
    const record = { ...this.state.record };

    record.id = admission.id;
    record.transId = admission.transId;
    record.title = admission.title;
    record.content = admission.content;

    record.employee.empId = history.location.state.id;
    record.employee.empName = history.location.state.fullName;

    this.setState({ record });
  };

  onChangeState = (e) => {
    const { name, value } = e.target;
    this.setState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  onChangeRecord = (e) => {
    let { name, value } = e.target;

    value =
      name === "title"
        ? this.toAbsProperCase(value)
        : this.toSentenceCase(value);

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
    const properLength = this.removeSpaces(value).length;

    switch (name) {
      case "title":
        errors.title =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 24
            ? "Must be at between 2 and 24 characters"
            : "";
        break;

      case "content":
        errors.content =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 128
            ? "Must be at between 2 and 128 characters"
            : "";
        break;

      default:
        break;
    }

    this.setState({ errors });
  };

  onSubmit = () => {
    const errors = { ...this.state.errors };

    if (this.validForm({ errors })) {
      const { onRefresh } = this.props;
      const record = { ...this.state.record };

      record.title = this.removeLastSpace(record.title);
      record.content = this.removeLastSpace(record.content);

      this.props.onSubmitForm();
      this.submission();

      axios
        .post(
          "https://princemc.heliohost.us/veterinaryClinic/updateAdmission.php",
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

  onReset = () => {
    const { admission } = this.props;
    const record = { ...this.state.record };
    const errors = { ...this.state.errors };
    const submitError = false;
    const updated = false;
    const failed = false;

    record.id = admission.id;
    record.transId = admission.transId;
    record.title = admission.title;
    record.content = admission.content;

    errors.title = "";
    errors.content = "";

    this.setState({ record, errors, submitError, updated, failed });
  };

  render() {
    const { record, errors, submitted, updated, failed } = this.state;
    const { admission } = this.props;
    return (
      <React.Fragment>
        <div
          className="modal fade"
          id={"viewAdmissionModal-" + admission.id}
          tabIndex="-1"
          role="dialog"
          data-backdrop="static"
          aria-labelledby={"viewAdmissionModalTitle-" + admission.id}
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
                  id={"viewAdmissionModalTitle-" + admission.id}
                >
                  Admission Info
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
                  <div className="form-group col-12">
                    <label className="m-0 ml-2">
                      Title
                      <span className="text-danger ml-1">
                        *<span className="small ml-1">Required</span>
                      </span>
                    </label>
                    {submitted ? (
                      <input
                        className="form-control"
                        type="text"
                        name="title"
                        value={record.title}
                        noValidate
                        disabled
                      />
                    ) : (
                      <input
                        className={this.inputFieldClasses(errors.title)}
                        type="text"
                        name="title"
                        value={record.title}
                        onChange={this.onChangeRecord}
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.title)}
                  </div>

                  <div className="form-group col-12">
                    <label className="m-0 ml-2">
                      Content<span className="text-danger ml-1">*</span>
                    </label>
                    {submitted ? (
                      <textarea
                        className="form-control"
                        type="text"
                        name="content"
                        value={record.content}
                        rows="7"
                        noValidate
                        disabled
                      />
                    ) : (
                      <textarea
                        className={this.inputFieldClasses(errors.content)}
                        type="text"
                        name="content"
                        value={record.content}
                        rows="7"
                        onChange={this.onChangeRecord}
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.content)}
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <div className="d-flex justify-content-end w-100">
                  {!submitted ? (
                    <React.Fragment>
                      <button
                        className="btn btn-primary w-auto mr-1"
                        onClick={this.onSubmit}
                      >
                        <i className="fa fa-pen fa-sm"></i>
                        <span className="ml-1">Update</span>
                      </button>
                      {this.props.connected ? (
                        <button
                          className="btn btn-danger w-auto mr-1"
                          onClick={this.onReset}
                        >
                          <i className="fa fa-eraser"></i>
                          <span className="ml-1">Reset</span>
                        </button>
                      ) : (
                        <button className="btn btn-danger w-auto mr-1" disabled>
                          <i className="fa fa-eraser"></i>
                          <span className="ml-1">Reset</span>
                        </button>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <button className="btn btn-primary w-auto mr-1" disabled>
                        <i className="fa fa-pen fa-sm"></i>
                        <span className="ml-1">Update</span>
                      </button>
                      <button className="btn btn-danger w-auto mr-1" disabled>
                        <i className="fa fa-eraser"></i>
                        <span className="ml-1">Reset</span>
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

export default ViewAdmissionModal;
