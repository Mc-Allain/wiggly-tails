import axios from "axios";
import React, { Component } from "react";

class ViewPetModal extends Component {
  state = {
    record: {
      id: "",
      petName: "",
      birthdate: "",
      ownerId: "",
      petClass: "",
      lastVisit: "",
      pcciRegNo: "",
    },
    errors: {
      petName: "",
      birthdate: "",
      petClass: "",
      pcciRegNo: "",
    },
    petClasses: [
      "Alligator",
      "Alpaca",
      "Ant",
      "Bear",
      "Bird",
      "Bull",
      "Cat",
      "Chicken",
      "Crab",
      "Crocodile",
      "Deer",
      "Dog",
      "Dolphins",
      "Duck",
      "Elephant",
      "Ferret",
      "Fish",
      "Fox",
      "Frog",
      "Gecko",
      "Gerbil",
      "Giraffe",
      "Goat",
      "Gorilla",
      "Grasshopper",
      "Guinea Pig",
      "Hamster",
      "Hedgehog",
      "Hermit Crab",
      "Horse",
      "Jaguar",
      "Lion",
      "Lizard",
      "Mantis",
      "Monkey",
      "Mouse",
      "Octopus",
      "Orangutan",
      "Orstrich",
      "Pig",
      "Panda",
      "Quill",
      "Rabbit",
      "Raccoon",
      "Rat",
      "Reindeer",
      "Salamander",
      "Sheep",
      "Snake",
      "Spider",
      "Squirrel",
      "Tiger",
      "Tortoise",
      "Turtle",
      "Wolf",
      "Whale",
      "Zebra",
    ],
    deleteState: false,
    submitError: false,
    submitted: false,
    updated: false,
    failed: false,
    deleting: false,
    deleted: false,
  };

  componentDidMount() {
    const { pet } = this.props;
    const record = { ...this.state.record };

    record.id = pet.id;
    record.petName = pet.petName;
    record.birthdate = pet.birthdate;
    record.ownerId = pet.ownerId;
    record.petClass = pet.petClass;
    record.lastVisit = pet.lastVisit;
    record.pcciRegNo = pet.pcciRegNo;

    this.setState({ record });
  }

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
      name === "petName"
        ? this.toAbsProperCase(value)
        : name !== "petClass"
        ? this.removeSpaces(value).toUpperCase()
        : value;

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
      case "petName":
        errors.petName =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 24
            ? "Must be at between 2 and 24 characters"
            : "";
        break;

      case "birthdate":
        errors.birthdate = properLength === 0 ? " " : "";
        break;

      case "ownerId":
        errors.ownerId = properLength === 0 ? " " : "";
        break;

      case "petClass":
        errors.petClass = properLength === 0 ? " " : "";
        break;

      case "pcciRegNo":
        errors.pcciRegNo =
          value.length > 6 ? "Must be at exact 6 characters" : "";
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

      record.petName = this.removeLastSpace(record.petName);

      this.props.onSubmitForm();
      this.submission();

      axios
        .post(
          "http://princemc.heliohost.us/veterinaryClinic/updatePet.php",
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
    const record = { ...this.state.record };
    const errors = { ...this.state.errors };

    const deleteState = false;
    const submitError = false;
    const updated = false;
    const failed = false;

    const { pet } = this.props;

    record.petName = pet.petName;
    record.birthdate = pet.birthdate;
    record.petClass = pet.petClass;
    record.pcciRegNo = pet.pcciRegNo;

    errors.petName = "";
    errors.birthdate = "";
    errors.petClass = "";
    errors.pcciRegNo = "";

    this.setState({
      record,
      errors,
      deleteState,
      submitError,
      updated,
      failed,
    });
  };

  render() {
    const {
      record,
      errors,
      petClasses,
      deleteState,
      submitted,
      updated,
      failed,
      deleting,
      deleted,
    } = this.state;
    const { pet } = this.props;

    return (
      <React.Fragment>
        <div
          className="modal fade"
          id={"viewPetModal" + pet.id}
          tabIndex="-1"
          role="dialog"
          data-backdrop="static"
          aria-labelledby={"viewPetModalTitle" + pet.id}
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={"viewPetModalTitle" + pet.id}>
                  Pet Info
                </h5>
                {(!submitted && this.props.connected) || deleted ? (
                  <button
                    id={"btnClose-" + pet.id}
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
                ) : deleting ? (
                  <div className="alert alert-primary d-flex align-items-center mb-3">
                    <i className="fa fa-trash text-primary mr-2"></i>
                    <span>Deleting a record...</span>
                  </div>
                ) : deleted ? (
                  <div className="alert alert-success d-flex align-items-center mb-3">
                    <i className="fa fa-check text-success mr-2"></i>
                    <span>Record was successfully deleted.</span>
                  </div>
                ) : null}
                <form className="row form-light mx-2 p-4" noValidate>
                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">ID</label>
                    <input
                      className="form-control zi-10"
                      type="text"
                      name="id"
                      value={record.id}
                      noValidate
                      disabled
                    />
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Pet Name
                      <span className="text-danger ml-1">
                        *<span className="small ml-1">Required</span>
                      </span>
                    </label>
                    {submitted || deleting || deleted ? (
                      <input
                        className="form-control"
                        type="text"
                        name="petName"
                        value={record.petName}
                        noValidate
                        disabled
                      />
                    ) : (
                      <input
                        className={this.inputFieldClasses(errors.petName)}
                        type="text"
                        name="petName"
                        value={record.petName}
                        onChange={this.onChangeRecord}
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.petName)}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Birthdate<span className="text-danger ml-1">*</span>
                    </label>
                    {submitted || deleting || deleted ? (
                      <input
                        className="form-control"
                        type="date"
                        name="birthdate"
                        value={record.birthdate}
                        noValidate
                        disabled
                      />
                    ) : (
                      <input
                        className={this.inputFieldClasses(errors.birthdate)}
                        type="date"
                        name="birthdate"
                        value={record.birthdate}
                        onChange={this.onChangeRecord}
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.birthdate)}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Owner ID<span className="text-danger ml-1">*</span>
                    </label>
                    <input
                      className="form-control zi-10"
                      type="text"
                      name="ownerId"
                      value={record.ownerId}
                      noValidate
                      disabled
                    />
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Pet Class<span className="text-danger ml-1">*</span>
                    </label>
                    {submitted || deleting || deleted ? (
                      <select
                        className="form-control"
                        name="petClass"
                        value={record.petClass}
                        noValidate
                        disabled
                      >
                        <option value="">Choose one</option>
                        {petClasses.length > 0
                          ? petClasses.map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))
                          : null}
                      </select>
                    ) : (
                      <select
                        className={this.inputFieldClasses(errors.petClass)}
                        name="petClass"
                        value={record.petClass}
                        onChange={this.onChangeRecord}
                        noValidate
                      >
                        <option value="">Choose one</option>
                        {petClasses.length > 0
                          ? petClasses.map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))
                          : null}
                      </select>
                    )}
                    {this.renderRecordErrors(errors.petClass)}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">PCCI Reg. No.</label>
                    {submitted || deleting || deleted ? (
                      <input
                        className="form-control"
                        type="text"
                        name="pcciRegNo"
                        value={record.pcciRegNo}
                        maxLength="6"
                        placeholder="(Optional)"
                        noValidate
                        disabled
                      />
                    ) : (
                      <input
                        className={this.inputFieldClasses(errors.pcciRegNo)}
                        type="text"
                        name="pcciRegNo"
                        value={record.pcciRegNo}
                        onChange={this.onChangeRecord}
                        maxLength="6"
                        placeholder="(Optional)"
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.pcciRegNo)}
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <div className="d-flex justify-content-end w-100">
                  {deleteState ? this.deleteButtons() : this.defaultButtons()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  defaultButtons = () => {
    return !this.state.submitted &&
      !this.state.deleting &&
      !this.state.deleted ? (
      <React.Fragment>
        <button className="btn btn-primary w-auto mr-1" onClick={this.onSubmit}>
          <i className="fa fa-pen fa-sm"></i>
          <span className="ml-1">Update</span>
        </button>
        {this.props.connected ? (
          <button className="btn btn-danger w-auto mr-1" onClick={this.onReset}>
            <i className="fa fa-eraser"></i>
            <span className="ml-1">Reset</span>
          </button>
        ) : (
          <button className="btn btn-danger w-auto mr-1" disabled>
            <i className="fa fa-eraser"></i>
            <span className="ml-1">Reset</span>
          </button>
        )}
        <button
          className="btn btn-danger w-auto mr-1"
          onClick={this.onToggleDelete}
        >
          <i className="fa fa-trash"></i>
          <span className="ml-1">Delete</span>
        </button>
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
        <button className="btn btn-danger w-auto mr-1" disabled>
          <i className="fa fa-trash"></i>
          <span className="ml-1">Delete</span>
        </button>
      </React.Fragment>
    );
  };

  onToggleDelete = () => {
    const deleteState = !this.state.deleteState;
    this.setState({ deleteState });
  };

  deleteButtons = () => {
    return (
      <React.Fragment>
        <button className="btn btn-danger w-auto mr-1" onClick={this.onDelete}>
          <i className="fa fa-trash"></i>
          <span className="ml-1">Confirm Delete</span>
        </button>
        <button
          className="btn btn-success w-auto mr-1"
          onClick={this.onToggleDelete}
        >
          <i className="fa fa-arrow-left"></i>
          <span className="ml-1">Cancel Delete</span>
        </button>
      </React.Fragment>
    );
  };

  onDelete = () => {
    const { record } = this.state;
    const { onRefresh } = this.props;

    this.props.onSubmitForm();
    this.deletion();

    axios
      .post(
        "http://princemc.heliohost.us/veterinaryClinic/deletePet.php",
        record
      )
      .then(this.postDelete)
      .catch((error) => {
        console.log(error);
        onRefresh();
        this.failedDelete();
      });
  };

  deletion = () => {
    const deleteState = false;
    const deleting = true;
    this.setState({ deleteState, deleting });
  };

  postDelete = () => {
    const deleting = false;
    const deleted = true;
    this.setState({ deleting, deleted }, () => {
      setTimeout(() => {
        document.getElementById("btnClose-" + this.props.pet.id).click();
        this.props.onRefresh();
      }, 5000);
    });
  };

  failedDelete = () => {
    const deleting = false;
    let failed = true;
    this.setState({ deleting, failed }, () => {
      setTimeout(() => {
        failed = false;
        this.setState({ failed });
      }, 5000);
    });
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
}

export default ViewPetModal;
