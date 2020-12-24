import axios from 'axios';
import React, { Component } from 'react';

import Navbar from '../Navbar.js';
import IndexCarousel from '../IndexCarousel.js';
import EmployeeLoginForm from '../EmployeeLoginForm.js';
import Footer from '../../Footer.js';

class EmployeeLogin extends Component {
    state = {
        employees: []
    }

    componentDidMount() {        
        this.getData();
    }

    render() { 
        return (
            <React.Fragment>
                <Navbar activeId={3} sourceId={1} />
                <div className="container-fluid">
                    <div className="h-full row bg-warning justify-content-center text-dark">
                        <div className="col-md-6 col-lg-8 d-md-inline d-none align-self-center">
                            <IndexCarousel />
                        </div>
                        <div className="col col-sm-4 bg-light">
                            <div className="row h-full justify-content-center align-items-center">
                                <div className="col-11 col-sm-8 col-md-11">
                                    <EmployeeLoginForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }

    getData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewEmployees.php')
        .then(res => {
            const employees = res.data;
            this.setState({ employees });
        })
        .catch(function(error) {
            console.log(error);
        });
    }
}
 
export default EmployeeLogin;