import React, { Component } from 'react';

class AddOwnerModal extends Component {
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
            lastName: 'Last Name is required',
            firstName: 'First Name is required',
            middleName: '',
            homeAddressErrors:
            {
                lotBlock: '',
                street: 'Street is required',
                subdivision: 'Subdivision is required',
                barangay: 'Barangay is required',
                municipality: 'Municipality is required',
                province: ''
            },
            birthdate: 'Birthdate is required',
            mobileNumber: 'Mobile Number is required',
            emailAddress: 'Email Address is required',
            userPassword: 'Password is required',
            confirmUserPassword: 'Passwords do not match',
        },
        submitError: false
    }

    componentDidMount() {
        this.onGenerateId();
    }

    onGenerateId = () => {
        const record = {...this.state.record};
        const id = this.generateCharacters(6);
        record.id = id;
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
                errors.lastName=    value.length === 0 ? "Last Name is required" :
                                    value.length < 2 || value.length > 24 ?
                                    "Last Name must be at between 2 and 24 characters" : ""
                break;

            case 'firstName':
                errors.firstName=   value.length === 0 ? "First Name is required" :
                                    value.length < 2 || value.length > 24 ?
                                    "First Name must be at between 2 and 24 characters" : ""
                break;

            case 'middleName':
                errors.middleName=   value.length > 24 ? "Middle Name must be at maximum of 24 characters" : ""
                break;
            
            case 'birthdate':
                errors.birthdate=   value.length === 0 ? "Birthdate is required" : ""
                break;

            case 'mobileNumber':
                errors.mobileNumber=    value.length === 0 ? "Mobile Number is required" :
                                        value.length < 10 ? "Mobile Number must be at exact 10 numbers" : ""
                break;

            case 'emailAddress':
                errors.emailAddress=    value.length === 0 ? "Email Address is required" :
                                        value.length < 8 || value.length > 24 ?
                                        "Email Address must be at between 8 and 24 characters" : ""
                break;

            case 'userPassword':
                errors.userPassword=        value.length === 0 ? "Password is required" :
                                            value.length < 12 || value.length > 24 ? 
                                            "Password must be at between 12 and 24 characters" : ""
                errors.confirmUserPassword= value === confirmUserPassword ? 
                                            confirmUserPassword.length < 12 ? " " : "" : "Passwords do not match"
                break;

            case 'confirmUserPassword':
                errors.confirmUserPassword= value.length === 0 ? "Confirm Password is required" :
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
            case 'street':
                homeAddressErrors.street=   value.length === 0 ? "Street is required" :
                                            value.length < 2 || value.length > 24 ?
                                            "Street must be at between 2 and 24 characters" : ""
                break;

            case 'subdivision':
                homeAddressErrors.subdivision=  value.length === 0 ? "Subdivision is required" :
                                                value.length < 2  || value.length > 24 ?
                                                "Subdivision must be at between 2 and 24 characters" : ""
                break;

            case 'barangay':
                homeAddressErrors.barangay= value.length === 0 ? "Barangay is required" :
                                            value.length < 2  || value.length > 24 ?
                                            "Barangay must be at between 2 and 24 characters" : ""
                break;

            case 'municipality':
                homeAddressErrors.municipality= value.length === 0 ? "Municipality is required" :
                                                value.length < 2 || value.length > 24 ?
                                                "Municipality must be at between 2 and 24 characters" : ""
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
            console.log("Submitting");
            this.postSubmit();
        }
        else {
            const submitError = true;
            this.setState({ submitError });
        }
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
            if(errorMsg.length > 0) {
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
                console.log(value);
                if(value.length > 0) {
                    errorItems.push(
                        <small className="text-danger ml-2">
                            <i className="fa fa-exclamation text-danger mr-1"></i>
                            {value}
                        </small>
                    )
                }
            })
            return ([errorItems]);
        }
    }

    postSubmit = () => {
        this.onReset();  
    }

    onReset = () => {
        this.onGenerateId();
        const record = {...this.state.record};
        const homeAddress = {...this.state.record.homeAddress};
        const errors = {...this.state.errors};
        const homeAddressErrors = {...this.state.errors.homeAddressErrors};
        const confirmUserPassword = '';
        const submitError = false;

        homeAddress.lotBlock = '';
        homeAddress.street = '';
        homeAddress.subdivision = '';
        homeAddress.barangay = '';
        homeAddress.municipality = '';
        homeAddress.province = '';

        record.id = this.generateCharacters(6);
        record.lastName = '';
        record.firstName = '';
        record.middleName = ''
        record.homeAddress = homeAddress;
        record.mobileNumber = '';
        record.emailAddress = '';
        record.email = '@yahoo.com';
        record.userPassword = '';

        homeAddressErrors.street = 'Street is required';
        homeAddressErrors.subdivision = 'Subdivision is required';
        homeAddressErrors.barangay = 'Barangay is required';
        homeAddressErrors.municipality = 'Municipality is required';

        errors.lastName = 'Last Name is required';
        errors.firstName = 'First Name is required';
        errors.homeAddressErrors = homeAddressErrors;
        errors.mobileNumber = 'Mobile Number is required';
        errors.emailAddress = 'Email Address is required';
        errors.userPassword = 'Password is required';
        errors.confirmUserPassword = 'Passwords do not match';

        this.setState({ record, confirmUserPassword, errors, submitError});
    }

    render() {
        const { record, errors, confirmUserPassword } = this.state;
        const { homeAddress } = this.state.record;
        const { homeAddressErrors } = errors;

        return (
            <React.Fragment>
                <div className="modal fade" id="addCustomerModal" tabIndex="-1" role="dialog" aria-labelledby="addOwnerModalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addCustomerModalTitle">Add Customer</h5>
                                <button className="btn btn-light text-danger p-1" data-dismiss="modal"
                                onClick={this.onReset}>
                                    <i className="fa fa-window-close fa-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* { this.renderErrors(errors) } */}
                                <form className="row form-light mx-2 p-4" noValidate>
                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Id</label>
                                        <div className="input-group">
                                            <input className="form-control" type="text"
                                                name="id" value={record.id}
                                                placeholder="Please click 'Generate'"
                                                noValidate disabled />
                                            <div className="input-group-append">
                                                <button type="button" 
                                                className="btn btn-light input-group-text"
                                                onClick={this.onGenerateId}>
                                                    Generate
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Last Name</label>
                                        <input className={this.inputFieldClasses(errors.lastName)}
                                        type="text" name="lastName" value={record.lastName}
                                        onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.lastName) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">First Name</label>
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
                                        <label className="m-0 ml-2">Home Address</label>
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
                                        <label className="m-0 ml-2">Birthdate</label>
                                        <input className={this.inputFieldClasses(errors.birthdate)}
                                            type="date" name="birthdate" value={record.birthdate}
                                            onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.birthdate) }
                                    </div>

                                    <div className="form-group col-lg-3">
                                        <label className="m-0 ml-2">Mobile Number</label>
                                        <div className="input-group px-0">
                                            <span className="input-group-text">+63</span>
                                            <input className={this.inputFieldClasses(errors.mobileNumber)}
                                            type="tel" maxLength="10" name="mobileNumber" value={record.mobileNumber}
                                            onChange={this.onChangeRecord} noValidate />
                                        </div>
                                        { this.renderRecordErrors(errors.mobileNumber) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Email Address</label>
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
                                        <label className="m-0 ml-2">Password</label>
                                        <input className={this.inputFieldClasses(errors.userPassword)}
                                        type="password" name="userPassword" value={record.userPassword}
                                        onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.userPassword) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Confirm Password</label>
                                        <input className={this.inputFieldClasses(errors.confirmUserPassword)}
                                        type="password" name="confirmUserPassword" value={confirmUserPassword}
                                        onChange={this.onChangeState} noValidate />
                                        { this.renderRecordErrors(errors.confirmUserPassword) }
                                    </div>
                                </form>
                            </div>

                            <div className="modal-footer">
                                <div className="d-flex justify-content-end w-100">
                                    <button className="btn btn-primary min-w-130px w-25 mr-1"
                                    onClick={this.onSubmit}>
                                        <i className="fa fa-sign-in-alt"></i>
                                        <span className="ml-1">Submit</span>
                                    </button>
                                    <button className="btn btn-danger min-w-130px w-25"
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

    generateCharacters = length => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    inputFieldClasses = errorMsg => {
        let classes = "form-control ";
        classes+= errorMsg.length > 0 ? 
        this.state.submitError ? "border border-danger" : "" : "border border-success"
        return classes;
    }
}
 
export default AddOwnerModal;