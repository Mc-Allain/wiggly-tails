import React, { Component } from 'react';

import AdminNavbar from './AdminNavbar.js';
import ManageEmployeesModal from './Employees/ManageEmployeesModal.js';
import Footer from '../Footer.js';
import Forbidden from './Forbidden.js';

class Admin extends Component {
    state = { }

    onClickLink = link => {
        const { history } = this.props;
        history.replace(link, {verified: true});
    }

    renderContent = () => {
        const { history } = this.props;
        return(
            <React.Fragment>
                <AdminNavbar activeId={0} history={history} />
                <div className="container-fluid">
                    <div className="row min-h-full align-items-center mx-1 py-5">
                        <div className="col">
                            <div className="row mt-5 mb-3">
                                <div className="col-lg-3 col-sm-6 text-center p-2">
                                    <div className="custom-card-light max-h-90 min-h-24 p-3">
                                        <h3 className="mt-3">
                                            Transactions</h3>
                                        <h1 className="display-1 text-primary">
                                            <i className="fa fa-exchange-alt"></i>
                                        </h1>
                                        
                                        <div className="p-3 mt-2 admin-card-content-height h-md-130px h-sm-150px h-lg-200px h-xl-160px">
                                            <h5>Manage transaction records here</h5>
                                            <p>This is where all services offered to a customer are recorded.</p>
                                        </div>

                                        <button className="btn btn-primary border w-75 mt-3"
                                        onClick={() => this.onClickLink("/wiggly-tails/admin/manage-transactions")}>
                                            Manage
                                        </button>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-6 text-center p-2">
                                    <div className="custom-card-light max-h-90 min-h-24 p-3">
                                        <h3 className="mt-3">
                                            Customers</h3>
                                        <h1 className="display-1 text-secondary">
                                            <i className="fa fa-users"></i>
                                        </h1>
                                        
                                        <div className="p-3 mt-2 admin-card-content-height h-md-130px h-sm-150px h-lg-200px h-xl-160px">
                                            <h5>Manage customer records here</h5>
                                            <p>This is where all customer informations are recorded.</p>
                                        </div>

                                        <button className="btn btn-secondary border w-75 mt-3"
                                        onClick={() => this.onClickLink("/wiggly-tails/admin/manage-customers")}>
                                            Manage
                                        </button>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-6 text-center p-2">
                                    <div className="custom-card-light max-h-90 min-h-24 p-3">
                                        <h3 className="mt-3">
                                            Pets</h3>
                                        <h1 className="display-1 text-warning">
                                            <i className="fa fa-cat"></i>
                                        </h1>

                                        <div className="p-3 mt-2 admin-card-content-height h-md-130px h-sm-150px h-lg-200px h-xl-160px">
                                            <h5>Manage pet records here</h5>
                                            <p>This is where all customer's pet informations are recorded.</p>
                                        </div>

                                        <button className="btn btn-warning border w-75 mt-3"
                                        onClick={() => this.onClickLink("/wiggly-tails/admin/manage-pets")}>
                                            Manage
                                        </button>
                                    </div>
                                </div>

                                <div className="col-lg-3 col-sm-6 text-center p-2">
                                    <div className="custom-card-light max-h-90 min-h-24 p-3">
                                        <h3 className="mt-3">
                                            Employees</h3>
                                        <h1 className="display-1 text-danger">
                                            <i className="fa fa-user-md"></i>
                                        </h1>

                                        <div className="p-3 mt-2 admin-card-content-height h-md-130px h-sm-150px h-lg-200px h-xl-160px">
                                            <h5>Manage employee records here</h5>
                                            <p>This is where all employee informations are recorded.</p>
                                        </div>

                                        <button className="btn btn-danger border w-75 mt-3"
                                        data-toggle="modal" data-target="#manageEmployeesModal">
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ManageEmployeesModal history={history} />
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
}

export default Admin;