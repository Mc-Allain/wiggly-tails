import React, { Component } from 'react';

import TablePagination from '../../TablePagination';
import AddAdmissionModal from './AddAdmissionModal.js';
import ViewAdmissionModal from './ViewAdmissionModal.js';

class AdmissionTable extends Component {
    state = {
        recordsPerPage: 10,
        recordStartIndex: 0,
        activePage: 1
    }

    renderItems = (admission) => {
        const { recordsPerPage, recordStartIndex } = this.state;
        let items = [];
        const recordStopIndex = admission.length <= recordStartIndex + recordsPerPage ?
        admission.length : recordStartIndex + recordsPerPage

        for(var i = this.state.recordStartIndex; i < recordStopIndex; i++){
            items.push(
                <tr key={admission[i].id} className="table-row">
                    <td>{admission[i].title}</td>
                    <td>{admission[i].content}</td>
                    <td>
                        <button className="btn btn-outline-primary btn-sm mr-1"
                        data-toggle="modal" data-target={"#viewAdmissionModal-" + admission[i].id}>
                            <i className="fa fa-eye"></i>
                            <span className="ml-1">View</span>
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
        const { admission, onRefresh, onSearch, searchValue, onClear, history, connected, connectionFailed, onSubmitForm } = this.props;
        const { recordsPerPage, recordStartIndex, activePage } = this.state;
        const { state } = history.location;
        return (
            <React.Fragment>
                <div className="d-flex mb-2">
                    <button className="btn btn-outline-primary mr-auto"
                    data-toggle="modal" data-target="#addAdmissionModal">
                        <i className="fa fa-plus"></i>
                        <span className="ml-1 d-sm-inline d-none">New</span>
                    </button>
                    <button className="btn btn-warning mr-2 ml-auto" onClick={onRefresh}>
                        <i className="fa fa-sync"></i>
                        <span className="ml-1 d-sm-inline d-none">Refresh</span>
                    </button>
                    <input type="text" className="form-control w-25 min-w-175px"
                    placeholder="Search" onChange={onSearch} value={searchValue}></input>
                    <button className="btn btn-danger ml-2" onClick={onClear}>
                        <i className="fa fa-eraser"></i>
                        <span className="ml-1 d-sm-inline d-none">Clear</span>
                    </button>
                </div>
                
                <table className="table table-bordered">
                    <thead className="thead-dark text-light">
                        <tr>
                            <th colSpan="3">
                                <div className="row align-items-center">
                                    <div className="col-12 col-md-4 text-center mb-2 pb-2
                                    m-md-0 p-md-0 bottom-border-dark border-md-0">
                                        {"Customer Name: " + state.customerName}
                                    </div>
                                    <div className="col-12 col-md-4 text-center mb-2 pb-2
                                    m-md-0 p-md-0 bottom-border-dark border-md-0">
                                        {"Pet Name: " + state.petName}
                                    </div>
                                    <div className="col-12 col-md-4 text-center">
                                        {"Transaction Date: " + state.transDate}
                                    </div>
                                </div>
                            </th>
                        </tr>
                        <tr>
                            <th>Title</th>
                            <th>Content</th>
                            <th className="w-100px">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            admission.length > 0 && connected ?
                            this.renderItems(admission) : null
                        }
                    </tbody>
                </table>
                {
                    admission.length > 0 && connected ?
                    <TablePagination
                    setPage={this.setPage}
                    recordsPerPage={recordsPerPage}
                    recordStartIndex={recordStartIndex}
                    activePage={activePage}
                    totalRecords={admission.length} /> : null
                }
                <AddAdmissionModal history={history} onSubmitForm={onSubmitForm} />
                {
                    admission.map(admission => <ViewAdmissionModal key={admission.id}
                    admission={admission} onRefresh={onRefresh}
                    connected={connected} connectionFailed={connectionFailed}
                    onSubmitForm={onSubmitForm} /> )
                }
            </React.Fragment>
        );
    }
}
 
export default AdmissionTable;