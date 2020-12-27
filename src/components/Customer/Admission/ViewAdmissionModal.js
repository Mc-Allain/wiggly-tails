import React, { Component } from 'react';

class ViewAdmissionModal extends Component {
    state = {
        record:
        {
            id: '',
            transId: '',
            title: '',
            content: ''
        }
    }

    componentDidMount = () => {
        const { admission } = this.props;
        const record = {...this.state.record};

        record.id = admission.id;
        record.transId = admission.transId;
        record.title = admission.title;
        record.content = admission.content;

        this.setState({ record });
    }

    render() {
        const { record } = this.state;
        const { admission } = this.props;
        return (
            <React.Fragment>
                <div className="modal fade" id={"viewAdmissionModal-" + admission.id} tabIndex="-1" role="dialog"
                    aria-labelledby={"viewAdmissionModalTitle-" + admission.id} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"viewAdmissionModalTitle-" + admission.id}>
                                    View Admission
                                </h5>
                                <button className="btn btn-light text-danger p-1" data-dismiss="modal"
                                onClick={this.onReset}>
                                    <i className="fa fa-window-close fa-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="row form-light mx-2 p-4" noValidate>
                                    <div className="form-group col-12">
                                        <label className="m-0 ml-2">Id</label>
                                        <input className="form-control zi-10" type="text"
                                            name="title" value={record.title}
                                            noValidate disabled />
                                    </div>

                                    <div className="form-group col-12">
                                        <label className="m-0 ml-2">Id</label>
                                        <textarea className="form-control zi-10" type="text"
                                            name="content" value={record.content} rows="7"
                                            noValidate disabled />
                                    </div>
                                </form>
                            </div>

                            <div className="modal-footer">
                                <div className="d-flex justify-content-end w-100">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default ViewAdmissionModal;