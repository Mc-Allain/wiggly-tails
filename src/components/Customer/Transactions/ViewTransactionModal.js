import axios from 'axios';
import React, { Component } from 'react';

class ViewTransactionModal extends Component {
    state = {
        record:
        {
            id: '',
            transType: '',
            transDate: '',
            petId: '',
            petName: '',
            customerId: '',
            customerLastName: '',
            customerFirstName: '',
            customerMiddleName: '',
            customerName: '',
            petWeight: '',
            remarks: '',
            empId: '',
            empLastName: '',
            empFirstName: '',
            empMiddleName: '',
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
        checkUpConnected: false,
        checkUpConnectionFailed: false,
        groomConnected: false,
        groomConnectionFailed: false,
        connected: false
    }

    componentDidMount = () => {
        const { transaction } = this.props;
        if(transaction.transType === 'C') {
            this.getCheckUpData(transaction.id);
        }
        else if(transaction.transType === 'G') {
            this.getGroomData(transaction.id);
        }

        const record = {...this.state.record};
        const checkUp = {...this.state.record.checkUp};
        const groom = {...this.state.record.groom};

        record.id = transaction.id;
        record.transType = transaction.transType;
        record.transDate = transaction.transDate;
        record.petId = transaction.petId;
        record.petName = transaction.petName;
        record.customerId = transaction.customerId;
        record.customerLastName = transaction.lastName;
        record.customerFirstName = transaction.firstName;
        record.customerMiddleName = transaction.middleName;
        record.customerName = transaction.lastName + ", " + transaction.firstName + " " + transaction.middleName;
        record.petWeight = transaction.petWeight;
        record.remarks = transaction.remarks;
        record.empId = transaction.empId;
        record.empLastName = transaction.empLastName;
        record.empFirstName = transaction.empFirstName;
        record.empMiddleName = transaction.empMiddleName;
        record.checkUp = checkUp;
        record.groom = groom;

        this.setState({ record });
    }

    render() {
        const { record } = this.state;
        const { transaction } = this.props;
        return (
            <React.Fragment>
                <div className="modal fade" id={"viewTransactionModal-" + transaction.id}
                    tabIndex="-1" role="dialog" data-backdrop="static"
                    aria-labelledby={"viewTransactionModalTitle-" + transaction.id} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"viewTransactionModalTitle-" + transaction.id}>Transaction Info</h5>
                                <button className="btn btn-light text-danger p-1" data-dismiss="modal">
                                    <i className="fa fa-window-close fa-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="row form-light mx-2 p-4" noValidate>
                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Transaction Date</label>
                                        <input className="form-control"
                                        type="date" name="transDate" value={record.transDate}
                                        noValidate disabled />
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Transaction Type</label>
                                        <input className="zi-10 form-control"
                                            name="transType"
                                            value={ record.transType === 'C' ? "Check-up" : "Groom" }
                                            noValidate disabled />
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Served by</label>
                                        <div className="input-group">
                                            <input className="zi-10 form-control"
                                            name="empId" value={record.empFirstName}
                                            noValidate disabled />
                                        </div>
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Customer Name</label>
                                        <div className="input-group">
                                            <input className="zi-10 form-control"
                                                name="customerId" value={record.customerLastName + ", " +
                                                record.customerFirstName + " " + record.customerMiddleName}
                                                noValidate disabled />
                                        </div>
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Pet Name</label>
                                        <div className="input-group">
                                            <input className="zi-10 form-control"
                                                    name="petId" value={record.petName}
                                                    noValidate disabled />
                                        </div>
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Pet Weight</label>
                                        <div className="input-group">
                                            <input className="form-control"
                                            type="text" name="petWeight" value={record.petWeight}
                                            noValidate disabled />
                                            <div className="input-group-append">
                                                <span className="input-group-text">Kilogram</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group col">
                                        <label className="m-0 ml-2">Remarks</label>
                                        <textarea className="form-control"
                                        type="text" name="remarks" value={record.remarks}
                                        onChange={this.onChangeRecord} rows="2" noValidate disabled />
                                    </div>
                                    {
                                        record.transType === 'C' ?
                                        this.checkUpForm() :
                                        record.transType === 'G' ?
                                        this.groomForm() : null
                                    }
                                </form>
                            </div>

                            <div className="modal-footer">
                                <div className="d-flex justify-content-end w-100">
                                    {
                                        record.transType === 'C' ?
                                        <button className="btn btn-success w-auto mr-1" data-dismiss="modal"
                                        onClick={() => this.onViewAdmission("/wiggly-tails/customer/view-admission")}>
                                            <i className="fa fa-hand-holding-medical fa-sm"></i>
                                            <span className="ml-1">Admissions</span>
                                        </button> : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    onViewAdmission = link => {
        const { record } = this.state;
        const { history } = this.props;
        history.push(link, {
            ...history.location.state,
            transId: record.id,
            petName: record.petName,
            transDate: record.transDate
        });
    }

    checkUpForm = () => {
        const { checkUp } = this.state.record;

        return(
            <div className="col-12 sub-form bt-1 mt-3">
                <div className="row mt-3">
                    {
                        this.state.checkUpConnected ?
                        <React.Fragment>
                            <div className="form-group col-lg-6">
                                <label className="m-0 ml-2">Findings</label>
                                <input className="form-control"
                                type="text" name="findings" value={checkUp.findings}
                                noValidate disabled />
                            </div>

                            <div className="form-group col-lg-6">
                                <label className="m-0 ml-2">Treatment</label>
                                <input className="form-control"
                                type="text" name="treatment" value={checkUp.treatment}
                                noValidate disabled />
                            </div>

                            <div className="form-group col-lg-6">
                                <label className="m-0 ml-2">Admission Date</label>
                                <input className="form-control"
                                type="date" name="admissionDate" value={checkUp.admissionDate}
                                noValidate disabled />
                            </div>

                            <div className="form-group col-lg-6">
                                <label className="m-0 ml-2">Released Date</label>
                                <input className="form-control"
                                type="date" name="releasedDate" value={checkUp.releasedDate} 
                                noValidate disabled />
                            </div>

                            <div className="form-group col">
                                <label className="m-0 ml-2">Additional Information</label>
                                <textarea className="form-control"
                                type="text" name="addInfo" value={checkUp.addInfo}
                                rows="2" noValidate disabled />
                            </div>
                        </React.Fragment> :
                        this.state.checkUpConnectionFailed ?
                        <div className="col-12 text-center text-danger">
                            <h3 className="mb-1">Database Connection Failed</h3>
                            <h5 className="mb-3">Please try again later.</h5>
                            <button type="button" className="btn btn-primary" onClick={this.retryCheckUpData}>Retry</button>
                        </div> :
                        <div className="col-12 text-center">
                            <h3 className="mb-1">Loading Data</h3>
                            <h5>Please wait...</h5>
                        </div>
                    }
                </div>
            </div>
        )
    }

    groomForm = () => {
        const { groom } = this.state.record;
        
        return(
            <div className="col-12 sub-form bt-1 mt-3">
                <div className="row mt-3">
                    {
                        this.state.groomConnected ?
                        <React.Fragment>
                            <div className="form-group col">
                                <label className="m-0 ml-2">Activity</label>
                                <input className="form-control"
                                type="text" name="activity" value={groom.activity} noValidate disabled/>
                            </div>
                        </React.Fragment> :
                        this.state.groomConnectionFailed ?
                        <div className="col-12 text-center text-danger">
                            <h3 className="mb-1">Database Connection Failed</h3>
                            <h5 className="mb-3">Please try again later.</h5>
                            <button type="button" className="btn btn-primary" onClick={this.retryGroomData}>Retry</button>
                        </div> :
                        <div className="col-12 text-center">
                            <h3 className="mb-1">Loading Data</h3>
                            <h5>Please wait...</h5>
                        </div>
                    }
                </div>
            </div>
        )
    }

    retryCheckUpData = () => {
        this.getCheckUpData(this.state.record.id);
        const checkUpConnected = false;
        const checkUpConnectionFailed = false;
        const connected = false;
        this.setState({ checkUpConnected, checkUpConnectionFailed, connected })
    }

    getCheckUpData = id => {
        axios.get('http://princemc.heliohost.us/veterinaryClinic/viewTransactionCheckUp.php?id='+id)
        .then(res => {
            let checkUp = res.data;
            const checkUpConnected = true;
            const connected = true;
            checkUp = checkUp[0];
            this.setState(currentState => ({
                ...currentState,
                record: {
                    ...currentState.record,
                    checkUp
                }, checkUpConnected, connected
            }))
        })
        .catch(error => {
            console.log(error);
            const checkUpConnectionFailed = true;
            this.setState({ checkUpConnectionFailed });
        });
    }

    retryGroomData = () => {
        this.getGroomData(this.state.record.id);
        const groomConnected = false;
        const groomConnectionFailed = false;
        const connected = false;
        this.setState({ groomConnected, groomConnectionFailed, connected })
    }

    getGroomData = id => {
        axios.get('http://princemc.heliohost.us/veterinaryClinic/viewTransactionGroom.php?id='+id)
        .then(res => {
            let groom = res.data;
            const groomConnected = true;
            const connected = true;
            groom = groom[0];
            this.setState(currentState => ({
                ...currentState,
                record: {
                    ...currentState.record,
                    groom
                }, groomConnected, connected
            }))
        })
        .catch(error => {
            console.log(error);
            const groomConnectionFailed = true;
            this.setState({ groomConnectionFailed });
        });
    }
}
 
export default ViewTransactionModal;