import React, { Component } from 'react';

import Navbar from './Navbar.js';
import IndexCarousel from './IndexCarousel.js';
import CustomerLoginForm from './CustomerLoginForm.js';
import EmployeeLoginForm from './EmployeeLoginForm.js';
import RegisterModal from './RegisterModal.js';
import Footer from '../Footer.js';

class EmployeeLogin extends Component {
    state = { activeId: 2 }

    switchActiveId = id => {
        const activeId = id;
        this.setState({ activeId });
    }

    render() { 
        return (
            <React.Fragment>
                <Navbar activeId={this.state.activeId} sourceId={1} switchActiveId={this.switchActiveId}/>
                <div className="container-fluid">
                    <div className="h-full row bg-warning justify-content-center text-dark">
                        <div className="col-lg-7 d-lg-inline d-none align-self-center">
                            <IndexCarousel />
                        </div>
                        <div className="col-lg-5 bg-light">
                            <div className="row h-full justify-content-center align-items-center">
                                <div className="col-sm-10 col-md-8 col-lg-12">
                                    {
                                        this.state.activeId === 2 ?
                                        <CustomerLoginForm history={this.props.history} /> :
                                        <EmployeeLoginForm history={this.props.history} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <RegisterModal />
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default EmployeeLogin;