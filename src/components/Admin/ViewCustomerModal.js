import axios from 'axios';
import { isNumeric } from 'jquery';
import React, { Component } from 'react';

class ViewCustomerModal extends Component {
    state = {
        record:
        {
            id: '',
            lastName: '',
            firstName: '',
            middleName: '',
            homeAddress:
            {
                lotBlock: '',
                street: '',
                subdivision: '',
                barangay: '',
                municipality: '',
                province: ''
            },
            birthdate: '',
            mobileNumber: '',
            emailAddress: '',
            email: '@yahoo.com',
            userPassword: ''
        },
        confirmUserPassword: '',
        errors:
        {
            lastName: '',
            firstName: '',
            middleName: '',
            homeAddressErrors:
            {
                lotBlock: '',
                street: '',
                subdivision: '',
                barangay: '',
                municipality: '',
                province: ''
            },
            birthdate: '',
            mobileNumber: '',
            emailAddress: '',
            userPassword: '',
            confirmUserPassword: ' ',
        },
        records: [],
        submitError: false,
        updated: false,
        passwordState:
        {
            inputType: 'password',
            buttonText: 'Show'
        },
        deleteState: false
    }

    componentDidMount() {
        const { customer } = this.props;
        const record = {...this.state.record};
        record.id = customer.id;
        record.lastName = customer.lastName;
        record.firstName = customer.firstName;
        record.middleName = customer.middleName;
        record.homeAddress.lotBlock = customer.lotBlock;
        record.homeAddress.street = customer.street.substring(0, customer.street.length - 4);
        record.homeAddress.subdivision = customer.subdivision;
        record.homeAddress.barangay = customer.barangay.substring(6, customer.barangay.length);
        record.homeAddress.municipality =   customer.municipality
                                            .substring(0, customer.municipality.length - 5);
        record.homeAddress.province = customer.province;
        record.birthdate = customer.birthdate;
        let mobileNumber = customer.mobileNumber.split('-');
        mobileNumber = mobileNumber.join('');
        mobileNumber = mobileNumber.substring(3, mobileNumber.length);
        record.mobileNumber = mobileNumber;
        record.emailAddress = customer.emailAddress;
        record.email = customer.email;
        record.userPassword = customer.userPassword;

        this.setState({ record });
    }

    onChangeState = e => {
        const { name, value } = e.target;
        this.setState(currentState => ({
            ...currentState,
            [name]: value
        }), () => this.onCheckRecordErrors(e))
    }

    onChangeRecord = e => {
        let { name, value } = e.target;

        if(name !== "mobileNumber" && name !== "emailAddress" && name !== "userPassword") {
            value = name === "lastName" ?
            this.toProperCase(value) :
            this.toAbsProperCase(value);
        }

        if(name === "emailAddress" || name === "email") {
            if(name === "emailAddress") value = this.removeSpaces(value);
            this.getCustomersData();
        }

        this.setState(currentState => ({
            ...currentState,
            record: {
                ...currentState.record,
                [name]: value
            }
        }), () => this.onCheckRecordErrors(e))
    }

    onCheckRecordErrors = e => {
        const { name, value } = e.target;
        const errors = {...this.state.errors};
        const record = {...this.state.record};
        const { confirmUserPassword } = this.state;
        const properLength = this.removeSpaces(value).length;

        switch(name){
            case 'lastName':
                errors.lastName=    properLength === 0 ? " " :
                                    properLength < 2 || value.length > 24 ?
                                    "Must be at between 2 and 24 characters" : ""
                break;

            case 'firstName':
                errors.firstName=   properLength === 0 ? " " :
                                    properLength < 2 || value.length > 24 ?
                                    "Must be at between 2 and 24 characters" : ""
                break;

            case 'middleName':
                errors.middleName=  properLength > 24 ?
                                    "Must be at maximum of 24 characters" : ""
                break;
            
            case 'birthdate':
                errors.birthdate=   value.length === 0 ? " " : ""
                break;

            case 'mobileNumber':
                errors.mobileNumber=    value.length === 0 ? " " :
                                        !isNumeric(value) ? "Please input a valid value" :
                                        value.length < 10 ? "Must be at exact 10 numbers" : ""
                                        
                break;

            case 'emailAddress':
                errors.emailAddress=    value.length === 0 ? " " :
                                        value.length < 8 || value.length > 24 ?
                                        "Must be at between 8 and 24 characters" :
                                        !this.isValidEmail(value) ?
                                        "Please input a valid value" :
                                        this.emailAddressExists() ?
                                        "Already in use" : ""
                break;
            
            case 'email':
            errors.emailAddress=    this.emailAddressExists() ?
                                    "Already in use" : ""
                break;

            case 'userPassword':
                errors.userPassword=        value.length === 0 ? " " :
                                            value.length < 12 || value.length > 24 ? 
                                            "Password must be at between 12 and 24 characters" : ""
                errors.confirmUserPassword= value === confirmUserPassword ? 
                                            confirmUserPassword.length < 12 ? " " : "" : "Passwords do not match"
                break;

            case 'confirmUserPassword':
                errors.confirmUserPassword= value.length === 0 ? " " :
                                            value === record.userPassword ?
                                            value.length < 12 ? " " : "" : "Passwords do not match"
                break;

            default:
                break;
        }

        this.setState({ errors });
    }

    emailAddressExists = () => {
        const { record, records } = this.state;
        const { customer } = this.props;

        const result = records.filter(row =>
            (row.emailAddress + row.email).toLowerCase() === (record.emailAddress + record.email).toLowerCase() &&
            (row.emailAddress + row.email).toLowerCase() !== (customer.emailAddress + customer.email).toLowerCase()
        )

        if(result.length > 0) return true;
        return false;
    }
    
    isValidEmail = value => {
        const emailPattern = new RegExp(/^[a-zA-Z0-9!#$%^&*.?_-]+$/);
        return emailPattern.test(value);
    }

    onChangeHomeAddress = e => {
        let { name, value } = e.target;

        value = this.toProperCase(value);

        this.setState(currentState => ({
            ...currentState,
            record: {
                ...currentState.record,
                homeAddress: {
                    ...currentState.record.homeAddress,
                    [name]: value
                }
            }
        }), () => this.onCheckHomeAddressErrors(e))
    }

    onCheckHomeAddressErrors = e => {
        const { name, value } = e.target;
        const homeAddressErrors = {...this.state.errors.homeAddressErrors};

        const properLength = this.removeSpaces(value).length;

        switch(name){
            case 'lotBlock':
                homeAddressErrors.lotBlock= value.length > 12 ?
                                            "Lot/Block must be at maximum of 12 characters" : ""
                break;

            case 'street':
                homeAddressErrors.street=   properLength === 0 ? " " :
                                            properLength < 2 || value.length > 24 ?
                                            "Street must be at between 2 and 24 characters" : ""
                break;

            case 'subdivision':
                homeAddressErrors.subdivision=  properLength === 0 ? " " :
                                                properLength < 2  || value.length > 24 ?
                                                "Subdivision must be at between 2 and 24 characters" : ""
                break;

            case 'barangay':
                homeAddressErrors.barangay= properLength === 0 ? " " :
                                            properLength < 2  || value.length > 24 ?
                                            "Barangay must be at between 2 and 24 characters" : ""
                break;

            case 'municipality':
                homeAddressErrors.municipality= properLength === 0 ? " " :
                                                properLength < 2 || value.length > 24 ?
                                                "Municipality must be at between 2 and 24 characters" : ""
                break;
            
            case 'province':
                homeAddressErrors.province= value.length > 24 ?
                                            "Province must be at maximum of 24 characters" : ""
                break;

            default:
                break;
        }

        this.setState(currentState => ({
            ...currentState,
            errors: {
                ...currentState.errors,
                homeAddressErrors
            }
        }))
    }

    onSubmit = () => {
        const errors  = {...this.state.errors};

        if(this.validForm({ errors })) {
            const { onRefresh } = this.props;
            const record = {...this.state.record};

            record.lastName = this.removeLastSpace(record.lastName);
            record.firstName = this.removeLastSpace(record.firstName);
            record.middleName = this.removeLastSpace(record.middleName);
            record.homeAddress.lotBlock = this.removeLastSpace(record.homeAddress.lotBlock);
            record.homeAddress.street = this.removeLastSpace(record.homeAddress.street);
            record.homeAddress.subdivision = this.removeLastSpace(record.homeAddress.subdivision);
            record.homeAddress.barangay = this.removeLastSpace(record.homeAddress.barangay);
            record.homeAddress.municipality = this.removeLastSpace(record.homeAddress.municipality);
            record.homeAddress.province = this.removeLastSpace(record.homeAddress.province);

            record.homeAddress.street += " St.";
            record.homeAddress.barangay = "Brgy. " + record.homeAddress.barangay;
            record.homeAddress.municipality += " City";
            
            let mbNo = [];
            mbNo.push("+63" + record.mobileNumber.substring(0, 3));
            mbNo.push(record.mobileNumber.substring(3, 6));
            mbNo.push(record.mobileNumber.substring(6, 10));
            record.mobileNumber = mbNo.join('-');

            axios.post('http://localhost/reactPhpCrud/veterinaryClinic/updateCustomer.php', record)
            .then(onRefresh, this.postSubmit());
        }
        else {
            const submitError = true;
            this.setState({ submitError });
        }
    }

    postSubmit = () => {
        let updated = true;
        const submitError = false;
        const confirmUserPassword = '';
        const errors = {...this.state.errors};
        errors.confirmUserPassword = ' '
        this.setState({ errors, confirmUserPassword, submitError, updated });

        updated = false;
        setTimeout(() => this.setState({ updated }), 5000);
    }

    validForm = ({ errors }) => {
        let valid = true;
      
        Object.values(errors).forEach(value => {
            value.length > 0 && (valid = false);
        });

        Object.values(errors.homeAddressErrors).forEach(value => {
            value.length > 0 && (valid = false);
        });
      
        return valid;
    }

    renderErrors = errors => {
        if(this.state.submitError) {
            let errorItems = [];

            Object.values(errors).forEach(value => {
                if(!this.isObject(value)) {
                    if(value.length > 0) {
                        errorItems.push (
                            <div key={errorItems.length}
                                className="alert alert-danger d-flex align-items-center my-1 py-0">
                                <i className="fa fa-exclamation text-danger mr-2"></i>
                                <span>{value}</span>
                            </div>
                        )
                    }
                }
                else {
                    Object.values(value).forEach(value => {
                        if(!this.isObject(value)) {
                            if(value.length > 0) {
                                errorItems.push (
                                    <div key={errorItems.length}
                                        className="alert alert-danger d-flex align-items-center my-1 py-0">
                                        <i className="fa fa-exclamation text-danger mr-2"></i>
                                        <span>{value}</span>
                                    </div>
                                )
                            }
                        }
                    })
                }
            })

            return errorItems.length > 1 ?
            <div className="mb-3 mx-3">
                {[errorItems]} 
            </div>
            : null
        }
    }

    isObject = data => {
        return(data instanceof Object);
    }

    renderRecordErrors = errorMsg => {
        if(this.state.submitError) {
            if(errorMsg.length > 0 && errorMsg !== ' ') {
                return(
                    <small className="text-danger ml-2">
                        <i className="fa fa-exclamation text-danger mr-1"></i>
                        {errorMsg}
                    </small>
                )
            }   
        }
    }

    renderHomeAddressErrors = homeAddressErrors => {
        if(this.state.submitError) {
            let errorItems = [];

            Object.values(homeAddressErrors).forEach(value => {
                if(value.length > 0 && value !== ' ') {
                    errorItems.push(
                        <small className="text-danger ml-3">
                            <i className="fa fa-exclamation text-danger mr-1"></i>
                            {value}
                        </small>
                    )
                }
            })
            return ([errorItems]);
        }
    }

    onReset = () => {
        const record = {...this.state.record};
        const homeAddress = {...this.state.record.homeAddress};

        const errors = {...this.state.errors};
        const homeAddressErrors = {...this.state.errors.homeAddressErrors};

        const { customer } = this.props;

        const confirmUserPassword = '';
        const submitError = false;

        const { passwordState } = this.state;

        passwordState.buttonText = "Show";
        passwordState.inputType = "password";

        homeAddress.lotBlock = customer.lotBlock;
        record.homeAddress.street = customer.street.substring(0, customer.street.length - 4);
        record.homeAddress.subdivision = customer.subdivision;
        record.homeAddress.barangay = customer.barangay.substring(6, customer.barangay.length);
        record.homeAddress.municipality =   customer.municipality
                                            .substring(0, customer.municipality.length - 5);
        homeAddress.province = customer.province;

        record.lastName = customer.lastName;
        record.firstName = customer.firstName;
        record.middleName = customer.middleName
        record.homeAddress = homeAddress;
        record.birthdate = customer.birthdate;
        let mobileNumber = customer.mobileNumber.split('-');
        mobileNumber = mobileNumber.join('');
        mobileNumber = mobileNumber.substring(3, mobileNumber.length);
        record.mobileNumber = mobileNumber;
        record.emailAddress = customer.emailAddress;
        record.email = customer.email;
        record.userPassword = customer.userPassword;

        homeAddressErrors.lotBlock = '';
        homeAddressErrors.street = '';
        homeAddressErrors.subdivision = '';
        homeAddressErrors.barangay = '';
        homeAddressErrors.municipality = '';
        homeAddressErrors.province = '';

        errors.lastName = '';
        errors.firstName = '';
        errors.middleName = ''
        errors.homeAddressErrors = homeAddressErrors;
        errors.birthdate = ''
        errors.mobileNumber = '';
        errors.emailAddress = '';
        errors.userPassword = '';
        errors.confirmUserPassword = ' ';

        this.setState({ record, confirmUserPassword, errors, passwordState, submitError});
    }

    onTogglePassword = e => {
        e.preventDefault();
        const passwordState = {...this.state.passwordState};
        if(passwordState.inputType === 'password') {
            passwordState.inputType = 'text';
            passwordState.buttonText = 'Hide';
        }
        else {
            passwordState.inputType = 'password';
            passwordState.buttonText = 'Show';
        }
        this.setState({ passwordState });
    }

    render() {
        const { record, errors, confirmUserPassword, passwordState, updated, deleteState } = this.state;
        const { homeAddress } = this.state.record;
        const { homeAddressErrors } = errors;
        const { customer } = this.props;

        return (
            <React.Fragment>
                <div className="modal fade" id={"viewCustomerModal-" + customer.id} tabIndex="-1" role="dialog"
                    aria-labelledby={"viewCustomerrModalTitle-" + customer.id} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"viewCustomerModalTitle-" + customer.id}>View Customer</h5>
                                <button className="btn btn-light text-danger p-1" data-dismiss="modal"
                                onClick={this.onReset}>
                                    <i className="fa fa-window-close fa-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* { this.renderErrors(errors) } */}
                                {
                                    updated === true ?
                                    <div className="alert alert-success d-flex align-items-center mt-3 mb-1">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Successfully updated.</span>
                                    </div> : null
                                }
                                <form className="row form-light mx-2 p-4" noValidate>
                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Id</label>
                                        <input className="form-control zi-10" type="text"
                                            name="id" value={record.id} noValidate disabled />
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Last Name
                                            <span className="text-danger ml-1">
                                                *<span className="small ml-1">Required</span>
                                            </span>
                                        </label>
                                        <input className={this.inputFieldClasses(errors.lastName)}
                                        type="text" name="lastName" value={record.lastName}
                                        onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.lastName) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            First Name<span className="text-danger ml-1">*</span>
                                        </label>
                                        <input className={this.inputFieldClasses(errors.firstName)}
                                        type="text" name="firstName" value={record.firstName}
                                        onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.firstName) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Middle Name</label>
                                        <input className={this.inputFieldClasses(errors.middleName)}
                                        type="text" name="middleName" value={record.middleName}
                                        onChange={this.onChangeRecord} placeholder="(Optional)" noValidate />
                                        { this.renderRecordErrors(errors.middleName) }
                                    </div>

                                    <div className="form-group col-12">
                                        <label className="m-0 ml-2">
                                            Home Address<span className="text-danger ml-1">*</span>
                                        </label>
                                        <div className="row mx-0">
                                            <div className="col-lg-3 col-md-6 input-group px-0">
                                                <input className={this.inputFieldClasses(homeAddressErrors.lotBlock)}
                                                type="text" name="lotBlock" value={homeAddress.lotBlock}
                                                onChange={this.onChangeHomeAddress}
                                                placeholder="Lot/Block (Optional)" noValidate />
                                            </div>

                                            <div className="col-lg-3 col-md-6 input-group px-0">
                                                <input className={this.inputFieldClasses(homeAddressErrors.street)}
                                                type="text" name="street" value={homeAddress.street}
                                                onChange={this.onChangeHomeAddress}
                                                placeholder="Street" noValidate />
                                                <div className="input-group-append">
                                                    <span className="input-group-text">St.</span>
                                                </div>
                                            </div>

                                            <div className="col-lg-6 input-group px-0">
                                                <input className={this.inputFieldClasses(homeAddressErrors.subdivision)}
                                                type="text" name="subdivision" value={homeAddress.subdivision}
                                                onChange={this.onChangeHomeAddress}
                                                placeholder="Subdivision" noValidate />
                                            </div>

                                            <div className="col-lg-4 input-group px-0">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text">Brgy.</span>
                                                </div>
                                                <input className={this.inputFieldClasses(homeAddressErrors.barangay)}
                                                type="text" name="barangay" value={homeAddress.barangay}
                                                onChange={this.onChangeHomeAddress}
                                                placeholder="Barangay" noValidate />
                                            </div>

                                            <div className="col-lg-4 input-group px-0">
                                                <input className={this.inputFieldClasses(homeAddressErrors.municipality)}
                                                type="text" name="municipality" value={homeAddress.municipality}
                                                onChange={this.onChangeHomeAddress}
                                                placeholder="Municipality" noValidate />
                                                <div className="input-group-append">
                                                    <span className="input-group-text">City</span>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 input-group px-0">
                                                <input className={this.inputFieldClasses(homeAddressErrors.province)}
                                                type="text" name="province" value={homeAddress.province}
                                                onChange={this.onChangeHomeAddress}
                                                placeholder="Province (Optional)" noValidate />
                                            </div>
                                        </div> { this.renderHomeAddressErrors(homeAddressErrors) }
                                    </div>

                                    <div className="form-group col-lg-3">
                                        <label className="m-0 ml-2">
                                            Birthdate<span className="text-danger ml-1">*</span>
                                        </label>
                                        <input className={this.inputFieldClasses(errors.birthdate)}
                                            type="date" name="birthdate" value={record.birthdate}
                                            onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.birthdate) }
                                    </div>

                                    <div className="form-group col-lg-3">
                                        <label className="m-0 ml-2">
                                            Mobile Number<span className="text-danger ml-1">*</span>
                                        </label>
                                        <div className="input-group px-0">
                                            <span className="input-group-text">+63</span>
                                            <input className={this.inputFieldClasses(errors.mobileNumber)}
                                            type="tel" maxLength="10" name="mobileNumber" value={record.mobileNumber}
                                            onChange={this.onChangeRecord} noValidate />
                                        </div>
                                        { this.renderRecordErrors(errors.mobileNumber) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Email Address<span className="text-danger ml-1">*</span>
                                        </label>
                                        <div className="input-group d-block d-sm-flex px-0">
                                            <input className={"w-sm-100 " + this.inputFieldClasses(errors.emailAddress)}
                                            type="text" name="emailAddress"  value={record.emailAddress}
                                            onChange={this.onChangeRecord} noValidate />
                                            <div className="input-group-append justify-content-end">
                                                <span className="input-group-text">@</span>
                                                <select className="input-group-text"
                                                name="email" value={record.email}
                                                onChange={this.onChangeRecord} noValidate>
                                                    <option value="@yahoo.com">yahoo.com</option>
                                                    <option value="@gmail.com">gmail.com</option>
                                                    <option value="@outlook.com">outlook.com</option>
                                                </select>
                                            </div>
                                        </div>
                                        { this.renderRecordErrors(errors.emailAddress) }
                                        <div>
                                            <small className="text-success ml-2">
                                                <i className="fa fa-info-circle mr-1"></i>
                                                <span>Valid Symbols:&nbsp;</span>
                                                <span>{"!#$%^&*.?_-"}</span>
                                            </small>
                                        </div>
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Password<span className="text-danger ml-1">*</span>
                                        </label>
                                        <div className="input-group">
                                            <input className={"zi-10 " + this.inputFieldClasses(errors.userPassword)}
                                            type={passwordState.inputType} name="userPassword" value={record.userPassword}
                                            onChange={this.onChangeRecord} noValidate />
                                            <div className="input-group-append">
                                                <button type="button" className="btn btn-light input-group-text"
                                                onClick={this.onTogglePassword}>
                                                    {passwordState.buttonText}
                                                </button>
                                            </div>
                                        </div> { this.renderRecordErrors(errors.userPassword) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Confirm Password<span className="text-danger ml-1">*</span>
                                        </label>
                                        <input className={this.inputFieldClasses(errors.confirmUserPassword)}
                                        type="password" name="confirmUserPassword" value={confirmUserPassword}
                                        onChange={this.onChangeState} noValidate />
                                        { this.renderRecordErrors(errors.confirmUserPassword) }
                                    </div>
                                </form>
                                {
                                    updated === true ?
                                    <div className="alert alert-success d-flex align-items-center mt-3 mb-1">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Successfully updated.</span>
                                    </div> : null
                                }
                            </div>

                            <div className="modal-footer">
                                <div className="d-flex justify-content-end w-100">
                                    { deleteState ?  this.deleteButtons() : this.defaultButtons() }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    defaultButtons = () => {
        return(
            <React.Fragment>
                <button className="btn btn-primary w-auto mr-1"
                onClick={this.onSubmit}>
                    <i className="fa fa-pen fa-sm"></i>
                    <span className="ml-1">Update</span>
                </button>
                <button className="btn btn-danger w-auto mr-1"
                onClick={this.onReset}>
                    <i className="fa fa-eraser"></i>
                    <span className="ml-1">Reset</span>
                </button>
                <button className="btn btn-danger w-auto mr-1"
                onClick={this.onToggleDelete}>
                    <i className="fa fa-trash"></i>
                    <span className="ml-1">Delete</span>
                </button>
            </React.Fragment>
        )
    }

    onToggleDelete = () => {
        const deleteState = !this.state.deleteState;
        this.setState({ deleteState });
    }

    deleteButtons = () => {
        return(
            <React.Fragment>
                <button className="btn btn-danger w-auto mr-1"
                data-dismiss="modal" onClick={this.onDelete}>
                    <i className="fa fa-trash"></i>
                    <span className="ml-1">Confirm Delete</span>
                </button>
                <button className="btn btn-success w-auto mr-1"
                onClick={this.onToggleDelete}>
                    <i className="fa fa-arrow-left"></i>
                    <span className="ml-1">Cancel Delete</span>
                </button>
            </React.Fragment>
        )
    }

    onDelete = () => {
        const { record } = this.state;
        const { onRefresh } = this.props;
        axios.post('http://localhost/reactPhpCrud/veterinaryClinic/deleteCustomer.php', record)
        .then(onRefresh);
    }

    getCustomersData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewCustomers.php')
        .then(res => {
            const records = res.data;
            this.setState({ records });
        })
        .catch(error => console.log(error));
    }

    inputFieldClasses = errorMsg => {
        let classes = "form-control ";
        classes+= errorMsg.length > 0 ? 
        this.state.submitError ? "border border-danger" : "" : "border border-success"
        return classes;
    }

    toProperCase = value => {
        let propervalue = ""
        let isCapital = false;
        for(var i = 0; i < value.length; i++) {
            if(value.charAt(i) === " ") {
                if(i !== 0 && value.charAt(i-1) !== " ") {
                    propervalue += value.charAt(i);
                }
                isCapital = true;
            }
            else {
                if(i === 0 || isCapital === true) {
                    propervalue += value.charAt(i).toUpperCase();
                    isCapital = false;
                }
                else {
                    propervalue += value.charAt(i);
                }           
            }
        }
        return propervalue;
    }
    
    toAbsProperCase = value => {
        let propervalue = ""
        let isCapital = false;
        for(var i = 0; i < value.length; i++) {
            if(value.charAt(i) === " ") {
                if(i !== 0 && value.charAt(i-1) !== " ") {
                    propervalue += value.charAt(i);
                }
                isCapital = true;
            }
            else {
                if(i === 0 || isCapital === true) {
                    propervalue += value.charAt(i).toUpperCase();
                    isCapital = false;
                }
                else {
                    propervalue += value.charAt(i).toLowerCase();
                }           
            }
        }
        return propervalue;
    }

    removeLastSpace = value => {
        let result = value;
        if(value.charAt(value.length-1) === ' ') {
            result = value.substring(0, value.length-1);
        }
        return result;
    }
    
    removeSpaces = value => {
        let result = "";
        for(var i = 0; i < value.length; i++) {
            if(value.charAt(i) !== " ") {
                result += value.charAt(i);         
            }
        }
        return result;
    }
    
    removeMultipleSpaces = value => {
        let result = "";
        for(var i = 0; i < value.length; i++) {
            if(value.charAt(i) === " ") {
                if(i !== 0 && value.charAt(i-1) !== " ") {
                    result += value.charAt(i);
                }
            }
            else {
                result += value.charAt(i);         
            }
        }
        
        return result;
    }
}
 
export default ViewCustomerModal;