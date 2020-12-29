import axios from 'axios';
import React, { Component } from 'react';

class ViewPetModal extends Component {
    state = {
        record:
        {
            id: '',
            petName: '',
            birthdate: '',
            ownerId: '',
            petClass: '',
            lastVisit: '',
            pcciRegNo: ''
        },
        records: [],
        connected: false,
        connectionFailed: false,
        errors:
        {
            petName: '',
            birthdate: '',
            ownerId: '',
            petClass: '',
            pcciRegNo: ''
        },
        submitError: false,
        updated: false,
        petClasses:
        [ 'Alpaca', 'Ant', 'Bear', 'Bird', 'Cat', 'Chicken', 'Dog', 'Dolphins', 'Duck', 'Elephant', 'Ferret', 'Fish',
        'Frog', 'Gecko', 'Gerbil', 'Giraffe', 'Goat', 'Guinea Pig', 'Hamster', 'Hedgehog', 'Hermit Crab', 
        'Horse', 'Iguana', 'Jaguar', 'Lizard', 'Mantis', 'Monkey', 'Newt', 'Octopus', 'Pig', 'Panda', 'Quill',
        'Rabbit', 'Rat', 'Salamander', 'Sheep', 'Snake','Spider', 'Tortoise', 'Turtle', 'Whale'],
        search: false,
        searchValue: '',
        deleteState: false
    }

    componentDidMount() {
        this.getCustomersData();

        const { pet } = this.props;
        const record = {...this.state.record};
        
        record.id = pet.id;
        record.petName = pet.petName;
        record.birthdate = pet.birthdate;
        record.ownerId = pet.ownerId;
        record.petClass = pet.petClass;
        record.lastVisit = pet.lastVisit;
        record.pcciRegNo = pet.pcciRegNo;

        this.setState({ record });
    }

    onChangeState = e => {
        const { name, value } = e.target;
        this.setState(currentState => ({
            ...currentState,
            [name]: value
        }))
    }

    onChangeRecord = e => {
        let { name, value } = e.target;

        value = name === "petName" ?
        this.toAbsProperCase(value) :
        name !== "petClass" ?
        this.removeSpaces(value).toUpperCase() : value

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
        const properLength = this.removeSpaces(value).length;

        switch(name){
            case 'petName':
                errors.petName=    properLength === 0 ? " " :
                                    properLength < 2 || value.length > 24 ?
                                    "Must be at between 2 and 24 characters" : ""
                break;

            case 'birthdate':
                errors.birthdate=   properLength === 0 ? " " : ""
                break;

            case 'ownerId':
                errors.ownerId=  properLength === 0 ? " " : ""
                break;
            
            case 'petClass':
                errors.petClass=   properLength === 0 ? " " : ""
                break;

            case 'pcciRegNo':
                errors.pcciRegNo=    value.length < 6 && value.length !== 0 ?
                                        "Must be at exact 6 characters" : ""
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

            record.petName = this.removeLastSpace(record.petName);

            this.props.onSubmitForm();

            axios.post('http://localhost/reactPhpCrud/veterinaryClinic/updatePet.php', record)
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
    }

    validForm = ({ errors }) => {
        let valid = true;
      
        Object.values(errors).forEach(value => {
            value.length > 0 && (valid = false);
        });

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
        const errors = {...this.state.errors};
        const submitError = false;
        const updated = false;

        const { pet } = this.props;

        record.petName = pet.petName;
        record.birthdate = pet.birthdate;
        record.ownerId = pet.ownerId;
        record.petClass = pet.petClass;
        record.pcciRegNo = pet.pcciRegNo;

        errors.petName = '';
        errors.birthdate = '';
        errors.ownerId = '';
        errors.petClass = '';
        errors.pcciRegNo = '';

        const searchValue = '';

        this.setState({ record, errors, searchValue, submitError, updated });
    }

    onToggleSearch = e => {
        e.preventDefault();
        const search = !this.state.search;
        this.setState({ search });
    }

    onClearSearch = e => {
        e.preventDefault();
        const searchValue = '';
        this.setState({ searchValue });
    }

    render() {
        const { record, records, errors, petClasses, search, searchValue, updated, deleteState } = this.state;
        const { pet, connected, connectionFailed } = this.props;

        return (
            <React.Fragment>
                <div className="modal fade" id={"viewPetModal-" + pet.id} tabIndex="-1" role="dialog"
                    aria-labelledby={"viewPetModalTitle-" + pet.id} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"viewPetModalTitle-" + pet.id}>View Pet</h5>
                                {
                                    connected || connectionFailed ?
                                    <button className="btn btn-light text-danger p-1" data-dismiss="modal"
                                    onClick={this.onReset}>
                                        <i className="fa fa-window-close fa-lg"></i>
                                    </button> : null
                                }
                            </div>
                            <div className="modal-body">
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
                                            name="id" value={record.id}
                                            placeholder="Please click 'Generate'"
                                            noValidate disabled />
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Pet Name
                                            <span className="text-danger ml-1">
                                                *<span className="small ml-1">Required</span>
                                            </span>
                                        </label>
                                        <input className={this.inputFieldClasses(errors.petName)}
                                        type="text" name="petName" value={record.petName}
                                        onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.petName) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Birthdate<span className="text-danger ml-1">*</span>
                                        </label>
                                        <input className={this.inputFieldClasses(errors.birthdate)}
                                        type="date" name="birthdate" value={record.birthdate}
                                        onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.birthdate) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">
                                            Owner Id<span className="text-danger ml-1">*</span>
                                        </label>
                                        {
                                            this.state.connected ?
                                            <React.Fragment>
                                                <div className="input-group">
                                                    <select className={"zi-10 " + this.inputFieldClasses(errors.ownerId)}
                                                    name="ownerId" value={record.ownerId} onChange={this.onChangeRecord}
                                                    noValidate>
                                                        <option value=''>Choose one</option>
                                                        {
                                                            records.length > 0 ?
                                                            records.filter(row =>
                                                                (row.lastName + ", " + row.firstName + " " + row.middleName)
                                                                .toLowerCase().match(searchValue.toLowerCase()) ||
                                                                searchValue === ''
                                                            ).map(row =>
                                                                <option key={row.id} value={row.id}>
                                                                    {row.id + " | " + row.lastName + ", " + row.firstName + " " + row.middleName}
                                                                </option>
                                                            ) : null
                                                        }
                                                    </select>
                                                    <div className="input-group-append">
                                                        <button type="button" className="btn btn-light input-group-text"
                                                        onClick={this.onToggleSearch}>
                                                            Search
                                                        </button>
                                                    </div>
                                                </div>
                                                {
                                                    search ?
                                                    <div className="input-group">
                                                        <input className="form-control"
                                                        type="text" name="searchValue"
                                                        value={searchValue} onChange={this.onChangeState}
                                                        placeholder="Search by Owner Name" noValidate />
                                                        <div className="input-group-append">
                                                            <button type="button" className="btn btn-light input-group-text"
                                                            onClick={this.onClearSearch}>
                                                                Clear
                                                            </button>
                                                        </div>
                                                    </div> : null
                                                } { this.renderRecordErrors(errors.ownerId) }
                                            </React.Fragment> :
                                            this.state.connectionFailed ?
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
                                            Pet Class<span className="text-danger ml-1">*</span>
                                        </label>
                                        <select className={this.inputFieldClasses(errors.petClass)}
                                        name="petClass" value={record.petClass} onChange={this.onChangeRecord}
                                        noValidate>
                                            <option value=''>Choose one</option>
                                            {
                                                petClasses.length > 0 ?
                                                petClasses.map(value =>
                                                    <option key={value} value={value}>{value}</option>
                                                ) : null
                                            }
                                        </select>
                                        { this.renderRecordErrors(errors.petClass) }
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">PCCI Reg. No.</label>
                                        <input className={this.inputFieldClasses(errors.pcciRegNo)}
                                        type="text" name="pcciRegNo" value={record.pcciRegNo}
                                        onChange={this.onChangeRecord} maxLength="6"
                                        placeholder="(Optional)" noValidate />
                                        { this.renderRecordErrors(errors.pcciRegNo) }
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
            this.props.connected && this.state.connected ?
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

        this.props.onSubmitForm();
        
        axios.post('http://localhost/reactPhpCrud/veterinaryClinic/deletePet.php', record)
        .then(onRefresh);
    }

    inputFieldClasses = errorMsg => {
        let classes = "form-control ";
        classes+= errorMsg.length > 0 ? 
        this.state.submitError ? "border border-danger" : "" : "border border-success"
        return classes;
    }

    retryCustomersData = () => {
        this.getCustomersData();
        const connected = false;
        const connectionFailed = false;
        this.setState({ connected, connectionFailed })
    }

    getCustomersData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewCustomers.php')
        .then(res => {
            const records = res.data;
            const connected = true;
            this.setState({ records, connected });
        })
        .catch(error => {
            console.log(error);
            const connectionFailed = true;
            this.setState({ connectionFailed });
        });
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
 
export default ViewPetModal;