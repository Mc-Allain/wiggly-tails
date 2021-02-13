import axios from 'axios';
import React, { Component } from 'react';

class ManageEmployeesModal extends Component {
    state = {
        record:
        {
            adminId: '',
            adminPassword: ''
        },
        errors:
        {
            adminId: 'Please input your Admin ID',
            adminPassword: 'Please input your Admin Password'
        },
        records: [],
        connected: false,
        connectionFailed: false,
        submitError: false,
        loginError: false
    }

    onChangeRecord = e => {
        let { name, value } = e.target;

        if(name === "adminId") {
            value = value.toUpperCase();
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

        switch(name){
            case 'adminId':
                errors.adminId=    value.length === 0 ? "Please input your Admin ID" :
                                    value.length !== 6 ? "Must be at exact 6 characters" : ""
                break;

            case 'adminPassword':
                errors.adminPassword=  value.length === 0 ? "Please input your Admin Password" : 
                                        value.length > 24 ? "Must be at maximum of 24 characters" : ""
                break;

            default:
                break;
        }

        this.setState({ errors });
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

    onSubmit = () => {
        const errors  = {...this.state.errors};
        const records = [...this.state.records];
        const record = {...this.state.record};

        if(this.validForm({ errors })) {
            let submitError = false;
            let loginError = false;

            const result = records.filter(row => 
                row.id === record.adminId &&
                row.empPassword === record.adminPassword
            )

            if(result.length > 0) {
                document.getElementById("btnClose").click();
                
                const { history } = this.props;
                history.replace('/wiggly-tails/admin/manage-employees',
                {verified: true, id: result[0].id, empType: result[0].empType});
            }
            else {
                submitError = true;
                loginError = true;
                record.adminPassword = '';
                errors.adminPassword = 'Please input your Admin Password';
            }

            this.setState({ record, errors, submitError, loginError });
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
      
        return valid;
    }

    onReset = () => {
        const record = {...this.state.record};
        const errors = {...this.state.errors};

        const submitError = false;
        const loginError = false;

        record.adminId = '';
        record.adminPassword = '';

        errors.adminId = 'Please input your Admin ID';
        errors.adminPassword = 'Please input your Admin Password';

        this.setState({ record, errors, submitError, loginError});
    }

    handleKeyPress = e => {
        if(e.which === 13) {
            document.getElementById("btnSubmit").click();
        }
    }

    renderLoginError = () => {
        if(this.state.loginError) {
            return(
                <div className="alert alert-danger d-flex align-items-center mb-2 py-0">
                    <i className="fa fa-exclamation text-danger mr-2"></i>
                    <span className="lh-0 my-1">Incorrect Admin ID or Admin Password</span>
                </div>
            )
        }
    }

    renderModal = () => {
        const { record, errors } = this.state;
        return(
            <div className="modal fade" id="manageEmployeesModal"
                tabIndex="-1" role="dialog" data-backdrop="static"
                aria-labelledby="manageEmployeesModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="manageEmployeesModalTitle">Manage Employees</h5>
                            <button id="btnClose" className="btn btn-light text-danger p-1"
                            data-dismiss="modal" onClick={this.onReset}>
                                <i className="fa fa-window-close fa-lg"></i>
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            { this.renderLoginError() }
                            {
                                this.state.connected ?
                                <form className="row form-light mx-2 p-4" noValidate>
                                    <div className="form-group col-12">
                                        <label className="m-0 ml-2">Admin ID</label>
                                        <input className="form-control" type="text"
                                        name="adminId" value={record.adminId} maxLength="6"
                                        onChange={this.onChangeRecord} onKeyPress={this.handleKeyPress}
                                        noValidate />
                                        { this.renderRecordErrors(errors.adminId) }
                                    </div>

                                    <div className="form-group col-12">
                                        <label className="m-0 ml-2">Admin Password</label>
                                        <input className="form-control" type="password"
                                        name="adminPassword" value={record.adminPassword}
                                        onChange={this.onChangeRecord} onKeyPress={this.handleKeyPress}
                                        noValidate />
                                        { this.renderRecordErrors(errors.adminPassword) }
                                    </div>
                                </form> :
                                this.state.connectionFailed ?
                                <div className="col-12 text-center text-danger">
                                    <h3 className="mb-1">Database Connection Failed</h3>
                                    <h5 className="mb-3">Please try again later</h5>
                                    <button type="button" className="btn btn-primary" onClick={this.onRefresh}>Retry</button>
                                </div> :
                                <div className="col-12 text-center">
                                    <h3 className="mb-1">Loading Data</h3>
                                    <h5>Please wait...</h5>
                                </div>
                                
                            }
                        </div>

                        <div className="modal-footer">
                            <div className="d-flex justify-content-end w-100">
                                {
                                    this.state.connected ?
                                    <React.Fragment>
                                        <button className="btn btn-primary w-auto mr-1"
                                        id="btnSubmit" onClick={this.onSubmit}>
                                            <i className="fa fa-sign-in-alt"></i>
                                            <span className="ml-1">Submit</span>
                                        </button>
                                        <button className="btn btn-danger w-auto"
                                        onClick={this.onReset}>
                                            <i className="fa fa-eraser"></i>
                                            <span className="ml-1">Reset</span>
                                        </button>
                                    </React.Fragment> :
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
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <React.Fragment>
                {  this.renderModal() }
            </React.Fragment>
        );
    }

    componentDidMount = () => {
        this.getData();
    }

    onRefresh = () => {
        this.getData();
        const connected = false;
        const connectionFailed = false;
        this.setState({ connected, connectionFailed })
    }

    getData = () => {
        axios.get('http://princemc.heliohost.us/veterinaryClinic/viewAdmins.php')
        .then(res => {
            const records = res.data;
            const connected = true;
            this.setState({ records, connected });
        })
        .catch(error => {
            console.log(error);
            const connectionFailed = true;
            this.setState({ connectionFailed })
        });
    }
}
 
export default ManageEmployeesModal;