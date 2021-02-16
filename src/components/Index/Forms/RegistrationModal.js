import axios from "axios";
import { isNumeric } from "jquery";
import React, { Component } from "react";

class RegistrationModal extends Component {
  state = {
    record: {
      id: "",
      lastName: "",
      firstName: "",
      middleName: "",
      homeAddress: {
        lotBlock: "",
        street: "",
        subdivision: "",
        barangay: "",
        municipality: "",
        province: "",
      },
      birthdate: "",
      mobileNumber: "",
      emailAddress: "",
      email: "@yahoo.com",
      userPassword: "",
      pet: {
        petName: "",
        birthdate: "",
        petClass: "",
        lastVisit: "",
        pcciRegNo: "",
      },
    },
    confirmUserPassword: "",
    errors: {
      lastName: " ",
      firstName: " ",
      middleName: "",
      homeAddressErrors: {
        lotBlock: "",
        street: " ",
        subdivision: "",
        barangay: " ",
        municipality: " ",
        province: "",
      },
      birthdate: " ",
      mobileNumber: " ",
      emailAddress: " ",
      userPassword: " ",
      confirmUserPassword: " ",
      petErrors: {
        petName: " ",
        birthdate: " ",
        petClass: " ",
        pcciRegNo: "",
      },
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
    submitError: false,
    submitted: false,
    registered: false,
    failed: false,
  };

  componentDidMount() {
    this.onGenerateId();
  }

  onGenerateId = () => {
    const record = { ...this.state.record };
    const id = this.generateCharacters(6);
    record.id = id;
    this.setState({ record });
  };

  onChangeState = (e) => {
    const { name, value } = e.target;
    this.setState(
      (currentState) => ({
        ...currentState,
        [name]: value,
      }),
      () => this.onCheckRecordErrors(e)
    );
  };

  onChangeRecord = (e) => {
    let { name, value } = e.target;

    if (
      name !== "mobileNumber" &&
      name !== "emailAddress" &&
      name !== "userPassword"
    ) {
      value =
        name === "lastName"
          ? this.toProperCase(value)
          : this.toAbsProperCase(value);
    }

    if (name === "emailAddress") value = this.removeSpaces(value);

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
    const record = { ...this.state.record };
    const { confirmUserPassword } = this.state;
    const properLength = this.removeSpaces(value).length;

    switch (name) {
      case "lastName":
        errors.lastName =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 24
            ? "Must be at between 2 and 24 characters"
            : "";
        break;

      case "firstName":
        errors.firstName =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 24
            ? "Must be at between 2 and 24 characters"
            : "";
        break;

      case "middleName":
        errors.middleName =
          properLength > 24 ? "Must be at maximum of 24 characters" : "";
        break;

      case "birthdate":
        errors.birthdate = value.length === 0 ? " " : "";
        break;

      case "mobileNumber":
        errors.mobileNumber =
          value.length === 0
            ? " "
            : !isNumeric(value)
            ? "Please input a valid value"
            : value.length < 10
            ? "Must be at exact 10 numbers"
            : "";

        break;

      case "emailAddress":
        errors.emailAddress =
          value.length === 0
            ? " "
            : value.length < 8 || value.length > 24
            ? "Must be at between 8 and 24 characters"
            : !this.isValidEmail(value)
            ? "Please input a valid value"
            : this.emailAddressExists()
            ? "Already in use"
            : "";
        break;

      case "email":
        errors.emailAddress =
          record.emailAddress.length === 0
            ? " "
            : record.emailAddress.length < 8 || record.emailAddress.length > 24
            ? "Must be at between 8 and 24 characters"
            : !this.isValidEmail(record.emailAddress)
            ? "Please input a valid value"
            : this.emailAddressExists()
            ? "Already in use"
            : "";
        break;

      case "userPassword":
        errors.userPassword =
          value.length === 0
            ? " "
            : this.spaceFound(value)
            ? "Password must not have spacing"
            : value.length < 12 || value.length > 24
            ? "Password must be at between 12 and 24 characters"
            : "";
        errors.confirmUserPassword =
          value === confirmUserPassword
            ? confirmUserPassword.length < 12 || this.spaceFound(value)
              ? " "
              : ""
            : "Passwords do not match";
        break;

      case "confirmUserPassword":
        errors.confirmUserPassword =
          value.length === 0
            ? " "
            : value === record.userPassword
            ? value.length < 12 || this.spaceFound(value)
              ? " "
              : ""
            : "Passwords do not match";
        break;

      default:
        break;
    }

    this.setState({ errors });
  };

  emailAddressExists = () => {
    const { record } = this.state;
    const { customers } = this.props;

    const result = customers.filter(
      (row) =>
        (row.emailAddress + row.email).toLowerCase() ===
        (record.emailAddress + record.email).toLowerCase()
    );

    if (result.length > 0) return true;
    return false;
  };

  isValidEmail = (value) => {
    const emailPattern = new RegExp(/^[a-zA-Z0-9!#$%^&*.?_-]+$/);
    return emailPattern.test(value);
  };

  onChangeHomeAddress = (e) => {
    let { name, value } = e.target;

    value = this.toProperCase(value);

    this.setState(
      (currentState) => ({
        ...currentState,
        record: {
          ...currentState.record,
          homeAddress: {
            ...currentState.record.homeAddress,
            [name]: value,
          },
        },
      }),
      () => this.onCheckHomeAddressErrors(e)
    );
  };

  onCheckHomeAddressErrors = (e) => {
    const { name, value } = e.target;
    const homeAddressErrors = { ...this.state.errors.homeAddressErrors };
    const properLength = this.removeSpaces(value).length;

    switch (name) {
      case "lotBlock":
        homeAddressErrors.lotBlock =
          value.length > 12
            ? "Lot/Block must be at maximum of 12 characters"
            : "";
        break;

      case "street":
        homeAddressErrors.street =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 24
            ? "Street must be at between 2 and 24 characters"
            : "";
        break;

      case "subdivision":
        homeAddressErrors.subdivision =
          value.length > 24
            ? "Subdivision must be at maximum of 24 characters"
            : "";
        break;

      case "barangay":
        homeAddressErrors.barangay =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 24
            ? "Barangay must be at between 2 and 24 characters"
            : "";
        break;

      case "municipality":
        homeAddressErrors.municipality =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 24
            ? "Municipality must be at between 2 and 24 characters"
            : "";
        break;

      case "province":
        homeAddressErrors.province =
          value.length > 24
            ? "Province must be at maximum of 24 characters"
            : "";
        break;

      default:
        break;
    }

    this.setState((currentState) => ({
      ...currentState,
      errors: {
        ...currentState.errors,
        homeAddressErrors,
      },
    }));
  };

  onChangePet = (e) => {
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
          pet: {
            ...currentState.record.pet,
            [name]: value,
          },
        },
      }),
      () => this.onCheckPetErrors(e)
    );
  };

  onCheckPetErrors = (e) => {
    const { name, value } = e.target;
    const petErrors = { ...this.state.errors.petErrors };
    const properLength = this.removeSpaces(value).length;

    switch (name) {
      case "petName":
        petErrors.petName =
          properLength === 0
            ? " "
            : properLength < 2 || value.length > 24
            ? "Must be at between 2 and 24 characters"
            : "";
        break;

      case "birthdate":
        petErrors.birthdate = properLength === 0 ? " " : "";
        break;

      case "petClass":
        petErrors.petClass = properLength === 0 ? " " : "";
        break;

      case "pcciRegNo":
        petErrors.pcciRegNo =
          value.length < 6 && value.length !== 0
            ? "Must be at exact 6 characters"
            : "";
        break;

      default:
        break;
    }

    this.setState(
      (currentState) => ({
        ...currentState,
        errors: {
          ...currentState.errors,
          petErrors,
        },
      }),
      () => console.log(this.state)
    );
  };

  onSubmit = () => {
    const errors = { ...this.state.errors };

    if (this.validForm({ errors })) {
      const { getData } = this.props;
      const record = { ...this.state.record };

      record.lastName = this.removeLastSpace(record.lastName);
      record.firstName = this.removeLastSpace(record.firstName);
      record.middleName = this.removeLastSpace(record.middleName);
      record.homeAddress.lotBlock = this.removeLastSpace(
        record.homeAddress.lotBlock
      );
      record.homeAddress.street = this.removeLastSpace(
        record.homeAddress.street
      );
      record.homeAddress.subdivision = this.removeLastSpace(
        record.homeAddress.subdivision
      );
      record.homeAddress.barangay = this.removeLastSpace(
        record.homeAddress.barangay
      );
      record.homeAddress.municipality = this.removeLastSpace(
        record.homeAddress.municipality
      );
      record.homeAddress.province = this.removeLastSpace(
        record.homeAddress.province
      );
      record.pet.petName = this.removeLastSpace(record.pet.petName);

      // record.homeAddress.street += " St.";
      // record.homeAddress.barangay = "Brgy. " + record.homeAddress.barangay;
      // record.homeAddress.municipality += " City";

      let mbNo = [];
      mbNo.push("+63" + record.mobileNumber.substring(0, 3));
      mbNo.push(record.mobileNumber.substring(3, 6));
      mbNo.push(record.mobileNumber.substring(6, 10));
      record.mobileNumber = mbNo.join("-");

      this.props.onRegister();
      this.submission();

      axios
        .post(
          "http://princemc.heliohost.us/veterinaryClinic/insertCustomerPet.php",
          record
        )
        .then(() => {
          getData();
          this.onReset();
          this.postSubmit();
        })
        .catch((error) => {
          console.log(error);
          getData();
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
    let registered = true;
    this.setState({ submitted, registered });
    setTimeout(() => {
      registered = false;
      this.setState({ registered });
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

    Object.values(errors.homeAddressErrors).forEach((value) => {
      value.length > 0 && (valid = false);
    });

    return valid;
  };

  renderErrors = (errors) => {
    if (this.state.submitError) {
      let errorItems = [];

      Object.values(errors).forEach((value) => {
        if (!this.isObject(value)) {
          if (value.length > 0) {
            errorItems.push(
              <div
                key={errorItems.length}
                className="alert alert-danger d-flex align-items-center my-1 py-0"
              >
                <i className="fa fa-exclamation text-danger mr-2"></i>
                <span>{value}</span>
              </div>
            );
          }
        } else {
          Object.values(value).forEach((value) => {
            if (!this.isObject(value)) {
              if (value.length > 0) {
                errorItems.push(
                  <div
                    key={errorItems.length}
                    className="alert alert-danger d-flex align-items-center my-1 py-0"
                  >
                    <i className="fa fa-exclamation text-danger mr-2"></i>
                    <span>{value}</span>
                  </div>
                );
              }
            }
          });
        }
      });

      return errorItems.length > 1 ? (
        <div className="mb-3 mx-3">{[errorItems]}</div>
      ) : null;
    }
  };

  isObject = (data) => {
    return data instanceof Object;
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

  renderHomeAddressErrors = (homeAddressErrors) => {
    if (this.state.submitError) {
      let errorItems = [];

      Object.values(homeAddressErrors).forEach((value) => {
        if (value.length > 0 && value !== " ") {
          errorItems.push(
            <small className="text-danger ml-3">
              <i className="fa fa-exclamation text-danger mr-1"></i>
              {value}
            </small>
          );
        }
      });
      return [errorItems];
    }
  };

  onReset = () => {
    const record = { ...this.state.record };
    const homeAddress = { ...this.state.record.homeAddress };
    const pet = { ...this.state.record.pet };

    const errors = { ...this.state.errors };
    const homeAddressErrors = { ...this.state.errors.homeAddressErrors };
    const petErrors = { ...this.state.errors.petErrors };

    const confirmUserPassword = "";
    const submitError = false;
    const registered = false;
    const failed = false;

    homeAddress.lotBlock = "";
    homeAddress.street = "";
    homeAddress.subdivision = "";
    homeAddress.barangay = "";
    homeAddress.municipality = "";
    homeAddress.province = "";

    pet.petName = "";
    pet.birthdate = "";
    pet.petClass = "";
    pet.pcciRegNo = "";

    record.id = this.generateCharacters(6);
    record.lastName = "";
    record.firstName = "";
    record.middleName = "";
    record.homeAddress = homeAddress;
    record.birthdate = "";
    record.mobileNumber = "";
    record.emailAddress = "";
    record.email = "@yahoo.com";
    record.userPassword = "";
    record.pet = pet;

    homeAddressErrors.lotBlock = "";
    homeAddressErrors.street = " ";
    homeAddressErrors.subdivision = "";
    homeAddressErrors.barangay = " ";
    homeAddressErrors.municipality = " ";
    homeAddressErrors.province = "";

    petErrors.petName = " ";
    petErrors.birthdate = " ";
    petErrors.petClass = " ";

    errors.lastName = " ";
    errors.firstName = " ";
    errors.middleName = "";
    errors.homeAddressErrors = homeAddressErrors;
    errors.birthdate = " ";
    errors.mobileNumber = " ";
    errors.emailAddress = " ";
    errors.userPassword = " ";
    errors.confirmUserPassword = " ";

    this.setState({
      record,
      confirmUserPassword,
      errors,
      submitError,
      registered,
      failed,
    });
  };

  render() {
    const {
      record,
      errors,
      confirmUserPassword,
      petClasses,
      submitted,
      registered,
      failed,
    } = this.state;
    const { homeAddress, pet } = record;
    const { homeAddressErrors, petErrors } = errors;

    return (
      <React.Fragment>
        <div
          className="modal fade"
          id="registrationModal"
          tabIndex="-1"
          role="dialog"
          data-backdrop="static"
          aria-labelledby="registrationModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="registrationModalTitle">
                  Register
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
                {/* { this.renderErrors(errors) } */}
                {submitted ? (
                  <div className="alert alert-primary d-flex align-items-center mb-3">
                    <i className="fa fa-pen text-primary mr-2"></i>
                    <span>Registering an account...</span>
                  </div>
                ) : registered ? (
                  <div className="alert alert-success d-flex align-items-center mb-3">
                    <i className="fa fa-check text-success mr-2"></i>
                    <span>Account was successfully registered.</span>
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
                      Last Name
                      <span className="text-danger ml-1">
                        *<span className="small ml-1">Required</span>
                      </span>
                    </label>
                    {submitted ? (
                      <input
                        className="form-control"
                        type="text"
                        name="lastName"
                        value={record.lastName}
                        noValidate
                        disabled
                      />
                    ) : (
                      <input
                        className={this.inputFieldClasses(errors.lastName)}
                        type="text"
                        name="lastName"
                        value={record.lastName}
                        onChange={this.onChangeRecord}
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.lastName)}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      First Name<span className="text-danger ml-1">*</span>
                    </label>
                    {submitted ? (
                      <input
                        className="form-control"
                        type="text"
                        name="firstName"
                        value={record.firstName}
                        onChange={this.onChangeRecord}
                        noValidate
                        disabled
                      />
                    ) : (
                      <input
                        className={this.inputFieldClasses(errors.firstName)}
                        type="text"
                        name="firstName"
                        value={record.firstName}
                        onChange={this.onChangeRecord}
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.firstName)}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">Middle Name</label>
                    {submitted ? (
                      <input
                        className="form-control"
                        type="text"
                        name="middleName"
                        value={record.middleName}
                        placeholder="(Optional)"
                        noValidate
                        disabled
                      />
                    ) : (
                      <input
                        className={this.inputFieldClasses(errors.middleName)}
                        type="text"
                        name="middleName"
                        value={record.middleName}
                        onChange={this.onChangeRecord}
                        placeholder="(Optional)"
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.middleName)}
                  </div>

                  <div className="form-group col-12">
                    <label className="m-0 ml-2">
                      Home Address<span className="text-danger ml-1">*</span>
                    </label>
                    <div className="row mx-0">
                      <div className="col-lg-3 col-md-6 input-group px-0">
                        {submitted ? (
                          <input
                            className="form-control"
                            type="text"
                            name="lotBlock"
                            value={homeAddress.lotBlock}
                            placeholder="Lot/Block (Optional)"
                            noValidate
                            disabled
                          />
                        ) : (
                          <input
                            className={this.inputFieldClasses(
                              homeAddressErrors.lotBlock
                            )}
                            type="text"
                            name="lotBlock"
                            value={homeAddress.lotBlock}
                            onChange={this.onChangeHomeAddress}
                            placeholder="Lot/Block (Optional)"
                            noValidate
                          />
                        )}
                      </div>

                      <div className="col-lg-3 col-md-6 input-group px-0">
                        {submitted ? (
                          <input
                            className="form-control"
                            type="text"
                            name="street"
                            value={homeAddress.street}
                            placeholder="Street"
                            noValidate
                            disabled
                          />
                        ) : (
                          <input
                            className={this.inputFieldClasses(
                              homeAddressErrors.street
                            )}
                            type="text"
                            name="street"
                            value={homeAddress.street}
                            onChange={this.onChangeHomeAddress}
                            placeholder="Street"
                            noValidate
                          />
                        )}
                        <div className="input-group-append">
                          <span className="input-group-text">St.</span>
                        </div>
                      </div>

                      <div className="col-lg-6 input-group px-0">
                        {submitted ? (
                          <input
                            className="form-control"
                            type="text"
                            name="subdivision"
                            value={homeAddress.subdivision}
                            placeholder="Subdivision (Optional)"
                            noValidate
                            disabled
                          />
                        ) : (
                          <input
                            className={this.inputFieldClasses(
                              homeAddressErrors.subdivision
                            )}
                            type="text"
                            name="subdivision"
                            value={homeAddress.subdivision}
                            onChange={this.onChangeHomeAddress}
                            placeholder="Subdivision (Optional)"
                            noValidate
                          />
                        )}
                      </div>

                      <div className="col-lg-4 input-group px-0">
                        <div className="input-group-prepend">
                          <span className="input-group-text">Brgy.</span>
                        </div>
                        {submitted ? (
                          <input
                            className="form-control"
                            type="text"
                            name="barangay"
                            value={homeAddress.barangay}
                            placeholder="Barangay"
                            noValidate
                            disabled
                          />
                        ) : (
                          <input
                            className={this.inputFieldClasses(
                              homeAddressErrors.barangay
                            )}
                            type="text"
                            name="barangay"
                            value={homeAddress.barangay}
                            onChange={this.onChangeHomeAddress}
                            placeholder="Barangay"
                            noValidate
                          />
                        )}
                      </div>

                      <div className="col-lg-4 input-group px-0">
                        {submitted ? (
                          <input
                            className="form-control"
                            type="text"
                            name="municipality"
                            value={homeAddress.municipality}
                            placeholder="Municipality"
                            noValidate
                            disabled
                          />
                        ) : (
                          <input
                            className={this.inputFieldClasses(
                              homeAddressErrors.municipality
                            )}
                            type="text"
                            name="municipality"
                            value={homeAddress.municipality}
                            onChange={this.onChangeHomeAddress}
                            placeholder="Municipality"
                            noValidate
                          />
                        )}
                        <div className="input-group-append">
                          <span className="input-group-text">City</span>
                        </div>
                      </div>

                      <div className="col-lg-4 input-group px-0">
                        {submitted ? (
                          <input
                            className="form-control"
                            type="text"
                            name="province"
                            value={homeAddress.province}
                            placeholder="Province (Optional)"
                            noValidate
                            disabled
                          />
                        ) : (
                          <input
                            className={this.inputFieldClasses(
                              homeAddressErrors.province
                            )}
                            type="text"
                            name="province"
                            value={homeAddress.province}
                            onChange={this.onChangeHomeAddress}
                            placeholder="Province (Optional)"
                            noValidate
                          />
                        )}
                      </div>
                    </div>{" "}
                    {this.renderHomeAddressErrors(homeAddressErrors)}
                  </div>

                  <div className="form-group col-lg-3">
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

                  <div className="form-group col-lg-3">
                    <label className="m-0 ml-2">
                      Mobile Number<span className="text-danger ml-1">*</span>
                    </label>
                    <div className="input-group px-0">
                      <span className="input-group-text">+63</span>
                      {submitted ? (
                        <input
                          className="form-control"
                          type="tel"
                          maxLength="10"
                          name="mobileNumber"
                          value={record.mobileNumber}
                          onChange={this.onChangeRecord}
                          noValidate
                          disabled
                        />
                      ) : (
                        <input
                          className={this.inputFieldClasses(
                            errors.mobileNumber
                          )}
                          type="tel"
                          maxLength="10"
                          name="mobileNumber"
                          value={record.mobileNumber}
                          onChange={this.onChangeRecord}
                          noValidate
                        />
                      )}
                    </div>
                    {this.renderRecordErrors(errors.mobileNumber)}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Email Address<span className="text-danger ml-1">*</span>
                    </label>
                    {this.props.connected || submitted ? (
                      <React.Fragment>
                        <div className="input-group d-block d-sm-flex px-0">
                          {submitted ? (
                            <input
                              className="w-xs-100 form-control"
                              type="text"
                              name="emailAddress"
                              value={record.emailAddress}
                              noValidate
                              disabled
                            />
                          ) : (
                            <input
                              className={
                                "w-xs-100 " +
                                this.inputFieldClasses(errors.emailAddress)
                              }
                              type="text"
                              name="emailAddress"
                              value={record.emailAddress}
                              onChange={this.onChangeRecord}
                              noValidate
                            />
                          )}
                          <div className="input-group-append justify-content-end">
                            <span className="input-group-text">@</span>
                            {submitted ? (
                              <select
                                className="input-group-text form-control"
                                name="email"
                                value={record.email}
                                noValidate
                                disabled
                              >
                                <option value="@yahoo.com">yahoo.com</option>
                                <option value="@gmail.com">gmail.com</option>
                                <option value="@outlook.com">
                                  outlook.com
                                </option>
                              </select>
                            ) : (
                              <select
                                className="input-group-text form-control"
                                name="email"
                                value={record.email}
                                onChange={this.onChangeRecord}
                                noValidate
                              >
                                <option value="@yahoo.com">yahoo.com</option>
                                <option value="@gmail.com">gmail.com</option>
                                <option value="@outlook.com">
                                  outlook.com
                                </option>
                              </select>
                            )}
                          </div>
                        </div>
                        {this.renderRecordErrors(errors.emailAddress)}
                        <div>
                          <small className="text-success ml-2">
                            <i className="fa fa-info-circle mr-1"></i>
                            <span>Valid Symbols:&nbsp;</span>
                            <span>{"!#$%^&*.?_-"}</span>
                          </small>
                        </div>
                      </React.Fragment>
                    ) : this.props.connectionFailed ? (
                      <div className="input-group d-block d-sm-flex px-0">
                        {
                          this.props.insecureContentPermission ?
                          <input
                            className="form-control border border-danger zi-10"
                            value="Database Connection Failed: Please try again later."
                            noValidate
                            disabled
                          /> :
                          <input
                            className="form-control border border-danger zi-10"
                            value="Website Permission Needed: Please allow insecure content in site permissions."
                            noValidate
                            disabled
                          />
                        }
                        <div className="input-group-append justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light input-group-text"
                            onClick={this.props.getData}
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
                      Password<span className="text-danger ml-1">*</span>
                    </label>
                    {submitted ? (
                      <input
                        className="form-control"
                        type="password"
                        name="userPassword"
                        value={record.userPassword}
                        noValidate
                        disabled
                      />
                    ) : (
                      <input
                        className={this.inputFieldClasses(errors.userPassword)}
                        type="password"
                        name="userPassword"
                        value={record.userPassword}
                        onChange={this.onChangeRecord}
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.userPassword)}
                  </div>

                  <div className="form-group col-lg-6">
                    <label className="m-0 ml-2">
                      Confirm Password
                      <span className="text-danger ml-1">*</span>
                    </label>
                    {submitted ? (
                      <input
                        className="form-control"
                        type="password"
                        name="confirmUserPassword"
                        value={confirmUserPassword}
                        noValidate
                        disabled
                      />
                    ) : (
                      <input
                        className={this.inputFieldClasses(
                          errors.confirmUserPassword
                        )}
                        type="password"
                        name="confirmUserPassword"
                        value={confirmUserPassword}
                        onChange={this.onChangeState}
                        noValidate
                      />
                    )}
                    {this.renderRecordErrors(errors.confirmUserPassword)}
                  </div>

                  <div className="col-12 sub-form bt-1 mt-3">
                    <div className="row mt-3">
                      <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                          Pet Name <span className="text-danger ml-1">*</span>
                        </label>
                        {submitted ? (
                          <input
                            className="form-control"
                            type="text"
                            name="petName"
                            value={pet.petName}
                            noValidate
                            disabled
                          />
                        ) : (
                          <input
                            className={this.inputFieldClasses(
                              petErrors.petName
                            )}
                            type="text"
                            name="petName"
                            value={pet.petName}
                            onChange={this.onChangePet}
                            noValidate
                          />
                        )}
                        {this.renderRecordErrors(petErrors.petName)}
                      </div>

                      <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                          Pet Birthdate
                          <span className="text-danger ml-1">*</span>
                        </label>
                        {submitted ? (
                          <input
                            className="form-control"
                            type="date"
                            name="birthdate"
                            value={pet.birthdate}
                            noValidate
                            disabled
                          />
                        ) : (
                          <input
                            className={this.inputFieldClasses(
                              petErrors.birthdate
                            )}
                            type="date"
                            name="birthdate"
                            value={pet.birthdate}
                            onChange={this.onChangePet}
                            noValidate
                          />
                        )}
                        {this.renderRecordErrors(petErrors.birthdate)}
                      </div>

                      <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                          Pet Class<span className="text-danger ml-1">*</span>
                        </label>
                        {submitted ? (
                          <select
                            className="form-control"
                            name="petClass"
                            value={pet.petClass}
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
                            className={this.inputFieldClasses(
                              petErrors.petClass
                            )}
                            name="petClass"
                            value={pet.petClass}
                            onChange={this.onChangePet}
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
                        {this.renderRecordErrors(petErrors.petClass)}
                      </div>

                      <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">PCCI Reg. No.</label>
                        {submitted ? (
                          <input
                            className="form-control"
                            type="text"
                            name="pcciRegNo"
                            value={pet.pcciRegNo}
                            maxLength="6"
                            placeholder="(Optional)"
                            noValidate
                            disabled
                          />
                        ) : (
                          <input
                            className={this.inputFieldClasses(
                              petErrors.pcciRegNo
                            )}
                            type="text"
                            name="pcciRegNo"
                            value={pet.pcciRegNo}
                            onChange={this.onChangePet}
                            maxLength="6"
                            placeholder="(Optional)"
                            noValidate
                          />
                        )}
                        {this.renderRecordErrors(petErrors.pcciRegNo)}
                      </div>
                    </div>
                  </div>
                </form>
                {submitted ? (
                  <div className="alert alert-primary d-flex align-items-center mt-3 mb-1 d-lg-none">
                    <i className="fa fa-pen text-primary mr-2"></i>
                    <span>Registering an account...</span>
                  </div>
                ) : registered ? (
                  <div className="alert alert-success d-flex align-items-center mt-3 mb-1 d-lg-none">
                    <i className="fa fa-check text-success mr-2"></i>
                    <span>Account was successfully registered.</span>
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
                  {this.props.connected && !submitted ? (
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

  toProperCase = (value) => {
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
          propervalue += value.charAt(i);
        }
      }
    }
    return propervalue;
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

  removeMultipleSpaces = (value) => {
    let result = "";
    for (var i = 0; i < value.length; i++) {
      if (value.charAt(i) === " ") {
        if (i !== 0 && value.charAt(i - 1) !== " ") {
          result += value.charAt(i);
        }
      } else {
        result += value.charAt(i);
      }
    }

    return result;
  };

  spaceFound = (value) => {
    if (value.match(" ")) return true;
    return false;
  };
}

export default RegistrationModal;
