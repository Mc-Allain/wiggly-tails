import axios from 'axios';
import React, { Component } from 'react';

class ViewAdmissionModal extends Component {
    state = {
        record:
        {
            id: '',
            admissionId: '',
            title: '',
            content: ''
        },
        errors:
        {
            title: '',
            content: ''
        },
        submitError: false,
        updated: false
    }

    componentDidMount = () => {
        const { admission } = this.props;
        const record = {...this.state.record};

        record.id = admission.id;
        record.admissionId = admission.admissionId;
        record.title = admission.title;
        record.content = admission.content;

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

        value = name === "title" ?
        this.toAbsProperCase(value) :
        this.toSentenceCase(value)

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
            case 'title':
                errors.title=   properLength === 0 ? " " :
                                properLength < 2 || value.length > 24 ?
                                "Must be at between 2 and 24 characters" : ""
                break;

            case 'content':
                errors.content= properLength === 0 ? " " :
                                properLength < 2 || value.length > 128 ?
                                "Must be at between 2 and 128 characters" : ""
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

            record.title = this.removeLastSpace(record.title);
            record.content = this.removeLastSpace(record.content);

            axios.post('http://localhost/reactPhpCrud/veterinaryClinic/updateAdmission.php', record)
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
        const { admission } = this.props;
        const record = {...this.state.record};
        const errors = {...this.state.errors};
        const submitError = false;

        record.id = admission.id;
        record.admissionId = admission.admissionId;
        record.title = admission.title;
        record.content = admission.content;

        errors.title = '';
        errors.content = '';

        this.setState({ record, errors, submitError });
    }

    render() {
        const { record, errors, updated } = this.state;
        const { admission } = this.props;
        return (
            <React.Fragment>
                <div className="modal fade" id={"viewAdmissionModal-" + admission.id} tabIndex="-1" role="dialog"
                    aria-labelledby={"viewAdmissionModalTitle-" + admission.id} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"viewAdmissionModalTitle-" + admission.id}>
                                    View Admission
                                </h5>
                                <button className="btn btn-light text-danger p-1" data-dismiss="modal"
                                onClick={this.onReset}>
                                    <i className="fa fa-window-close fa-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    updated === true ?
                                    <div className="alert alert-success d-flex align-items-center">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Successfully updated.</span>
                                    </div> : null
                                }
                                <form className="row form-light mx-2 p-4" noValidate>
                                    <div className="form-group col-12">
                                        <label className="m-0 ml-2">
                                            Title
                                            <span className="text-danger ml-1">
                                                *<span className="small ml-1">Required</span>
                                            </span>
                                        </label>
                                        <input className={this.inputFieldClasses(errors.title)}
                                        type="text" name="title" value={record.title}
                                        onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.title) }
                                    </div>

                                    <div className="form-group col-12">
                                        <label className="m-0 ml-2">
                                            Content<span className="text-danger ml-1">*</span>
                                        </label>
                                        <textarea className={this.inputFieldClasses(errors.content)}
                                        type="text" name="content" value={record.content} rows="7"
                                        onChange={this.onChangeRecord} noValidate />
                                        { this.renderRecordErrors(errors.content) }
                                    </div>
                                </form>
                                {
                                    updated === true ?
                                    <div className="alert alert-success d-flex align-items-center">
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
 
export default ViewAdmissionModal;