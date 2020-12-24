import axios from 'axios';
import React, { Component } from 'react';

import AdminNavbar from './AdminNavbar.js';
import AdmissionTable from './AdmissionTable.js';
import Footer from '../Footer.js';
import Forbidden from './Forbidden.js';

class ManageAdmission extends Component {
    state = {
        admission: [],
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
                            <h3>Manage Admission</h3>
                            <AdmissionTable admission={this.state.admission} history={history}
                            onRefresh={this.onRefresh} onSearch={this.onSearch} 
                            searchValue={this.state.searchValue} onClear={this.onClear} />
                            <div className="mt-5">
                                {
                                    this.state.admission.length === 0 ?
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
        const { history } = this.props;
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewTransactionAdmission.php?id='+
        history.location.state.admissionId)
        .then(res => {
            const admission = res.data;
            this.setState({ admission });
        })
        .catch(error => console.log(error));
    }

    searchData = searchValue => {
        const { history } = this.props;
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/searchTransactionAdmission.php?id='+
        history.location.state.admissionId+"&search="+searchValue)
        .then(res => {
            const admission = res.data;
            this.setState({ admission });
        })
        .catch(error => console.log(error));
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

export default ManageAdmission;