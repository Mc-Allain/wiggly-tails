import React, { Component } from 'react';

import TablePagination from '../TablePagination.js';
import AddCustomerModal from './AddCustomerModal.js';
import ViewCustomerModal from './ViewCustomerModal.js';
import InitiateTransactionModal from './InitiateTransactionModal.js'

class CustomersTable extends Component {
    state = {
        recordsPerPage: 10,
        recordStartIndex: 0,
        activePage: 1
    }

    renderItems = (customers) => {
        const { recordsPerPage, recordStartIndex } = this.state;
        let items = [];
        const recordStopIndex = customers.length <= recordStartIndex + recordsPerPage ?
        customers.length : recordStartIndex + recordsPerPage

        for(var i = this.state.recordStartIndex; i < recordStopIndex; i++){
            items.push(
                <tr key={customers[i].id} className="table-row">
                    <td>{customers[i].lastName + ", " + customers[i].firstName + " " + customers[i].middleName}</td>
                    <td className="d-none d-md-table-cell">{customers[i].emailAddress+customers[i].email}</td>
                    <td className="d-none d-lg-table-cell">{customers[i].mobileNumber}</td>
                    <td className="d-none d-sm-table-cell">{customers[i].noOfPets}</td>
                    <td>
                        <button className="btn btn-outline-primary btn-sm mr-1"
                        data-toggle="modal" data-target={"#viewCustomerModal-" + customers[i].id}>
                            <i className="fa fa-eye"></i>
                            <span className="d-none d-sm-inline ml-1">View</span>
                        </button>
                        <button className="btn btn-outline-primary btn-sm"
                        data-toggle="modal" data-target={"#addTransactionModal-" + customers[i].id}>
                            <i className="fa fa-pencil-alt"></i>
                            <span className="d-none d-sm-inline ml-1">Transact</span>
                        </button>
                    </td>
                </tr>
            )
        }

        return([ items ]);
    }

    setPage = (recordStartIndex, activePage) => {
        this.setState({ recordStartIndex, activePage });
    }

    render() {
        const { customers, onRefresh, onSearch, searchValue, onClear, connected, connectionFailed, onSubmitForm } = this.props;
        const { recordsPerPage, recordStartIndex, activePage } = this.state;
        return (
            <React.Fragment>
                <div className="d-flex mb-2">
                    <button className="btn btn-outline-primary mr-auto"
                    data-toggle="modal" data-target="#addCustomerModal">
                        <i className="fa fa-plus"></i>
                        <span className="ml-1 d-sm-inline d-none">New</span>
                    </button>
                    <button className="btn btn-warning mr-2" onClick={onRefresh}>
                        <i className="fa fa-sync"></i>
                        <span className="ml-1 d-sm-inline d-none">Refresh</span>
                    </button>
                    <input type="text" className="form-control w-25 min-w-175px"
                    placeholder="Search" onChange={onSearch} value={searchValue} ></input>
                    <button className="btn btn-danger ml-2" onClick={onClear}>
                        <i className="fa fa-eraser"></i>
                        <span className="ml-1 d-sm-inline d-none">Clear</span>
                    </button>
                </div>
                
                <table className="table table-bordered">
                    <thead className="thead-dark text-light">
                        <tr>
                            <th className="min-w-170px">Name</th>
                            <th className="d-none d-md-table-cell">Email Address</th>
                            <th className="d-none d-lg-table-cell w-155px">Mobile Number</th>
                            <th className="d-none d-sm-table-cell w-30px">Pets</th>
                            <th className="w-190px min-w-95px">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            customers.length > 0 && connected ?
                            this.renderItems(customers) : null
                        }
                    </tbody>
                </table>
                {
                    customers.length > 0 && connected ?
                    <TablePagination
                    setPage={this.setPage}
                    recordsPerPage={recordsPerPage}
                    recordStartIndex={recordStartIndex}
                    activePage={activePage}
                    totalRecords={customers.length} /> : null
                }
                <AddCustomerModal onRefresh={onRefresh} onSubmitForm={onSubmitForm} />
                { customers.map(customer => 
                    <React.Fragment key={customer.id}>
                        <ViewCustomerModal customer={customer} onRefresh={onRefresh}
                        connected={connected} connectionFailed={connectionFailed} onSubmitForm={onSubmitForm} />
                        <InitiateTransactionModal customer={customer}
                        connected={connected} connectionFailed={connectionFailed} onSubmitForm={onSubmitForm} />
                    </React.Fragment>
                ) }
            </React.Fragment>
        );
    }
}
 
export default CustomersTable;