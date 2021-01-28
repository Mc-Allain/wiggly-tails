import axios from 'axios';
import { isNumeric } from 'jquery';
import React, { Component } from 'react';

class InitiateTransactionModal extends Component {
    state = {
        record:
        {
            id: '',
            transType: '',
            transDate: '',
            petId: '',
            customerId: '',
            petWeight: '',
            remarks: '',
            empId: '',
            checkUp:
            {
                findings: '',
                treatment: '',
                admissionDate: '',
                releasedDate: '',
                addInfo: ''
            },
            groom:
            {
                activity: ''
            }
        },
        errors:
        {
            transType: ' ',
            petId: ' ',
            customerId: ' ',
            petWeight: ' ',
            remarks: '',
            empId: ' ',
            checkUpErrors:
            {
                findings: ' ',
                treatment: ' ',
                addInfo: ''
            },
            groomErrors:
            {
                activity: ' '
            }
        },
        pet:
        {
            search: false,
            searchValue: '',
        },
        employee:
        {
            search: false,
            searchValue: '',
        },
        submitError: false,
        submitted: false,
        added: false,
        failed: false
    }

    componentDidMount() {
        this.onGenerateId();
    }

    onGenerateId = () => {
        const record = {...this.state.record};
        const errors = {...this.state.errors};
        const { customer } = this.props;

        const id = this.generateCharacters(6);
        record.id = id;

        record.customerId = customer.id;
        errors.customerId = '';

        const currentDate = this.getCurrentDate();
        record.transDate = currentDate;
        record.checkUp.admissionDate = currentDate;
        record.checkUp.releasedDate = currentDate;

        this.setState({ record, errors });
    }

    getCurrentDate = () => {
        const dateObj = new Date(); 
        const currentMonth = dateObj.getMonth()+1 < 10 ? "0"+(dateObj.getMonth()+1) : dateObj.getMonth()+1
        const currentDay = dateObj.getDate() < 10 ? "0"+dateObj.getDate() : dateObj.getDate() 
        const currentDate = dateObj.getFullYear() + "-" + currentMonth + "-" + currentDay;
        return currentDate;
    }

    onChangeRecord = e => {
        let { name, value } = e.target;
        
        if(name === "remarks") {
            value = this.toSentenceCase(value);
        }

        this.setState(currentState => ({
            ...currentState,
            record: {
                ...currentState.record,
                [name]: value
            }
        }), () => this.onCheckRecordErrors(e))

        if(name === 'transType') {
            const checkUp = {...this.state.record.checkUp};
            const checkUpErrors = {...this.state.errors.checkUpErrors};

            checkUp.findings = '';
            checkUp.treatment = '';
            const currentDate = this.getCurrentDate();
            checkUp.admissionDate = currentDate;
            checkUp.releasedDate = currentDate;
            checkUp.addInfo = ''

            checkUpErrors.findings = ' ';
            checkUpErrors.treatment = ' ';
            checkUpErrors.addInfo = ''

            const groom = {...this.state.record.groom};
            const groomErrors = {...this.state.errors.groomErrors};

            groom.activity = '';
            
            groomErrors.activity = '';

            this.setState(currentState => ({
                ...currentState,
                record: {
                    ...currentState.record,
                    checkUp,
                    groom
                },
                errors: {
                    ...currentState.errors,
                    checkUpErrors,
                    groomErrors
                }
            }))
        }
    }

    onCheckRecordErrors = e => {
        const { name, value } = e.target;
        const errors = {...this.state.errors};

        switch(name){
            case 'transType':
                errors.transType=   value.length === 0 ? " " : ""
                break;

            case 'empId':
                errors.empId=   value.length === 0 ? " " : ""
                break;

            case 'customerId':
                errors.customerId=  value.length === 0 ? " " : ""
                break;

            case 'petId':
                errors.petId=   value.length === 0 ? " " : ""
                break;

            case 'petWeight':
                errors.petWeight=   value.length === 0 ? " " :
                                    !isNumeric(value) ? "Please input a valid value" :
                                    value.length > 6 ? "Must be at maximum of 6 numbers" : ""
                break;

            case 'remarks':
            errors.remarks= value.length > 128 ? "Must be at maximum of 128 characters" : ""
            break;

            default:
                break;
        }

        this.setState({ errors });
    }

    onChangeCheckUp = e => {
        let { name, value } = e.target;

        if(name !== "admissionDate" && name !== "releasedDate") {
            value = this.toSentenceCase(value);
        }

        this.setState(currentState => ({
            ...currentState,
            record: {
                ...currentState.record,
                checkUp : {
                    ...currentState.record.checkUp,
                    [name] : value
                }
            }
        }), () => this.onCheckCheckUpErrors(e))
    }

    onCheckCheckUpErrors = e => {
        const { name, value } = e.target;
        const checkUpErrors = {...this.state.errors.checkUpErrors};
        const properLength = this.removeSpaces(value).length;

        switch(name){
            case 'findings':
                checkUpErrors.findings= properLength === 0 ? " " :
                                        properLength < 2 || value.length > 128 ?
                                        "Must be at between 2 and 128 characters" :
                                        properLength === 0 ? " " : "" 
                break;

            case 'treatment':
                checkUpErrors.treatment=    properLength === 0 ? " " :
                                            properLength < 2 || value.length > 128 ?
                                            "Must be at between 2 and 128 characters" :
                                            properLength === 0 ? " " : ""
                break;

            case 'addInfo':
                checkUpErrors.addInfo=  value.length > 128 ? "Must be at maximum of 128 characters" : ""
                break;

            default:
                break;
        }

        this.setState(currentState => ({
            ...currentState,
            errors: {
                ...currentState.errors,
                checkUpErrors
            }
        }))
    }

    onChangeGroom = e => {
        let { name, value } = e.target;

        if(name === "activity") {
            value = this.toSentenceCase(value);
        }

        this.setState(currentState => ({
            ...currentState,
            record: {
                ...currentState.record,
                groom : {
                    ...currentState.record.groom,
                    [name] : value
                }
            }
        }), () => this.onCheckGroomErrors(e))
    }

    onCheckGroomErrors = e => {
        const { name, value } = e.target;
        const groomErrors = {...this.state.errors.groomErrors};
        const properLength = this.removeSpaces(value).length;

        switch(name){
            case 'activity':
                groomErrors.activity=   properLength === 0 ? " " :
                                        properLength < 2 || value.length > 32 ?
                                        "Must be at between 2 and 32 characters" :
                                        properLength === 0 ? " " : "" 
                break;

            default:
                break;
        }

        this.setState(currentState => ({
            ...currentState,
            errors: {
                ...currentState.errors,
                groomErrors
            }
        }))
    }

    onSubmit = () => {
        const errors  = {...this.state.errors};

        if(this.validForm({ errors })) {
            const record = {...this.state.record};

            record.remarks = this.removeLastSpace(record.remarks);
            record.checkUp.findings = this.removeLastSpace(record.checkUp.findings);
            record.checkUp.treatment = this.removeLastSpace(record.checkUp.treatment);
            record.checkUp.addInfo = this.removeLastSpace(record.checkUp.addInfo);
            record.groom.activity = this.removeLastSpace(record.groom.activity);

            this.submission();

            axios.post('http://localhost/reactPhpCrud/veterinaryClinic/insertTransaction.php', record)
            .then(() => {
                this.onReset();
                this.postSubmit();
            })
            .catch(error => {
                console.log(error);
                this.failedSubmit();
            });
        }
        else {
            const submitError = true;
            this.setState({ submitError });
        }
    }

    submission = () => {
        const submitted = true;
        const submitError = false;
        this.setState({ submitted, submitError });
    }
    
    postSubmit = () => {
        this.onReset();
        const submitted = false;
        let added = true;
        this.setState({ submitted, added });
        setTimeout(() => {
            added = false;
            this.setState({ added });
        }, 5000)
    }

    failedSubmit = () => {
        const submitted = false;
        let failed = true;
        this.setState({ submitted, failed });
        setTimeout(() => {
            failed = false;
            this.setState({ failed });
        }, 5000)
    }

    validForm = ({ errors }) => {
        const { record } = this.state;
        let valid = true;
      
        Object.values(errors).forEach(value => {
            value.length > 0 && (valid = false);
        });

        if(record.transType === 'C') {
            Object.values(errors.checkUpErrors).forEach(value => {
                value.length > 0 && (valid = false);
            });
        }
        else if(record.transType === 'G') {
            Object.values(errors.groomErrors).forEach(value => {
                value.length > 0 && (valid = false);
            });
        }
      
        return valid;
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
        const checkUp = {...this.state.record.checkUp};
        const groom = {...this.state.record.groom};
        const errors = {...this.state.errors};
        const checkUpErrors = {...this.state.errors.checkUp};
        const groomErrors = {...this.state.errors.groom};
        
        const submitError = false;
        const added = false;
        const failed = false;

        const currentDate = this.getCurrentDate();

        const id = this.generateCharacters(6);
        groom.activity = '';
        checkUp.findings = '';
        checkUp.treatment = '';
        checkUp.admissionDate = currentDate;
        checkUp.releasedDate = currentDate;
        checkUp.addInfo = '';

        record.id = id;
        record.transType = '';
        record.transDate = currentDate;
        record.petId = ''
        record.petWeight = '';
        record.remarks = '';
        record.empId = '';
        record.checkUp = checkUp;
        record.groom = groom;

        groomErrors.activity = ' ';
        checkUpErrors.findings = ' ';
        checkUpErrors.treatment = ' ';
        checkUpErrors.addInfo = '';

        errors.transType = ' ';
        errors.petId = ' '
        errors.customerId = ' ';
        errors.remarks = '';
        errors.empId = ' ';
        errors.checkUpErrors = checkUpErrors;
        errors.groomErrors = groomErrors;

        this.setState({ record, errors, submitError, added, failed});
    }

    onTogglePetSearch = e => {
        e.preventDefault();
        const pet = {...this.state.pet};
        pet.search = !pet.search;
        pet.searchValue = ''
        this.setState({ pet });
    }

    onClearPetSearch = e => {
        e.preventDefault();
        const pet = {...this.state.pet};
        pet.searchValue = ''
        this.setState({ pet });
    }

    onChangePetSearch = e => {
        const { name, value } = e.target;
        const record = {...this.state.record};
        const errors = {...this.state.errors};
        record.petId = '';
        errors.petId = ' ';
        this.setState(currentState => ({
            ...currentState,
            record, errors,
            pet: {
                ...currentState.pet,
                [name] : value
            }
        }))
    }

    onToggleEmployeeSearch = e => {
        e.preventDefault();
        const employee = {...this.state.employee};
        employee.search = !employee.search;
        employee.searchValue = ''
        this.setState({ employee });
    }

    onClearEmployeeSearch = e => {
        e.preventDefault();
        const employee = {...this.state.employee};
        employee.searchValue = ''
        this.setState({ employee });
    }

    onChangeEmployeeSearch = e => {
        const { name, value } = e.target;
        const record = {...this.state.record};
        const errors = {...this.state.errors};
        record.empId = '';
        errors.empId = ' ';
        this.setState(currentState => ({
            ...currentState,
            record, errors,
            employee: {
                ...currentState.employee,
                [name] : value
            }
        }))
    }

    render() {
        const { record, errors, pet, employee, submitted, added, failed } = this.state;
        const { customer } = this.props;

        return (
            <React.Fragment>
                <div className="modal fade" id={"addTransactionModal-"+customer.id} tabIndex="-1" role="dialog"
                    aria-labelledby={"addTransactionModalTitle-"+customer.id} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"addTransactionModalTitle-"+customer.id}>
                                    {"Add Transaction for " + customer.id + " | "
                                    + customer.lastName + ", " + customer.firstName + " " + customer.middleName}
                                </h5>
                                {
                                    !submitted ?
                                    <button className="btn btn-light text-danger p-1" data-dismiss="modal"
                                    onClick={this.onReset}>
                                        <i className="fa fa-window-close fa-lg"></i>
                                    </button> : null
                                }
                            </div>
                            <div className="modal-body">
                                {
                                    submitted ?
                                    <div className="alert alert-primary d-flex align-items-center mb-3">
                                        <i className="fa fa-pen text-primary mr-2"></i>
                                        <span>Adding a record...</span>
                                    </div> :
                                    added ? 
                                    <div className="alert alert-success d-flex align-items-center mb-3">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Record was successfully added.</span>
                                    </div> :
                                    failed ?
                                    <div className="alert alert-danger d-flex align-items-center mb-3">
                                        <i className="fa fa-exclamation text-danger mr-2"></i>
                                        <span>Database Connection Failed.</span>
                                    </div> : null
                                }
                                <form className="row form-light mx-2 p-4" noValidate>
                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Transaction Date
                                            <span className="text-danger ml-1">
                                                *<span className="small ml-1">Required</span>
                                            </span>
                                        </label>
                                        {
                                            submitted ?
                                            <input className="form-control" type="date" name="transDate"
                                            value={record.transDate} noValidate disabled /> :
                                            <input className="form-control border border-success"
                                            type="date" name="transDate" value={record.transDate}
                                            onChange={this.onChangeRecord} noValidate />
                                        }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Transaction Type<span className="text-danger ml-1">*</span>
                                        </label>
                                        {
                                            submitted ?
                                            <select className="form-control" name="transType"
                                            value={record.transType} noValidate disabled>
                                                <option value=''>Choose one</option>
                                                <option value='C'>Check-up</option>
                                                <option value='G'>Groom</option>
                                            </select> :
                                            <select className={this.inputFieldClasses(errors.transType)}
                                            name="transType" value={record.transType} onChange={this.onChangeRecord}
                                            noValidate>
                                                <option value=''>Choose one</option>
                                                <option value='C'>Check-up</option>
                                                <option value='G'>Groom</option>
                                            </select>
                                        }
                                        { this.renderRecordErrors(errors.transType) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Employee ID<span className="text-danger ml-1">*</span>
                                        </label>
                                        {
                                            this.props.employeeConnected ?
                                            <React.Fragment>
                                                <div className="input-group">
                                                    {
                                                        submitted ?
                                                        <select className="zi-10 form-control" name="empId"
                                                        value={record.empId} noValidate disabled>
                                                            <option value=''>Choose one</option>
                                                            {
                                                                this.props.employees.length > 0 ?
                                                                this.props.employees.filter(row =>
                                                                    (row.empLastName + ", " + row.empFirstName + " " + row.empMiddleName)
                                                                    .toLowerCase().match(employee.searchValue.toLowerCase()) ||
                                                                    employee.searchValue === ''
                                                                ).map(row =>
                                                                    <option key={row.id} value={row.id}>
                                                                        {row.id + " | " + row.empLastName + ", " + row.empFirstName + " " + row.empMiddleName}
                                                                    </option>
                                                                ) : null
                                                            }
                                                        </select> :
                                                        <React.Fragment>
                                                            <select className={"zi-10 " + this.inputFieldClasses(errors.empId)}
                                                            name="empId" value={record.empId} onChange={this.onChangeRecord}
                                                            noValidate>
                                                                <option value=''>Choose one</option>
                                                                {
                                                                    this.props.employees.length > 0 ?
                                                                    this.props.employees.filter(row =>
                                                                        (row.empLastName + ", " + row.empFirstName + " " + row.empMiddleName)
                                                                        .toLowerCase().match(employee.searchValue.toLowerCase()) ||
                                                                        employee.searchValue === ''
                                                                    ).map(row =>
                                                                        <option key={row.id} value={row.id}>
                                                                            {row.id + " | " + row.empLastName + ", " + row.empFirstName + " " + row.empMiddleName}
                                                                        </option>
                                                                    ) : null
                                                                }
                                                            </select>
                                                            <div className="input-group-append">
                                                                <button type="button" className="btn btn-light input-group-text"
                                                                onClick={this.onToggleEmployeeSearch}>
                                                                    Search
                                                                </button>
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                </div>
                                                {
                                                    employee.search && !submitted ?
                                                    <div className="input-group">
                                                        <input className="form-control"
                                                        type="text" name="searchValue"
                                                        value={employee.searchValue} onChange={this.onChangeEmployeeSearch}
                                                        placeholder="Search by Employee Name" noValidate />
                                                        <div className="input-group-append">
                                                            <button type="button" className="btn btn-light input-group-text"
                                                            onClick={this.onClearEmployeeSearch}>
                                                                Clear
                                                            </button>
                                                        </div>
                                                    </div> : null
                                                } { this.renderRecordErrors(errors.empId) }
                                            </React.Fragment> :
                                            this.props.employeeConnectionFailed ?
                                            <div className="input-group d-block d-sm-flex px-0">
                                                <input className="form-control border border-danger zi-10"
                                                value="Database Connection Failed: Please try again later..."
                                                noValidate disabled /> 
                                                <div className="input-group-append justify-content-end">
                                                    <button type="button" className="btn btn-light input-group-text"
                                                    onClick={this.props.retryEmployeesData}>Retry</button>
                                                </div>
                                            </div> :
                                            <input className="form-control"
                                            value="Loading Data: Please wait..."
                                            noValidate disabled />
                                        }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Customer ID<span className="text-danger ml-1">*</span>
                                        </label>
                                        <input className="form-control" name="customerId"
                                        value={record.customerId} noValidate disabled />
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Pet ID<span className="text-danger ml-1">*</span>
                                        </label>
                                        {
                                            this.props.petConnected ?
                                            <React.Fragment>
                                                <div className="input-group">
                                                    {
                                                        submitted ?
                                                        <select className="zi-10 form-control" name="petId"
                                                        value={record.petId} noValidate disabled>
                                                            {
                                                                this.props.pets.filter(row =>
                                                                    (row.petName.toLowerCase().match(pet.searchValue.toLowerCase()) && row.ownerId === record.customerId) ||
                                                                    (pet.searchValue === '' && row.ownerId === record.customerId)
                                                                ).length > 0 || pet.searchValue.length > 0 ?
                                                                <option value=''>Choose one</option> :
                                                                record.customerId.length > 0 ?
                                                                <option value=''>No pet found</option> :
                                                                <option value=''>Customer ID is required</option>
                                                            }
                                                            {
                                                                this.props.pets.length > 0 ?
                                                                this.props.pets.filter(row =>
                                                                    (row.petName.toLowerCase().match(pet.searchValue.toLowerCase()) && row.ownerId === record.customerId) ||
                                                                    (pet.searchValue === '' && row.ownerId === record.customerId)
                                                                ).map(row =>
                                                                    <option key={row.id} value={row.id}>
                                                                        {row.id + " | " + row.petName}
                                                                    </option>
                                                                ) : null
                                                            }
                                                        </select> :
                                                        <select className={"zi-10 " + this.inputFieldClasses(errors.petId)}
                                                        name="petId" value={record.petId} onChange={this.onChangeRecord}
                                                        noValidate>
                                                            {
                                                                this.props.pets.filter(row =>
                                                                    (row.petName.toLowerCase().match(pet.searchValue.toLowerCase()) && row.ownerId === record.customerId) ||
                                                                    (pet.searchValue === '' && row.ownerId === record.customerId)
                                                                ).length > 0 || pet.searchValue.length > 0 ?
                                                                <option value=''>Choose one</option> :
                                                                record.customerId.length > 0 ?
                                                                <option value=''>No pet found</option> :
                                                                <option value=''>Customer ID is required</option>
                                                            }
                                                            {
                                                                this.props.pets.length > 0 ?
                                                                this.props.pets.filter(row =>
                                                                    (row.petName.toLowerCase().match(pet.searchValue.toLowerCase()) && row.ownerId === record.customerId) ||
                                                                    (pet.searchValue === '' && row.ownerId === record.customerId)
                                                                ).map(row =>
                                                                    <option key={row.id} value={row.id}>
                                                                        {row.id + " | " + row.petName}
                                                                    </option>
                                                                ) : null
                                                            }
                                                        </select>
                                                    }
                                                    {
                                                        (this.props.pets.filter(row =>
                                                            (row.petName.match(pet.searchValue) && row.ownerId === record.customerId) ||
                                                            (pet.searchValue === '' && row.ownerId === record.customerId)
                                                        ).length > 0 || pet.searchValue.length > 0) && !submitted ?
                                                        <div className="input-group-append">
                                                            <button type="button" className="btn btn-light input-group-text"
                                                            onClick={this.onTogglePetSearch}>
                                                                Search
                                                            </button>
                                                        </div> : null
                                                    }
                                                </div>
                                                {
                                                    pet.search && !submitted ?
                                                    <div className="input-group">
                                                        <input className="form-control"
                                                        type="text" name="searchValue"
                                                        value={pet.searchValue} onChange={this.onChangePetSearch}
                                                        placeholder="Search by Pet Name" noValidate />
                                                        <div className="input-group-append">
                                                            <button type="button" className="btn btn-light input-group-text"
                                                            onClick={this.onClearPetSearch}>
                                                                Clear
                                                            </button>
                                                        </div>
                                                    </div> : null
                                                } { this.renderRecordErrors(errors.petId) }
                                            </React.Fragment> :
                                            this.props.customerConnectionFailed ?
                                            <div className="input-group d-block d-sm-flex px-0">
                                                <input className="form-control border border-danger zi-10"
                                                value="Database Connection Failed: Please try again later..."
                                                noValidate disabled /> 
                                                <div className="input-group-append justify-content-end">
                                                    <button type="button" className="btn btn-light input-group-text"
                                                    onClick={this.props.retryPetsData}>Retry</button>
                                                </div>
                                            </div> :
                                            <input className="form-control"
                                            value="Loading Data: Please wait..."
                                            noValidate disabled />
                                        }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Pet Weight<span className="text-danger ml-1">*</span>
                                        </label>
                                        <div className="input-group">
                                            {
                                                submitted ?
                                                <input className="form-control" type="text" name="petWeight"
                                                value={record.petWeight} noValidate disabled /> :
                                                <input className={this.inputFieldClasses(errors.petWeight)}
                                                type="text" name="petWeight" value={record.petWeight}
                                                onChange={this.onChangeRecord} noValidate />
                                            }
                                            <div className="input-group-append">
                                                <span className="input-group-text">Kilogram</span>
                                            </div>
                                        </div>{ this.renderRecordErrors(errors.petWeight) }
                                    </div>

                                    <div className="form-group col">
                                        <label className="m-0 ml-2">
                                            Remarks
                                        </label>
                                        {
                                            submitted ?
                                            <textarea className="form-control" type="text" name="remarks"
                                            value={record.remarks} rows="2" noValidate disabled /> :
                                            <textarea className={this.inputFieldClasses(errors.remarks)}
                                            type="text" name="remarks" value={record.remarks}
                                            onChange={this.onChangeRecord} rows="2" noValidate />
                                        }
                                        { this.renderRecordErrors(errors.remarks) }
                                    </div>
                                    {
                                        record.transType === 'C' ?
                                        this.checkUpForm() :
                                        record.transType === 'G' ?
                                        this.groomForm() : null
                                    }
                                </form>
                                {
                                    submitted ?
                                    <div className="alert alert-primary d-flex align-items-center mt-3 mb-1 d-lg-none">
                                        <i className="fa fa-pen text-primary mr-2"></i>
                                        <span>Adding a record...</span>
                                    </div> :
                                    added ? 
                                    <div className="alert alert-success d-flex align-items-center mt-3 mb-1 d-lg-none">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Record was successfully added.</span>
                                    </div> :
                                    failed ?
                                    <div className="alert alert-danger d-flex align-items-center mt-3 mb-1 d-lg-none">
                                        <i className="fa fa-exclamation text-danger mr-2"></i>
                                        <span>Database Connection Failed.</span>
                                    </div> : null
                                }
                            </div>

                            <div className="modal-footer">
                                <div className="d-flex justify-content-end w-100">
                                    {
                                        !submitted && this.props.petConnected &&
                                        this.props.employeeConnected ?
                                        <React.Fragment>
                                            <button className="btn btn-primary w-auto mr-1"
                                            onClick={this.onSubmit}>
                                                <i className="fa fa-sign-in-alt"></i>
                                                <span className="ml-1">Submit</span>
                                            </button>
                                            <button className="btn btn-danger w-auto"
                                            onClick={this.onReset}>
                                                <i className="fa fa-eraser"></i>
                                                <span className="ml-1">Reset</span>
                                            </button>
                                        </React.Fragment> : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    checkUpForm = () => {
        const { submitted } = this.state;
        const { checkUp } = this.state.record;
        const { checkUpErrors } = this.state.errors;

        return(
            <div className="col-12 sub-form bt-1 mt-3">
                <div className="row mt-3">
                    <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                            Findings<span className="text-danger ml-1">*</span>
                        </label>
                        {
                            submitted ?
                            <input className="form-control" type="text" name="findings"
                            value={checkUp.findings} noValidate disabled /> :
                            <input className={this.inputFieldClasses(checkUpErrors.findings)}
                            type="text" name="findings" value={checkUp.findings}
                            onChange={this.onChangeCheckUp} noValidate />
                        }
                        { this.renderRecordErrors(checkUpErrors.findings) }
                    </div>

                    <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                            Treatment<span className="text-danger ml-1">*</span>
                        </label>
                        {
                            submitted ?
                            <input className="form-control" type="text" name="treatment"
                            value={checkUp.treatment} noValidate disabled /> :
                            <input className={this.inputFieldClasses(checkUpErrors.treatment)}
                            type="text" name="treatment" value={checkUp.treatment}
                            onChange={this.onChangeCheckUp} noValidate />
                        }
                        { this.renderRecordErrors(checkUpErrors.treatment) }
                    </div>

                    <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                            Admission Date<span className="text-danger ml-1">*</span>
                        </label>
                        {
                            submitted ?
                            <input className="form-control" type="date" name="admissionDate"
                            value={checkUp.admissionDate} noValidate disabled /> :
                            <input className="form-control border border-success"
                            type="date" name="admissionDate" value={checkUp.admissionDate}
                            onChange={this.onChangeCheckUp} noValidate />
                        }
                    </div>

                    <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                            Released Date<span className="text-danger ml-1">*</span>
                        </label>
                        {
                            submitted ?
                            <input className="form-control" type="date" name="releasedDate"
                            value={checkUp.releasedDate} noValidate disabled /> :
                            <input className="form-control border border-success"
                            type="date" name="releasedDate" value={checkUp.releasedDate}
                            onChange={this.onChangeCheckUp} noValidate />
                        }
                    </div>

                    <div className="form-group col">
                        <label className="m-0 ml-2">
                            Additional Information
                        </label>
                        {
                            submitted ?
                            <textarea className="form-control" type="text" name="addInfo"
                            value={checkUp.addInfo} rows="2" noValidate /> :
                            <textarea className={this.inputFieldClasses(checkUpErrors.addInfo)}
                            type="text" name="addInfo" value={checkUp.addInfo}
                            onChange={this.onChangeCheckUp} rows="2" noValidate />
                        }
                        { this.renderRecordErrors(checkUpErrors.addInfo) }
                    </div>
                </div>
            </div>
        )
    }

    groomForm = () => {
        const { submitted } = this.state;
        const { groom } = this.state.record;
        const { groomErrors } = this.state.errors;
        
        return(
            <div className="col-12 sub-form bt-1 mt-3">
                <div className="row mt-3">
                    <div className="form-group col">
                        <label className="m-0 ml-2">
                            Activity<span className="text-danger ml-1">*</span>
                        </label>
                        {
                            submitted ?
                            <input className="form-control" type="text" name="activity"
                            value={groom.activity} noValidate /> :
                            <input className={this.inputFieldClasses(groomErrors.activity)}
                            type="text" name="activity" value={groom.activity}
                            onChange={this.onChangeGroom} noValidate />
                        }
                        { this.renderRecordErrors(groomErrors.activity) }
                    </div>
                </div>
            </div>
        )
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

    toSentenceCase = value => {
        let propervalue = ""
        let isCapital = false;
        for(var i = 0; i < value.length; i++) {
            if(value.charAt(i) === " ") {
                if(i !== 0 && value.charAt(i-1) !== " ") {
                    propervalue += value.charAt(i);
                }
                if(i !== 0 && value.charAt(i-1) === ".") {
                    isCapital = true;
                }
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
}
 
export default InitiateTransactionModal;