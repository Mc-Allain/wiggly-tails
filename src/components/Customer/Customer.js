import axios from 'axios';
import React, { Component } from 'react';

import CustomerNavbar from './CustomerNavbar.js';
import UpdateAccountInfoModal from './UpdateAccountInfoModal.js';
import Footer from '../Footer.js';
import Forbidden from './Forbidden.js';

class Customer extends Component {
    state = {
        record:
        {
            id: '',
            lastName: '',
            firstName: '',
            middleName: '',
            lotBlock: '',
            street: '',
            subdivision: '',
            barangay: '',
            municipality: '',
            province: '',
            birthdate: '',
            mobileNumber: '',
            emailAddress: '',
            email: '@yahoo.com',
            userPassword: ''
        },
        connected: false,
        connectionFailed: false,
        records: [],
        customerConnected: false,
        customerConnectionFailed: false
    }

    onSubmitForm = () => {
        const connected = false;
        const connectionFailed = false;
        this.setState({ connected, connectionFailed })
    }

    onRefresh = () => {
        const { history } = this.props;
        const { id } = history.location.state;
        this.searchData(id);
        this.onSubmitForm();
    }

    onClickLink = link => {
        const { history } = this.props;
        history.replace(link, {verified: true, id: history.location.state.id});
    }

    componentDidMount = () => {
        const { record } = this.state;
        try {
            this.onRefresh();
            this.getCustomersData();
        }
        catch(error) { record.id = ''; }
    }

    renderContent = () => {
        const { history } = this.props;
        const { record, connected, connectionFailed } = this.state;
        return(
            <React.Fragment>
                <CustomerNavbar activeId={0} history={history} />
                <div className="container-fluid">
                    <div className="row min-h-full justify-content-center align-items-center pt-5 pt-md-3 pt-xl-0">
                        <div className="col-11 col-sm-10 col-md-8 col-lg-6 form-light my-5">
                            <div className="row mx-2 mt-4">
                                {
                                    connected ?
                                    <React.Fragment>
                                        <div className="col-4 col-sm-3 d-flex justify-content-center align-items-center p-0">
                                            <div className="square-100px bg-warning d-flex justify-content-center align-items-center">
                                                <h4 className="m-0">{record.id}</h4>
                                            </div>
                                        </div>

                                        <div className="col-8 col-sm-9 py-3 pr-1">
                                            <h2 className="mb-0">{record.lastName}</h2>
                                            <h5 className="pl-3 pb-2 bottom-border-light font-weight-normal">
                                                {record.firstName + " " + record.middleName}</h5>
                                        </div>

                                        <div className="col-12 py-3 pl-md-5 pr-1">
                                            <h5 className="mb-1">Home Address</h5>
                                            <h6 className="pl-3 pb-2 bottom-border-light font-weight-normal">
                                                { this.formatHomeAddress(record) }
                                            </h6>
                                        </div>

                                        <div className="col-12 py-3 pl-md-5 pr-1">
                                            <h5 className="mb-1">Birthdate</h5>
                                            <h6 className="pl-3 pb-2 bottom-border-light font-weight-normal">
                                                {this.formatDate(record.birthdate)}
                                            </h6>
                                        </div>

                                        <div className="col-12 col-md-5 col-lg-6 col-xl-5 py-3 pl-md-5 pr-1">
                                            <h5 className="mb-1">Mobile Number</h5>
                                            <h6 className="pl-3 pb-2 bottom-border-light font-weight-normal">
                                                {record.mobileNumber}
                                            </h6>
                                        </div>

                                        <div className="col-12 col-md-7 col-lg-6 col-xl-7 py-3 pr-1">
                                            <h5 className="mb-1">Email Address</h5>
                                            <h6 className="pl-3 pb-2 bottom-border-light font-weight-normal">
                                                {record.emailAddress  + "" + record.email}
                                            </h6>
                                        </div>
                                    </React.Fragment> :
                                    connectionFailed ?
                                    <div className="col-12 text-center mt-3">
                                        <h3 className="text-danger mb-0">Database Connection Failed</h3>
                                        <h5 className="text-danger mb-3">Please try again later.</h5>
                                        <button type="button" className="btn btn-primary" onClick={this.onRefresh}>Retry</button>
                                    </div> :
                                    <div className="col-12 text-center mt-3">
                                        <h3 className="mb-0">Loading Data</h3>
                                        <h5 className="font-weight-normal">Please wait...</h5>
                                    </div>
                                }

                                <div className="d-flex justify-content-end w-100 my-3">
                                    <button className="btn btn-warning w-auto mr-1"
                                        onClick={() => this.onClickLink("/wiggly-tails/customer/view-transactions")}>
                                            <i className="fa fa-exchange-alt"></i>
                                            <span className="d-none d-sm-inline ml-1">Transactions</span>
                                        </button>
                                    <button className="btn btn-secondary w-auto mr-1"
                                    onClick={() => this.onClickLink("/wiggly-tails/customer/manage-pets")}>
                                        <i className="fa fa-cat"></i>
                                        <span className="d-none d-sm-inline ml-1">Pets</span>
                                    </button>
                                    {
                                        connected ?
                                        <button className="btn btn-primary w-auto mr-1"
                                        data-toggle="modal" data-target="#updateAccountInfoModal">
                                            <i className="fa fa-user-edit fa-sm"></i>
                                            <span className="ml-1">Update Info</span>
                                        </button> : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    record.id.length > 0 ?
                    <UpdateAccountInfoModal
                    customer={record}
                    onRefresh={this.onRefresh}
                    records={this.state.records}
                    connected={this.state.customerConnected}
                    connectionFailed={this.state.customerConnectionFailed}
                    onSubmitForm={this.onSubmitForm}
                    retryCustomersData={this.retryCustomersData} /> : null
                }
                <Footer />
            </React.Fragment>
        )
    }

    render() {
        const { history } = this.props;
        let verified = false;
        try { verified = history.location.state.verified; }
        catch(error) { verified = false; }

        return (
            <React.Fragment>
                { verified ? this.renderContent() : <Forbidden history={history} /> }
            </React.Fragment>
        );
    }

    searchData = searchValue => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewAccountInfo.php?search='+searchValue)
        .then(res => {
            let record = res.data;
            const connected = true;
            record = record[0];
            this.setState({ record, connected });
        })
        .catch(error => {
            console.log(error);
            const connectionFailed = true;
            this.setState({ connectionFailed })
        });
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
            const records = res.data;
            const customerConnected = true;
            this.setState({ records, customerConnected });
        })
        .catch(error => {
            console.log(error);
            const customerConnectionFailed = true;
            this.setState({ customerConnectionFailed });
        });
    }

    formatDate = dateValue => {        
        const MMM = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        dateValue = new Date(dateValue);
        const day = dateValue.getDate();
        const month = MMM[dateValue.getMonth()];
        const year = dateValue.getFullYear();

        return year + "-" + month + "-" + day;
    }

    formatHomeAddress = record => {
        let homeAddress = '';
        homeAddress += record.lotBlock.length > 0 ? record.lotBlock + " " : ""
        homeAddress += record.street.length > 0 ? record.street + ", " : ""
        homeAddress += record.subdivision.length > 0 ? record.subdivision + ", " : ""
        homeAddress += record.barangay.length > 0 ? record.barangay + ", " : ""
        homeAddress += record.municipality.length > 0 ? record.municipality : ""
        homeAddress += record.province.length > 0 ? ", " + record.province : ""
        return homeAddress;
    }
}

export default Customer;