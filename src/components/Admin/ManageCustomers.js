import axios from 'axios';
import React, { Component } from 'react';

import AdminNavbar from "./AdminNavbar.js"
import CustomersTable from './CustomersTable.js';
import Footer from '../Footer.js';
import Forbidden from './Forbidden.js';

class ManageCustomers extends Component {
    state = {
        customers: [],
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
                <AdminNavbar sourceId={3} activeId={5} history={history} />
                <div className="container-fluid">
                    <div className="min-h-full row bg-light justify-content-center text-dark py-4">
                        <div className="col-12 mt-5">
                            <h3>Manage Customers</h3>
                            <CustomersTable customers={this.state.customers}
                            onRefresh={this.onRefresh} onSearch={this.onSearch}
                            searchValue={this.state.searchValue} onClear={this.onClear}
                            connected={this.state.connected} connectionFailed={this.state.connectionFailed}
                            onSubmitForm={this.onSubmitForm} />
                            <div className="mt-5">
                                {
                                    this.state.connected ?
                                    this.state.customers.length === 0 ?
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
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewCustomers.php')
        .then(res => {
            const customers = res.data;
            const connected = true;
            this.setState({ customers, connected });
        })
        .catch(error => {
            console.log(error);
            const connectionFailed = true;
            this.setState({ connectionFailed })
        });
    }

    searchData = searchValue => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/searchCustomer.php?search='+searchValue)
        .then(res => {
            const customers = res.data;
            const connected = true;
            this.setState({ customers, connected });
        })
        .catch(error => {
            console.log(error);
            const connectionFailed = true;
            this.setState({ connectionFailed });
        });
    }
}

export default ManageCustomers;