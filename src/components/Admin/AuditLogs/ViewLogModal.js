import React, { Component } from 'react';

class ViewLogModal extends Component {
    state = {
        record:
        {
            id: '',
            timestamp: '',
            activity: ''
        }
    }

    componentDidMount = () => {
        const { log } = this.props;
        const record = {...this.state.record};

        record.id = log.id;
        record.timestamp = log.timestamp;
        record.activity = log.activity;

        this.setState({ record });
    }

    render() {
        const { record } = this.state;
        const { log } = this.props;
        return (
            <React.Fragment>
                <div className="modal fade" id={"viewLogModal-" + log.id}
                    tabIndex="-1" role="dialog" data-backdrop="static"
                    aria-labelledby={"#viewLogModalTitle-" + log.id} aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id={"viewLogModalTitle-" + log.id}>Audit Log Info</h5>
                                <button className="btn btn-light text-danger p-1" data-dismiss="modal">
                                    <i className="fa fa-window-close fa-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="row form-light mx-2 p-4" noValidate>
                                    <div className="form-group col-12">
                                        <label className="m-0 ml-2">Timestamp</label>
                                        <input className="form-control zi-10" type="text"
                                            name="timestamp" value={this.formatDate(record.timestamp)}
                                            noValidate disabled />
                                    </div>

                                    <div className="form-group col-12">
                                        <label className="m-0 ml-2">Activity</label>
                                        <textarea className="form-control zi-10" type="text"
                                            name="activity" value={record.activity} rows="7"
                                            noValidate disabled />
                                    </div>
                                </form>
                            </div>

                            <div className="modal-footer">
                                <div className="d-flex justify-activity-end w-100">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    formatDate = dateValue => {        
        const MMM = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        dateValue = new Date(dateValue+"+00:00");
        const day = dateValue.getDate();
        const month = MMM[dateValue.getMonth()];
        const year = dateValue.getFullYear();

        let time = 'AM';
        let hour = dateValue.getHours();
        if(hour > 12) {
            hour -= 12;
            time = 'PM';
        }
        if(hour < 10) hour = "0" + hour; 
        
        let minute = dateValue.getMinutes();
        if(minute < 10) {
            minute = "0" + minute;
        }

        let second = dateValue.getSeconds();
        if(second < 10) {
            second = "0" + second;
        }

        return year + "-" + month + "-" + day + " | " + hour + ":" + minute + ":" + second + " " + time;
    }
}
 
export default ViewLogModal;