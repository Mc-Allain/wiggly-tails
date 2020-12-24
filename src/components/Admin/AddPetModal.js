import axios from 'axios';
import React, { Component } from 'react';

class AddPetModal extends Component {
    state = {
        record:
        {
            id: '',
            petName: '',
            birthdate: '',
            ownerId: '',
            petClass: '',
            lastVisit: '',
            pccId: ''
        },
        records: [],
        errors:
        {
            petName: ' ',
            birthdate: ' ',
            ownerId: ' ',
            petClass: ' ',
            pccId: ''
        },
        submitError: false,
        petClasses:
        [ 'Alpaca', 'Ant', 'Bear', 'Bird', 'Cat', 'Chicken', 'Dog', 'Dolphins', 'Duck', 'Elephant', 'Ferret', 'Fish',
        'Frog', 'Gecko', 'Gerbil', 'Giraffe', 'Goat', 'Guinea Pig', 'Hamster', 'Hedgehog', 'Hermit Crab', 
        'Horse', 'Iguana', 'Jaguar', 'Lizard', 'Mantis', 'Monkey', 'Newt', 'Octopus', 'Pig', 'Panda', 'Quill',
        'Rabbit', 'Rat', 'Salamander', 'Sheep', 'Snake','Spider', 'Tortoise', 'Turtle', 'Whale'],
        search: false,
        searchValue: '',
        added: false
    }

    componentDidMount() {
        this.onGenerateId();
        this.getCustomersData();
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

            case 'pccId':
                errors.pccId=    value.length > 12 ? "Must be at maximum of 12 characters" : ""
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

            axios.post('http://localhost/reactPhpCrud/veterinaryClinic/insertPet.php', record)
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
        added = false;
        setTimeout(() => this.setState({ added }), 5000);
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
        this.onGenerateId();
        const record = {...this.state.record};
        const errors = {...this.state.errors};
        const submitError = false;

        record.id = this.generateCharacters(6);
        record.petName = '';
        record.birthdate = '';
        record.ownerId = '';
        record.petClass = '';
        record.pccId = '';

        errors.petName = 'Pet Name is required';
        errors.birthdate = 'Birthdate is required';
        errors.ownerId = 'Owner Id is required'
        errors.petClass = 'Pet Class is required';
        errors.pccId = '';

        const searchValue = '';

        this.setState({ record, errors, searchValue, submitError});
    }

    onToggleSearch = e => {
        e.preventDefault();
        const search = !this.state.search;
        const searchValue = '';
        this.setState({ search, searchValue });
    }

    onClearSearch = e => {
        e.preventDefault();
        const searchValue = '';
        this.setState({ searchValue });
    }

    render() {
        const { record, records, errors, petClasses, search, searchValue, added } = this.state;

        return (
            <React.Fragment>
                <div className="modal fade" id="addPetModal" tabIndex="-1" role="dialog"
                    aria-labelledby="addPetModalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addPetModalTitle">Add Pet</h5>
                                <button className="btn btn-light text-danger p-1" data-dismiss="modal"
                                onClick={this.onReset}>
                                    <i className="fa fa-window-close fa-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    added === true ?
                                    <div className="alert alert-success d-flex align-items-center">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Successfully added.</span>
                                    </div> : null
                                }
                                <form className="row form-light mx-2 p-4" noValidate>
                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Id</label>
                                        <div className="input-group">
                                            <input className="form-control zi-10" type="text"
                                            name="id" value={record.id}
                                            noValidate disabled />
                                            <div className="input-group-append">
                                                <button type="button" className="btn btn-light input-group-text"
                                                onClick={this.onGenerateId}>
                                                    Generate
                                                </button>
                                            </div>
                                        </div>
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
                                        <label className="m-0 ml-2">PCC Id</label>
                                        <input className={this.inputFieldClasses(errors.pccId)}
                                        type="text" name="pccId" value={record.pccId}
                                        onChange={this.onChangeRecord}
                                        placeholder="(Optional)" noValidate />
                                        { this.renderRecordErrors(errors.pccId) }
                                    </div>
                                </form>
                                {
                                    added === true ?
                                    <div className="alert alert-success d-flex align-items-center mt-3 mb-1">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Successfully added.</span>
                                    </div> : null
                                }
                            </div>

                            <div className="modal-footer">
                                <div className="d-flex justify-content-end w-100">
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

    getCustomersData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewCustomers.php')
        .then(res => {
            const records = res.data;
            this.setState({ records });
        })
        .catch(error => console.log(error));
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
 
export default AddPetModal;