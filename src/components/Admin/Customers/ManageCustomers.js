import axios from 'axios';
import React, { Component } from 'react';

import AdminNavbar from "../AdminNavbar.js"
import CustomersTable from './CustomersTable.js';
import Footer from '../../Footer.js';
import Forbidden from '../Forbidden.js';

class ManageCustomers extends Component {
    state = {
        customers: [],
        connected: false,
        connectionFailed: false,
        searchValue: "",
        pets: [],
        petConnected: false,
        petConnectionFailed: false,
        employees: [],
        employeeConnected: false,
        employeeConnectionFailed: false,
    }

    componentDidMount() {
        this.getData();
        this.getPetsData();
        this.getEmployeesData();
    }

    onSubmitForm = () => {
        const connected = false;
        const connectionFailed = false;
        this.setState({ connected, connectionFailed })
    }

    onRefresh = () => {
        this.getData();
        this.onSubmitForm();
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
                    <div className="min-h-full row bg-light justify-content-center text-dark pt-4">
                        <div className="col-12 mt-5">
                            <h3>Manage Customers</h3>
                            <CustomersTable customers={this.state.customers}
                            onRefresh={this.onRefresh} onSearch={this.onSearch}
                            searchValue={this.state.searchValue} onClear={this.onClear}
                            connected={this.state.connected} connectionFailed={this.state.connectionFailed} onSubmitForm={this.onSubmitForm}
                            pets={this.state.pets} retryPetsData={this.retryPetsData}
                            petConnected={this.state.petConnected} petConnectionFailed={this.state.petConnectionFailed}
                            employees={this.state.employees} retryEmployeesData={this.retryEmployeesData}
                            employeeConnected={this.state.employeeConnected} employeeConnectionFailed={this.state.employeeConnectionFailed} />
                            <div className="mt-5">
                                {
                                    this.state.connected ?
                                    this.state.customers.length === 0 ?
                                    <h1 className="display-5 text-center mb-5">No Record Found</h1> : null :
                                    this.state.connectionFailed ?
                                    <div className="text-center">
                                        <h1 className="display-5 text-danger">Database Connection Failed</h1>
                                        <h3 className="font-weight-normal text-danger mb-3">Please try again later.</h3>
                                        <button type="button" className="btn btn-primary btn-lg"
                                        onClick={this.onRefresh}>Retry</button>
                                    </div> :
                                    <React.Fragment>
                                        <h1 className="display-5 text-center">Loading Records</h1>
                                        <h3 className="font-weight-normal text-center">Please wait...</h3>
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

    retryPetsData = () => {
        this.getPetsData();
        const petConnected = false;
        const petConnectionFailed = false;
        this.setState({ petConnected, petConnectionFailed })
    }

    getPetsData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewPets.php')
        .then(res => {
            const pets = res.data;
            const petConnected = true
            this.setState({ pets, petConnected });
        })
        .catch(error => {
            console.log(error);
            const petConnectionFailed = true;
            this.setState({ petConnectionFailed });
        });
    }

    retryEmployeesData = () => {
        this.getEmployeesData();
        const employeeConnected = false;
        const employeeConnectionFailed = false;
        this.setState({ employeeConnected, employeeConnectionFailed })
    }

    getEmployeesData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewEmployees.php')
        .then(res => {
            const employees = res.data;
            const employeeConnected = true
            this.setState({ employees, employeeConnected });
        })
        .catch(error => {
            console.log(error);
            const employeeConnectionFailed = true;
            this.setState({ employeeConnectionFailed });
        });
    }
}

export default ManageCustomers;