import React, { Component } from 'react';

class Forbidden extends Component {
    state = {  }

    onBackToLogin = () => {
        const { history } = this.props;
        const link = "/";
        history.replace(link, {verified: true});
    }

    render() { 
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
                                Please login your Employee account first.
                            </h5>
                        </div>
                        <div className="text-center mb-3">
                            <button type="button" className="btn btn-primary btn-lg"
                                onClick={this.onBackToLogin}>
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default Forbidden;