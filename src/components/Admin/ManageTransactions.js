import axios from 'axios';
import React, { Component } from 'react';

import AdminNavbar from "./AdminNavbar.js"
import TransactionsTable from './TransactionsTable.js';
import Footer from '../Footer.js';
import Forbidden from './Forbidden.js';

class ManageTransactions extends Component {
    state = {
        transactions: [],
        searchValue: ""
    }

    componentDidMount() {
        this.getData();
    }

    onRefresh = () => {
        this.getData();
    }

    onSearch = e => {
        const searchValue = e.target.value;
        searchValue.length > 0 ? this.searchData(searchValue) : this.getData()
        this.setState({ searchValue })
    }

    onClear = () => {
        const searchValue = '';
        this.getData();
        this.setState({ searchValue })
    }

    renderContent = () => {
        const { history } = this.props;
        return (
            <React.Fragment>
                <AdminNavbar sourceId={3} activeId={4} history={history} />
                <div className="container-fluid">
                    <div className="min-h-full row bg-light justify-content-center text-dark py-4">
                        <div className="col-12 mt-5 table-responsive">
                            <h3>Manage Transactions</h3>
                            <TransactionsTable transactions={this.state.transactions}
                            onRefresh={this.onRefresh} onSearch={this.onSearch} history={history}
                            searchValue={this.state.searchValue} onClear={this.onClear} />
                            <div className="mt-5">
                                {
                                    this.state.transactions.length === 0 ?
                                    <h1 className="display-5 text-center mb-5">No Record Found</h1> : null
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
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewTransactions.php')
        .then(res => {
            const transactions = res.data;
            this.setState({ transactions });
        })
        .catch(error => console.log(error));
    }

    searchData = searchValue => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/searchTransaction.php?search='+searchValue)
        .then(res => {
            const transactions = res.data;
            this.setState({ transactions });
        })
        .catch(error => console.log(error));
    }
}

export default ManageTransactions;