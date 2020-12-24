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
        }
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

    onChangeRecord = e => {
        const { name, value } = e.target;
        this.setState(currentState => ({
            ...currentState,
            record: {
                ...currentState.record,
                [name]: value
            }
        }))
    }

    onChangeCheckUp = e => {
        const { name, value } = e.target;
        this.setState(currentState => ({
            ...currentState,
            record: {
                ...currentState.record,
                checkUp : {
                    ...currentState.record.checkUp,
                    [name] : value
                }
            }
        }))
    }

    onChangeGroom = e => {
        const { name, value } = e.target;
        this.setState(currentState => ({
            ...currentState,
            record: {
                ...currentState.record,
                groom : {
                    ...currentState.record.groom,
                    [name] : value
                }
            }
        }))
    }

    render() {
        const { record } = this.state;
        const { transaction } = this.props;
        return (
            <React.Fragment>
                <div className="modal fade" id={"viewTransactionModal-" + transaction.id} tabIndex="-1" role="dialog"
                    aria-labelledby={"viewTransactionModalTitle-" + transaction.id} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"viewTransactionModalTitle-" + transaction.id}>
                                    View Transaction
                                </h5>
                                <button className="btn btn-light text-danger p-1" data-dismiss="modal"
                                onClick={this.onReset}>
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
                                        <label className="m-0 ml-2">Employee Id</label>
                                        <div className="input-group">
                                            <input className="zi-10 form-control"
                                            name="empId" value={record.empId + " | " +
                                            record.empLastName + ", " + record.empFirstName + " " +
                                            record.empMiddleName}
                                            noValidate disabled />
                                        </div>
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Customer Id</label>
                                        <div className="input-group">
                                            <input className="zi-10 form-control"
                                                name="customerId" value={record.customerId + " | " +
                                                record.customerLastName + ", " + record.customerFirstName + " " +
                                                record.customerMiddleName}
                                                noValidate disabled />
                                        </div>
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <label className="m-0 ml-2">Pet Id</label>
                                        <div className="input-group">
                                            <input className="zi-10 form-control"
                                                    name="petId" value={record.petId + " | " + record.petName}
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
                                        onClick={() => this.onViewAdmission("/wiggly-tails-vet/customer/view-admission")}>
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
            admissionId: record.id,
            petName: record.petName,
            transDate: record.transDate
        });
    }

    checkUpForm = () => {
        const { checkUp } = this.state.record;

        return(
            <div className="col-12 sub-form bt-1 mt-3">
                <div className="row mt-3">
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
                </div>
            </div>
        )
    }

    groomForm = () => {
        const { groom } = this.state.record;
        
        return(
            <div className="col-12 sub-form bt-1 mt-3">
                <div className="row mt-3">
                    <div className="form-group col">
                        <label className="m-0 ml-2">Activity</label>
                        <input className="form-control"
                        type="text" name="activity" value={groom.activity} noValidate disabled/>
                    </div>
                </div>
            </div>
        )
    }

    getCheckUpData = id => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewTransactionCheckUp.php?id='+id)
        .then(res => {
            let checkUp = res.data;
            checkUp = checkUp[0];
            this.setState(currentState => ({
                ...currentState,
                record: {
                    ...currentState.record,
                    checkUp
                }
            }))
        })
        .catch(error => console.log(error));
    }

    getGroomData = id => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewTransactionGroom.php?id='+id)
        .then(res => {
            let groom = res.data;
            groom = groom[0];
            this.setState(currentState => ({
                ...currentState,
                record: {
                    ...currentState.record,
                    groom
                }
            }))
        })
        .catch(error => console.log(error));
    }
}
 
export default ViewTransactionModal;