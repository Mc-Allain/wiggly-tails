import React, { Component } from 'react';

import Navbar from '../Navbar.js';
import IndexCarousel from '../IndexCarousel.js';
import CustomerLoginForm from '../CustomerLoginForm.js';
import Footer from '../../Footer.js';

class CustomerLogin extends Component {
    state = {  }
    render() { 
        return (
            <React.Fragment>
                <Navbar activeId={2} sourceId={1} />
                <div className="container-fluid">
                    <div className="h-full row bg-warning justify-content-center text-dark">
                        <div className="col-md-6 col-lg-8 d-md-inline d-none align-self-center">
                            <IndexCarousel />
                        </div>
                        <div className="col-md-6 col-lg-4 bg-light">
                            <div className="row h-full justify-content-center align-items-center">
                                <div className="col-11 col-sm-8 col-md-11">
                                    <CustomerLoginForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}
 
export default CustomerLogin;