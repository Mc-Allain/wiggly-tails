import axios from "axios";
import React, { Component } from "react";

class AddPetModal extends Component {
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
      petName: " ",
      birthdate: " ",
      petClass: " ",
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
      "Panda",
      "Penguin",
      "Pig",
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
    submitError: false,
    submitted: false,
    added: false,
    failed: false,
  };

  componentDidMount() {
    this.onGenerateId();
  }

  onGenerateId = () => {
    const record = { ...this.state.record };
    const id = this.generateCharacters(6);
    record.id = id;
    record.ownerId = this.props.ownerId;
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
          "http://princemc.heliohost.us/veterinaryClinic/insertPet.php",
          record
        )
        .then(() => {
          onRefresh();
          this.onReset();
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
    let added = true;
    this.setState({ submitted, added });
    setTimeout(() => {
      added = false;
      this.setState({ added });
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
    this.onGenerateId();
    const record = { ...this.state.record };
    const errors = { ...this.state.errors };

    const submitError = false;
    const added = false;
    const failed = false;

    record.id = this.generateCharacters(6);
    record.petName = "";
    record.birthdate = "";
    record.petClass = "";
    record.pcciRegNo = "";

    errors.petName = "Pet Name is required";
    errors.birthdate = "Birthdate is required";
    errors.petClass = "Pet Class is required";
    errors.pcciRegNo = "";

    this.setState({ record, errors, submitError, added, failed });
  };

  render() {
    const { record, errors, petClasses, submitted, added, failed } = this.state;

    return (
      <React.Fragment>
        <div
          className="modal fade"
          id="addPetModal"
          tabIndex="-1"
          role="dialog"
          data-backdrop="static"
          aria-labelledby="addPetModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addPetModalTitle">
                  Add Pet
                </h5>
                {!submitted ? (
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
                    <span>Adding a record...</span>
                  </div>
                ) : added ? (
                  <div className="alert alert-success d-flex align-items-center mb-3">
                    <i className="fa fa-check text-success mr-2"></i>
                    <span>Record was successfully added.</span>
                  </div>
                ) : failed ? (
                  <div className="alert alert-danger d-flex align-items-center mb-3">
                    <i className="fa fa-exclamation text-danger mr-2"></i>
                    <span>Database Connection Failed.</span>
                  </div>
                ) : null}
                <form className="row form-light mx-2 p-4" noValidate>
                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">ID</label>
                    <div className="input-group">
                      <input
                        className="form-control zi-10"
                        type="text"
                        name="id"
                        value={record.id}
                        placeholder="Please click 'Generate'"
                        noValidate
                        disabled
                      />
                      {!submitted ? (
                        <div className="input-group-append">
                          <button
                            type="button"
                            className="btn btn-light input-group-text"
                            onClick={this.onGenerateId}
                          >
                            Generate
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Pet name
                      <span className="text-danger ml-1">
                        *<span className="small ml-1">Required</span>
                      </span>
                    </label>
                    {submitted ? (
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
                    {submitted ? (
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
                    {submitted ? (
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
                    {submitted ? (
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
                  {!submitted ? (
                    <React.Fragment>
                      <button
                        className="btn btn-primary w-auto mr-1"
                        onClick={this.onSubmit}
                      >
                        <i className="fa fa-sign-in-alt"></i>
                        <span className="ml-1">Submit</span>
                      </button>
                      <button
                        className="btn btn-danger w-auto"
                        onClick={this.onReset}
                      >
                        <i className="fa fa-eraser"></i>
                        <span className="ml-1">Reset</span>
                      </button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <button className="btn btn-primary w-auto mr-1" disabled>
                        <i className="fa fa-sign-in-alt"></i>
                        <span className="ml-1">Submit</span>
                      </button>
                      <button className="btn btn-danger w-auto" disabled>
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

  generateCharacters = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

export default AddPetModal;
