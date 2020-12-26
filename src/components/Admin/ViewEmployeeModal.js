import axios from 'axios';
import React, { Component } from 'react';

class ViewEmployeeModal extends Component {
    state = {
        record:
        {
            id: '',
            empLastName: '',
            empFirstName: '',
            empMiddleName: '',
            empType: '',
            empPassword: ''
        },
        confirmEmpPassword: '',
        errors:
        {
            empLastName: '',
            empFirstName: '',
            empMiddleName: '',
            empType: '',
            empPassword: '',
            confirmEmpPassword: ' ',
        },
        empTypes: ['Admin', 'Groomer', 'Veterinarian' ],
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
        const { employee } = this.props;
        const record = {...this.state.record};

        record.id = employee.id;        
        record.empLastName = employee.empLastName;
        record.empFirstName = employee.empFirstName;
        record.empMiddleName = employee.empMiddleName;
        record.empType = employee.empType;
        record.empPassword = employee.empPassword;

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

        if(name === "empLastName") {
            value = this.toProperCase(value);
        }

        if(name === "empFirstName" || name === "empMiddleName") {
            value = this.toAbsProperCase(value);
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
        const { confirmEmpPassword } = this.state;
        const properLength = this.removeSpaces(value).length;

        switch(name){
            case 'empLastName':
                errors.empLastName= properLength === 0 ? " " :
                                    properLength < 2 || value.length > 24 ?
                                    "Must be at between 2 and 24 characters" : ""
                break;

            case 'empFirstName':
                errors.empFirstName=    properLength === 0 ? " " :
                                        properLength < 2 || value.length > 24 ?
                                        "Must be at between 2 and 24 characters" : ""
                break;

            case 'empMiddleName':
                errors.empMiddleName=   value.length > 24 ?
                                        "Must be at maximum of 24 characters" : ""
                break;

            case 'empType':
                errors.empType= properLength === 0 ?
                                " " : ""
                break;

            case 'empPassword':
                errors.empPassword=         properLength === 0 ? " " :
                                            properLength < 12 || value.length > 24 ? 
                                            "Password must be at between 12 and 24 characters" : ""
                errors.confirmEmpPassword=  value === confirmEmpPassword ? 
                                            confirmEmpPassword.length < 12 ? " " : "" : "Passwords do not match"
                break;

            case 'confirmEmpPassword':
                errors.confirmEmpPassword=  properLength === 0 ? " " :
                                            value === record.empPassword ?
                                            properLength < 12 ? " " : "" : "Passwords do not match"
                break;

            default:
                break;
        }

        this.setState({ errors });
    }

    onSubmit = () => {
        const errors  = {...this.state.errors};

        if(this.validForm({ errors })) {
            const { onRefresh } = this.props;
            const record = {...this.state.record};

            record.empLastName = this.removeLastSpace(record.empLastName);
            record.empFirstName = this.removeLastSpace(record.empFirstName);
            record.empMiddleName = this.removeLastSpace(record.empMiddleName);

            this.props.onSubmitForm();

            axios.post('http://localhost/reactPhpCrud/veterinaryClinic/updateEmployee.php', record)
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
        const confirmEmpPassword = '';
        const errors = {...this.state.errors};
        errors.confirmEmpPassword = ' '
        this.setState({ errors, confirmEmpPassword, submitError, updated });
    }

    validForm = ({ errors }) => {
        let valid = true;
      
        Object.values(errors).forEach(value => {
            value.length > 0 && (valid = false);
        });
      
        return valid;
    }

    renderErrors = errors => {
        if(this.state.submitError) {
            let errorItems = [];

            Object.values(errors).forEach(value => {
                if(value.length > 0) {
                    errorItems.push (
                        <div key={errorItems.length}
                            className="alert alert-danger d-flex align-items-center my-1 py-0">
                            <i className="fa fa-exclamation text-danger mr-2"></i>
                            <span>{value}</span>
                        </div>
                    )
                }
            })

            return errorItems.length > 1 ?
            <div className="mb-3 mx-3">
                {[errorItems]} 
            </div>
            : null
        }
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

    onReset = () => {
        const record = {...this.state.record};
        const errors = {...this.state.errors};

        const confirmEmpPassword = '';
        const submitError = false;
        const updated = false;

        const { employee } = this.props;
        
        record.empLastName = employee.empLastName;
        record.empFirstName = employee.empFirstName;
        record.empMiddleName = employee.empMiddleName;
        record.empType = employee.empType;
        record.empPassword = employee.empPassword;

        errors.empLastName = '';
        errors.empFirstName = '';
        errors.empMiddleName = ''
        errors.empType = '';
        errors.empPassword = '';
        errors.confirmEmpPassword = ' ';

        this.setState({ record, confirmEmpPassword, errors, submitError, updated });
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
        const { record, errors, confirmEmpPassword, updated, empTypes, passwordState, deleteState } = this.state;
        const { employee, empType, connected, connectionFailed } = this.props;

        return (
            <React.Fragment>
                <div className="modal fade" id={"viewEmployeeModal-" + employee.id} tabIndex="-1" role="dialog"
                    aria-labelledby={"viewEmployeeModalTitle-" + employee.id} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"viewEmployeeModalTitle-" + employee.id}>View Employee</h5>
                                {
                                    connected || connectionFailed ?
                                    <button className="btn btn-light text-danger p-1" data-dismiss="modal"
                                    onClick={this.onReset}>
                                        <i className="fa fa-window-close fa-lg"></i>
                                    </button> : null
                                }
                            </div>
                            <div className="modal-body">
                                {/* { this.renderErrors(errors) } */}
                                {
                                    updated ? connected ?
                                    <div className="alert alert-success d-flex align-items-center mb-3">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Record successfully updated.</span>
                                    </div> : 
                                    <div className="alert alert-primary d-flex align-items-center mb-3">
                                        <i className="fa fa-pen text-primary mr-2"></i>
                                        <span>Updating a record...</span>
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
                                        <input className={this.inputFieldClasses(errors.empLastName)}
                                        type="text" name="empLastName" value={record.empLastName}
                                        onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.empLastName) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            First Name<span className="text-danger ml-1">*</span>
                                        </label>
                                        <input className={this.inputFieldClasses(errors.empFirstName)}
                                        type="text" name="empFirstName" value={record.empFirstName}
                                        onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.empFirstName) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Middle Name</label>
                                        <input className={this.inputFieldClasses(errors.empMiddleName)}
                                        type="text" name="empMiddleName" value={record.empMiddleName}
                                        onChange={this.onChangeRecord} placeholder="(Optional)" noValidate />
                                        { this.renderRecordErrors(errors.empMiddleName) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Employee Type<span className="text-danger ml-1">*</span>
                                        </label>
                                        {
                                            record.empType === empType ?
                                            <input className={this.inputFieldClasses(errors.empType)}
                                            name="empType" value={record.empType} onChange={this.onChangeRecord}
                                            noValidate disabled /> :
                                            <select className={this.inputFieldClasses(errors.empType)}
                                            name="empType" value={record.empType} onChange={this.onChangeRecord}
                                            noValidate>
                                                <option value=''>Choose one</option>
                                                {
                                                    empTypes.length > 0 ?
                                                    empTypes.filter( value =>
                                                        (value !== "Admin" && this.props.empType === "Admin") ||
                                                        this.props.empType === "Master Admin"
                                                    ).map(value =>
                                                        <option key={value} value={value}>{value}</option>
                                                    ) : null
                                                }
                                            </select>

                                        }
                                        { this.renderRecordErrors(errors.empType) }
                                    </div>

                                    <div className="form-group col-lg-6"></div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Password<span className="text-danger ml-1">*</span>
                                        </label>
                                        <div className="input-group">
                                            <input className={"zi-10 " + this.inputFieldClasses(errors.empPassword)}
                                            type={passwordState.inputType} name="empPassword" value={record.empPassword}
                                            onChange={this.onChangeRecord} noValidate />
                                            <div className="input-group-append">
                                                <button type="button" className="btn btn-light input-group-text"
                                                onClick={this.onTogglePassword}>
                                                    {passwordState.buttonText}
                                                </button>
                                            </div>
                                        </div>
                                        { this.renderRecordErrors(errors.empPassword) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Confirm Password<span className="text-danger ml-1">*</span>
                                        </label>
                                        <input className={this.inputFieldClasses(errors.confirmEmpPassword)}
                                        type="password" name="confirmEmpPassword" value={confirmEmpPassword}
                                        onChange={this.onChangeState} noValidate />
                                        { this.renderRecordErrors(errors.confirmEmpPassword) }
                                    </div>
                                </form>
                                {
                                    updated ? connected ?
                                    <div className="alert alert-success d-flex align-items-center mt-3 mb-1">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Record successfully updated.</span>
                                    </div> : 
                                    <div className="alert alert-primary d-flex align-items-center mt-3 mb-1">
                                        <i className="fa fa-pen text-primary mr-2"></i>
                                        <span>Updating a record...</span>
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
            this.props.connected ?
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
            </React.Fragment> : null
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
        
        this.props.onSubmitForm(false);

        axios.post('http://localhost/reactPhpCrud/veterinaryClinic/deleteEmployee.php', record)
        .then(onRefresh);
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
}
 
export default ViewEmployeeModal;