import axios from 'axios';
import { isNumeric } from 'jquery';
import React, { Component } from 'react';

class UpdateAccountInfoModal extends Component {
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
        submitError: false,
        updated: false,
        passwordState:
        {
            inputType: 'password',
            buttonText: 'Show'
        }
    }

    componentDidMount() {
        const { customer } = this.props;
        const record = {...this.state.record};
        record.id = customer.id;
        record.lastName = customer.lastName;
        record.firstName = customer.firstName;
        record.middleName = customer.middleName;
        record.homeAddress.lotBlock = customer.lotBlock;
        record.homeAddress.street = customer.street;
        record.homeAddress.subdivision = customer.subdivision;
        record.homeAddress.barangay = customer.barangay;
        record.homeAddress.municipality = customer.municipality;
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
        const { name, value } = e.target;
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

        switch(name){
            case 'lastName':
                errors.lastName=    value.length === 0 ? " " :
                                    value.length < 2 || value.length > 24 ?
                                    "Must be at between 2 and 24 characters" : ""
                break;

            case 'firstName':
                errors.firstName=   value.length === 0 ? " " :
                                    value.length < 2 || value.length > 24 ?
                                    "Must be at between 2 and 24 characters" : ""
                break;

            case 'middleName':
                errors.middleName=  value.length > 24 ?
                                    "Must be at maximum of 24 characters" : ""
                break;
            
            case 'birthdate':
                errors.birthdate=   value.length === 0 ? " " : ""
                break;

            case 'mobileNumber':
                errors.mobileNumber=    value.length === 0 ? " " :
                                        !isNumeric(value) ? "Please input an appropriate value" :
                                        value.length < 10 ? "Must be at exact 10 numbers" : ""
                                        
                break;

            case 'emailAddress':
                errors.emailAddress=    value.length === 0 ? " " :
                                        value.length < 8 || value.length > 24 ?
                                        "Must be at between 8 and 24 characters" : ""
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

    onChangeHomeAddress = e => {
        const { name, value } = e.target;
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

        switch(name){
            case 'lotBlock':
                homeAddressErrors.lotBlock= value.length > 12 ?
                                            "Lot/Block must be at maximum of 12 characters" : ""
                break;

            case 'street':
                homeAddressErrors.street=   value.length === 0 ? " " :
                                            value.length < 2 || value.length > 24 ?
                                            "Street must be at between 2 and 24 characters" : ""
                break;

            case 'subdivision':
                homeAddressErrors.subdivision=  value.length === 0 ? " " :
                                                value.length < 2  || value.length > 24 ?
                                                "Subdivision must be at between 2 and 24 characters" : ""
                break;

            case 'barangay':
                homeAddressErrors.barangay= value.length === 0 ? " " :
                                            value.length < 2  || value.length > 24 ?
                                            "Barangay must be at between 2 and 24 characters" : ""
                break;

            case 'municipality':
                homeAddressErrors.municipality= value.length === 0 ? " " :
                                                value.length < 2 || value.length > 24 ?
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

            record.street += " St.";
            record.barangay = "Brgy. " + record.barangay;
            record.municipality += " City";

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
        this.setState({ submitError, updated });
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
        homeAddress.street = customer.street;
        homeAddress.subdivision = customer.subdivision;
        homeAddress.barangay = customer.barangay;
        homeAddress.municipality = customer.municipality;
        homeAddress.province = customer.province;

        record.lastName = customer.lastName;
        record.firstName = customer.firstName;
        record.middleName = customer.middleName
        record.homeAddress = homeAddress;
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
        errors.mobileNumber = '';
        errors.emailAddress = '';
        errors.userPassword = '';
        errors.confirmUserPassword = ' ';

        this.setState({ record, confirmUserPassword, errors, submitError, passwordState});
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
        const { record, errors, confirmUserPassword, passwordState, updated } = this.state;
        const { homeAddress } = this.state.record;
        const { homeAddressErrors } = errors;

        return (
            <React.Fragment>
                <div className="modal fade" id="updateAccountInfoModal" tabIndex="-1" role="dialog"
                    aria-labelledby="updateAccountInforModalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="updateAccountInfoModalTitle">Update Account Information</h5>
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
                                            name="id" value={record.id}
                                            placeholder="Please click 'Generate'"
                                            noValidate disabled />
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    inputFieldClasses = errorMsg => {
        let classes = "form-control ";
        classes+= errorMsg.length > 0 ? 
        this.state.submitError ? "border border-danger" : "" : "border border-success"
        return classes;
    }
}
 
export default UpdateAccountInfoModal;