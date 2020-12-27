import axios from 'axios';
import { isNumeric } from 'jquery';
import React, { Component } from 'react';

class AddTransactionModal extends Component {
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
        submitError: false,
        added: false,
        customers: [],
        customerConnected: false,
        customerConnectionFailed: false,
        pets: [],
        petConnected: false,
        petConnectionFailed: false,
        employees: [],
        employeeConnected: false,
        employeeConnectionFailed: false,
        customer:
        {
            search: false,
            searchValue: '',
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
        }
    }

    componentDidMount() {
        this.onGenerateId();
        this.getCustomersData();
        this.getPetsData();
        this.getEmployeesData();
    }

    onGenerateId = () => {
        const record = {...this.state.record};
        const id = this.generateCharacters(6);
        record.id = id;
        record.transDate = this.getCurrentDate();
        this.setState({ record });
    }

    getCurrentDate = () => {
        const dateObj = new Date(); 
        const currentDate = dateObj.getFullYear() + "-" + (dateObj.getMonth()+1) + "-" + dateObj.getDate();
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
            checkUp.admissionDate = '';
            checkUp.releasedDate = '';
            checkUp.addInfo = ''

            checkUpErrors.findings = ' ';
            checkUpErrors.treatment = ' ';
            checkUpErrors.admissionDate = '';
            checkUpErrors.releasedDate = '';
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
            const { onRefresh } = this.props;
            const record = {...this.state.record};

            record.remarks = this.removeLastSpace(record.remarks);
            record.checkUp.findings = this.removeLastSpace(record.checkUp.findings);
            record.checkUp.treatment = this.removeLastSpace(record.checkUp.treatment);
            record.checkUp.addInfo = this.removeLastSpace(record.checkUp.addInfo);
            record.groom.activity = this.removeLastSpace(record.groom.activity);

            this.props.onSubmitForm();

            axios.post('http://localhost/reactPhpCrud/veterinaryClinic/insertTransaction.php', record)
            .then(onRefresh, this.postSubmit());
        }
        else {
            const submitError = true;
            this.setState({ submitError });
        }
    }
    
    postSubmit = () => {
        this.onReset();
        let added = true;
        const submitError = false;
        this.setState({ submitError, added });
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

        const id = this.generateCharacters(6);
        groom.activity = '';
        checkUp.findings = '';
        checkUp.treatment = '';
        checkUp.admissionDate = this.getCurrentDate();
        checkUp.releasedDate = '';
        checkUp.addInfo = '';

        record.id = id;
        record.transType = '';
        record.transDate = this.getCurrentDate();
        record.petId = ''
        record.customerId = '';
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

        this.setState({ record, errors, submitError, added });
    }

    onToggleCustomerSearch = e => {
        e.preventDefault();
        const customer = {...this.state.customer};
        customer.search = !customer.search;
        customer.searchValue = ''
        this.setState({ customer });
    }

    onClearCustomerSearch = e => {
        e.preventDefault();
        const customer = {...this.state.customer};
        customer.searchValue = ''
        this.setState({ customer });
    }

    onChangeCustomerSearch = e => {
        const { name, value } = e.target;
        this.setState(currentState => ({
            ...currentState,
            customer: {
                ...currentState.customer,
                [name] : value
            }
        }))
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
        this.setState(currentState => ({
            ...currentState,
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
        this.setState(currentState => ({
            ...currentState,
            employee: {
                ...currentState.employee,
                [name] : value
            }
        }))
    }

    render() {
        const { record, errors, customers, customer, pets, pet, employees, employee, added } = this.state;

        return (
            <React.Fragment>
                <div className="modal fade" id="addTransactionModal" tabIndex="-1" role="dialog"
                    aria-labelledby="addTransactionModalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addTransactionModalTitle">Add Transaction</h5>
                                <button className="btn btn-light text-danger p-1" data-dismiss="modal"
                                onClick={this.onReset}>
                                    <i className="fa fa-window-close fa-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    added ?
                                    <div className="alert alert-success d-flex align-items-center mt-3 mb-1">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Record successfully added.</span>
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
                                        <input className="form-control border border-success"
                                        type="date" name="transDate" value={record.transDate}
                                        onChange={this.onChangeRecord} noValidate />
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Transaction Type<span className="text-danger ml-1">*</span>
                                        </label>
                                        <select className={this.inputFieldClasses(errors.transType)}
                                        name="transType" value={record.transType} onChange={this.onChangeRecord}
                                        noValidate>
                                            <option value=''>Choose one</option>
                                            <option value='C'>Check-up</option>
                                            <option value='G'>Groom</option>
                                        </select>
                                        { this.renderRecordErrors(errors.transType) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Employee Id<span className="text-danger ml-1">*</span>
                                        </label>
                                        {
                                            this.state.employeeConnected ?
                                                <React.Fragment>
                                                <div className="input-group">
                                                    <select className={"zi-10 " + this.inputFieldClasses(errors.empId)}
                                                    name="empId" value={record.empId} onChange={this.onChangeRecord}
                                                    noValidate>
                                                        <option value=''>Choose one</option>
                                                        {
                                                            employees.length > 0 ?
                                                            employees.filter(row =>
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
                                                </div>
                                                {
                                                    employee.search ?
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
                                            this.state.employeeConnectionFailed ?
                                            <div className="input-group d-block d-sm-flex px-0">
                                                <input className="form-control border border-danger zi-10"
                                                value="Database Connection Failed: Please try again later..."
                                                noValidate disabled /> 
                                                <div className="input-group-append justify-content-end">
                                                    <button type="button" className="btn btn-light input-group-text"
                                                    onClick={this.retryEmployeesData}>Retry</button>
                                                </div>
                                            </div> :
                                            <input className="form-control"
                                            value="Loading Data: Please wait..."
                                            noValidate disabled />
                                        }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Customer Id<span className="text-danger ml-1">*</span>
                                        </label>
                                        {
                                            this.state.customerConnected ?
                                            <React.Fragment>
                                                <div className="input-group">
                                                    <select className={"zi-10 " + this.inputFieldClasses(errors.customerId)}
                                                    name="customerId" value={record.customerId} onChange={this.onChangeRecord}
                                                    noValidate>
                                                        <option value=''>Choose one</option>
                                                        {
                                                            customers.length > 0 ?
                                                            customers.filter(row =>
                                                                (row.lastName + ", " + row.firstName + " " + row.middleName)
                                                                .toLowerCase().match(customer.searchValue.toLowerCase()) ||
                                                                customer.searchValue === ''
                                                            ).map(row =>
                                                                <option key={row.id} value={row.id}>
                                                                    {row.id + " | " + row.lastName + ", " + row.firstName + " " + row.middleName}
                                                                </option>
                                                            ) : null
                                                        }
                                                    </select>
                                                    <div className="input-group-append">
                                                        <button type="button" className="btn btn-light input-group-text"
                                                        onClick={this.onToggleCustomerSearch}>
                                                            Search
                                                        </button>
                                                    </div>
                                                </div>
                                                {
                                                    customer.search ?
                                                    <div className="input-group">
                                                        <input className="form-control"
                                                        type="text" name="searchValue"
                                                        value={customer.searchValue} onChange={this.onChangeCustomerSearch}
                                                        placeholder="Search by Customer Name" noValidate />
                                                        <div className="input-group-append">
                                                            <button type="button" className="btn btn-light input-group-text"
                                                            onClick={this.onClearCustomerSearch}>
                                                                Clear
                                                            </button>
                                                        </div>
                                                    </div> : null
                                                } { this.renderRecordErrors(errors.customerId) }
                                            </React.Fragment> :
                                            this.state.customerConnectionFailed ?
                                            <div className="input-group d-block d-sm-flex px-0">
                                                <input className="form-control border border-danger zi-10"
                                                value="Database Connection Failed: Please try again later..."
                                                noValidate disabled /> 
                                                <div className="input-group-append justify-content-end">
                                                    <button type="button" className="btn btn-light input-group-text"
                                                    onClick={this.retryCustomersData}>Retry</button>
                                                </div>
                                            </div> :
                                            <input className="form-control"
                                            value="Loading Data: Please wait..."
                                            noValidate disabled />
                                        }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Pet Id<span className="text-danger ml-1">*</span>
                                        </label>
                                        {
                                            this.state.petConnected ?
                                            <React.Fragment>
                                                <div className="input-group">
                                                    <select className={"zi-10 " + this.inputFieldClasses(errors.petId)}
                                                    name="petId" value={record.petId} onChange={this.onChangeRecord}
                                                    noValidate>
                                                        {
                                                            pets.filter(row =>
                                                                (row.petName.toLowerCase().match(pet.searchValue.toLowerCase()) && row.ownerId === record.customerId) ||
                                                                (pet.searchValue === '' && row.ownerId === record.customerId)
                                                            ).length > 0 || pet.searchValue.length > 0 ?
                                                            <option value=''>Choose one</option> :
                                                            record.customerId.length > 0 ?
                                                            <option value=''>No pet found</option> :
                                                            <option value=''>Customer Id is required</option>
                                                        }
                                                        {
                                                            pets.length > 0 ?
                                                            pets.filter(row =>
                                                                (row.petName.toLowerCase().match(pet.searchValue.toLowerCase()) && row.ownerId === record.customerId) ||
                                                                (pet.searchValue === '' && row.ownerId === record.customerId)
                                                            ).map(row =>
                                                                <option key={row.id} value={row.id}>
                                                                    {row.id + " | " + row.petName}
                                                                </option>
                                                            ) : null
                                                        }
                                                    </select>
                                                    {
                                                        pets.filter(row =>
                                                            (row.petName.match(pet.searchValue) && row.ownerId === record.customerId) ||
                                                            (pet.searchValue === '' && row.ownerId === record.customerId)
                                                        ).length > 0 || pet.searchValue.length > 0 ?
                                                        <div className="input-group-append">
                                                            <button type="button" className="btn btn-light input-group-text"
                                                            onClick={this.onTogglePetSearch}>
                                                                Search
                                                            </button>
                                                        </div> : null
                                                    }
                                                </div>
                                                {
                                                    pet.search ?
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
                                            this.state.petConnectionFailed ?
                                            <div className="input-group d-block d-sm-flex px-0">
                                                <input className="form-control border border-danger zi-10"
                                                value="Database Connection Failed: Please try again later..."
                                                noValidate disabled /> 
                                                <div className="input-group-append justify-content-end">
                                                    <button type="button" className="btn btn-light input-group-text"
                                                    onClick={this.retryPetsData}>Retry</button>
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
                                            <input className={this.inputFieldClasses(errors.petWeight)}
                                            type="text" name="petWeight" value={record.petWeight}
                                            onChange={this.onChangeRecord} noValidate />
                                            <div className="input-group-append">
                                                <span className="input-group-text">Kilogram</span>
                                            </div>
                                        </div>{ this.renderRecordErrors(errors.petWeight) }
                                    </div>

                                    <div className="form-group col">
                                        <label className="m-0 ml-2">
                                            Remarks
                                        </label>
                                        <textarea className={this.inputFieldClasses(errors.remarks)}
                                        type="text" name="remarks" value={record.remarks}
                                        onChange={this.onChangeRecord} rows="2" noValidate />
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
                                    added ?
                                    <div className="alert alert-success d-flex align-items-center mt-3 mb-1">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Record successfully added.</span>
                                    </div> : null
                                }
                            </div>

                            <div className="modal-footer">
                                <div className="d-flex justify-content-end w-100">
                                    {
                                        this.state.customerConnected && this.state.petConnected && this.state.employeeConnected ?
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
        const { checkUp } = this.state.record;
        const { checkUpErrors } = this.state.errors;

        return(
            <div className="col-12 sub-form bt-1 mt-3">
                <div className="row mt-3">
                    <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                            Findings<span className="text-danger ml-1">*</span>
                        </label>
                        <input className={this.inputFieldClasses(checkUpErrors.findings)}
                        type="text" name="findings" value={checkUp.findings}
                        onChange={this.onChangeCheckUp} noValidate />
                        { this.renderRecordErrors(checkUpErrors.findings) }
                    </div>

                    <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                            Treatment<span className="text-danger ml-1">*</span>
                        </label>
                        <input className={this.inputFieldClasses(checkUpErrors.treatment)}
                        type="text" name="treatment" value={checkUp.treatment}
                        onChange={this.onChangeCheckUp} noValidate />
                        { this.renderRecordErrors(checkUpErrors.treatment) }
                    </div>

                    <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                            Admission Date
                        </label>
                        <input className="form-control border border-success"
                        type="date" name="admissionDate" value={checkUp.admissionDate}
                        onChange={this.onChangeCheckUp} noValidate />
                    </div>

                    <div className="form-group col-lg-6">
                        <label className="m-0 ml-2">
                            Released Date
                        </label>
                        <input className="form-control border border-success"
                        type="date" name="releasedDate" value={checkUp.releasedDate}
                        onChange={this.onChangeCheckUp} noValidate />
                    </div>

                    <div className="form-group col">
                        <label className="m-0 ml-2">
                            Additional Information
                        </label>
                        <textarea className={this.inputFieldClasses(checkUpErrors.addInfo)}
                        type="text" name="addInfo" value={checkUp.addInfo}
                        onChange={this.onChangeCheckUp} rows="2" noValidate />
                        { this.renderRecordErrors(checkUpErrors.addInfo) }
                    </div>
                </div>
            </div>
        )
    }

    groomForm = () => {
        const { groom } = this.state.record;
        const { groomErrors } = this.state.errors;
        
        return(
            <div className="col-12 sub-form bt-1 mt-3">
                <div className="row mt-3">
                    <div className="form-group col">
                        <label className="m-0 ml-2">
                            Activity<span className="text-danger ml-1">*</span>
                        </label>
                        <input className={this.inputFieldClasses(groomErrors.activity)}
                        type="text" name="activity" value={groom.activity}
                        onChange={this.onChangeGroom} noValidate />
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

    retryCustomersData = () => {
        this.getCustomersData();
        const customerConnected = false;
        const customerConnectionFailed = false;
        this.setState({ customerConnected, customerConnectionFailed })
    }

    getCustomersData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewCustomers.php')
        .then(res => {
            const customers = res.data;
            const customerConnected = true
            this.setState({ customers, customerConnected });
        })
        .catch(error => {
            console.log(error);
            const customerConnectionFailed = true;
            this.setState({ customerConnectionFailed });
        });
    }

    retryPetsData = () => {
        this.getPetsData();
        const petConnected = false;
        const petConnectionFailed = false;
        this.setState({ petConnected, petConnectionFailed })
    }

    getPetsData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewPets.php')
        .then(res => {
            const pets = res.data;
            const petConnected = true
            this.setState({ pets, petConnected });
        })
        .catch(error => {
            console.log(error);
            const petConnectionFailed = true;
            this.setState({ petConnectionFailed });
        });
    }

    retryEmployeesData = () => {
        this.getEmployeesData();
        const employeeConnected = false;
        const employeeConnectionFailed = false;
        this.setState({ employeeConnected, employeeConnectionFailed })
    }

    getEmployeesData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewEmployees.php')
        .then(res => {
            const employees = res.data;
            const employeeConnected = true
            this.setState({ employees, employeeConnected });
        })
        .catch(error => {
            console.log(error);
            const employeeConnectionFailed = true;
            this.setState({ employeeConnectionFailed });
        });
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
 
export default AddTransactionModal;