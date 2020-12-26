import axios from 'axios';
import React, { Component } from 'react';

import AdminNavbar from "./AdminNavbar.js"
import EmployeesTable from './EmployeesTable.js';
import Footer from '../Footer.js';

class ManageEmployees extends Component {
    state = {
        employees: [],
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

    onBackToHome = () => {
        const { history } = this.props;
        const link = "/admin";
        history.replace(link, {verified: true});
    }

    renderForbidden = () => {
        return (
            <div className="container-fluid">
                <div className="row min-h-full justify-content-center align-items-center">
                    <div className="col-10 col-md-8 col-lg-6 form-light">
                        <div className="alert alert-warning text-warning text-center my-3 mx-1 py-4">
                            <div className="d-flex justify-content-center align-items-center">
                                <i className="fa fa-exclamation fa-lg"></i>
                                <span className="ml-2">
                                    <h2 className="font-weight-normal">Forbidden Access</h2>
                                </span>
                            </div>
                            <h5 className="font-weight-light">
                                Please login the Master account first.
                            </h5>
                        </div>
                        <div className="text-center mb-3">
                            <button type="button" className="btn btn-primary btn-lg"
                                onClick={this.onBackToHome}>
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderContent = () => {
        const { history } = this.props;
        const { state } = history.location;
        return (
            <React.Fragment>
                <AdminNavbar sourceId={3} activeId={7} history={this.props.history} />
                <div className="container-fluid">
                    <div className="min-h-full row bg-light justify-content-center text-dark py-4">
                        <div className="col-12 mt-5 table-responsive">
                            <h3>Manage Employees</h3>
                            <EmployeesTable employees={this.state.employees}
                            empType={state.empType} id={state.id}
                            onRefresh={this.onRefresh} onSearch={this.onSearch}
                            searchValue={this.state.searchValue} onClear={this.onClear}
                            connected={this.state.connected} connectionFailed={this.state.connectionFailed}
                            onSubmitForm={this.onSubmitForm} />
                            <div className="mt-5">
                                {
                                    this.state.connected ?
                                    this.state.employees.length === 0 ?
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
                { verified ? this.renderContent() : this.renderForbidden() }
            </React.Fragment>
        );
    }

    getData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewEmployees.php')
        .then(res => {
            const employees = res.data;
            const connected = true;
            this.setState({ employees, connected });
        })
        .catch(error => {
            console.log(error);
            const connectionFailed = true;
            this.setState({ connectionFailed })
        });
    }

    searchData = searchValue => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/searchEmployee.php?search='+searchValue)
        .then(res => {
            const employees = res.data;
            const connected = true;
            this.setState({ employees, connected });
        })
        .catch(error => {
            console.log(error);
            const connectionFailed = true;
            this.setState({ connectionFailed })
        });
    }
}

export default ManageEmployees;