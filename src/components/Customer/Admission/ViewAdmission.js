import axios from 'axios';
import React, { Component } from 'react';

import CustomerNavbar from '../CustomerNavbar.js';
import AdmissionTable from './AdmissionTable.js';
import Footer from '../../Footer.js';
import Forbidden from '../Forbidden.js';

class ViewAdmission extends Component {
    state = {
        admission: [],
        connected: false,
        connectionFailed: false,
        searchValue: ""
    }

    componentDidMount() {
        this.getData();
    }

    onSubmitForm = () => {
        const connected = false;
        const connectionFailed = false;
        this.setState({ connected, connectionFailed })
    }

    onRefresh = () => {
        this.getData();
        const connected = false;
        const connectionFailed = false;
        this.setState({ connected, connectionFailed })
    }

    onSearch = e => {
        const searchValue = e.target.value;
        searchValue.length > 0 ? this.searchData(searchValue) : this.getData()
        const connected = false;
        const connectionFailed = false;
        this.setState({ connected, connectionFailed, searchValue })
    }

    onClear = () => {
        const searchValue = '';
        this.getData();
        const connected = false;
        const connectionFailed = false;
        this.setState({ connected, connectionFailed, searchValue })
    }

    renderContent = () => {
        const { history } = this.props;
        return (
            <React.Fragment>
                <CustomerNavbar activeId={1} history={history} />
                <div className="container-fluid">
                    <div className="min-h-full row bg-light justify-content-center text-dark py-4">
                        <div className="col-12 mt-5 table-responsive">
                            <h3>View Admission</h3>
                            <AdmissionTable admission={this.state.admission} history={history}
                            onRefresh={this.onRefresh} onSearch={this.onSearch}
                            searchValue={this.state.searchValue} onClear={this.onClear}
                            connected={this.state.connected} />
                            <div className="mt-5">
                                {
                                    this.state.connected ?
                                    this.state.admission.length === 0 ?
                                    <h1 className="display-5 text-center mb-5">No Record Found</h1> : null :
                                    this.state.connectionFailed ?
                                    <React.Fragment>
                                        <h1 className="display-5 text-center text-danger">Connection Failed</h1>
                                        <h3 className="font-weight-normal text-center text-danger mb-5">Please try again later.</h3>
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <h1 className="display-5 text-center">Loading Records</h1>
                                        <h3 className="font-weight-normal text-center mb-5">Please wait...</h3>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </div>
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

    getData = () => {
        const { history } = this.props;
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewTransactionAdmission.php?id='+
        history.location.state.transId)
        .then(res => {
            const admission = res.data;
            const connected = true;
            this.setState({ admission, connected });
        })
        .catch(error => {
            console.log(error);
            const connectionFailed = true;
            this.setState({ connectionFailed });
        });
    }

    searchData = searchValue => {
        const { history } = this.props;
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/searchTransactionAdmission.php?id='+
        history.location.state.admissionId+"&search="+searchValue)
        .then(res => {
            const admission = res.data;
            const connected = true;
            this.setState({ admission, connected });
        })
        .catch(error => {
            console.log(error);
            const connectionFailed = true;
            this.setState({ connectionFailed });
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
}

export default ViewAdmission;