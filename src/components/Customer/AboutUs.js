import React, { Component } from 'react';

import CustomerNavbar from './CustomerNavbar.js';
import Footer from '../Footer.js';
import Forbidden from './Forbidden.js';

class AboutUs extends Component {
    state = { }

    onClickLink = link => {
        const { history } = this.props;
        history.push(link, {verified: true});
    }

    renderContent = () => {
        const { history } = this.props;
        return(
            <React.Fragment>
                <CustomerNavbar activeId={3} history={history} />
                <div className="container-fluid">
                    <div className="row min-h-full justify-content-center align-items-center pt-5 pt-md-3 pt-xl-0">
                        <div className="col-11 col-sm-10 col-md-8 col-lg-6 form-light my-5 my-md-0 mt-md-5">
                            <div className="row mx-2 mt-4">
                                <div className="col-12 pr-1">
                                    <h2 className="mb-3">About us</h2>
                                    <h5 className="px-2 text-center font-weight-light">
                                        Roma Ador Dionisio-Pajarillo's (DVM)
                                        <br />Veterinary Clinic - Wiggly Tails
                                    </h5>
                                    <h6 className="px-3 font-weight-light">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        Quo qui quaerat maxime, dolores nemo soluta reiciendis deleniti
                                        possimus illum temporibus, odio maiores velit inventore architecto!
                                        Aut est maxime quam doloribus!
                                    </h6>
                                    <h6 className="px-3 text-center pb-3 bottom-border-light font-weight-light">
                                        <b>Open from Monday to Saturday at 8:00am to 5:00pm</b>
                                    </h6>
                                </div>

                                <div className="col-12 pb-3 pl-md-3 pr-1">
                                    <h5 className="font-weight-normal mb-3">Offers</h5>
                                    <h6 className="pl-3 bottom-border-light font-weight-light">
                                        <ul className="row">
                                            <li className="col-sm-4 px-0">Consultation</li>
                                            <li className="col-sm-4 px-0">Treatment</li>
                                            <li className="col-sm-4 px-0">Vaccination</li>
                                            <li className="col-sm-4 px-0">Confinement</li>
                                            <li className="col-sm-4 px-0">Grooming</li>
                                        </ul>
                                    </h6>
                                </div>

                                <div className="col-12 pb-3 pl-md-3 pr-1">
                                    <h5 className="font-weight-normal mb-3">Clinic Address</h5>
                                    <h6 className="pl-3 pb-3 bottom-border-light font-weight-light">
                                        Brgy. Sta Cruz, Zaragoza, Nueva Ecija
                                    </h6>
                                </div>

                                <div className="col-12 pb-3 pl-md-3 pr-1">
                                    <h5 className="font-weight-normal mb-3">Contact Information</h5>
                                    <h6 className="pl-3 bottom-border-light font-weight-light">
                                        <ul className="list-unstyled">
                                            <li><b>Mobile Number: </b>+63923-119-0591</li>
                                        </ul>
                                    </h6>
                                </div>

                                <div className="col-12 pb-3 pl-md-3 pr-1">
                                    <h5 className="font-weight-normal mb-3">Developers</h5>
                                    <h6 className="pl-3 font-weight-light">
                                        <ul className="list-unstyled">
                                            <li><b>Main Developer: </b>Casindad, Mc Allain Sanchez (BSIT Student)</li>
                                            <li><b>Database Source: </b>Dr. Roma's Veterinary Clinic (Owner)</li>
                                            <li><b>Interviewer: </b>Dela Torre, Emmanuel (BSIT Student)</li>
                                            <li className="d-block d-md-flex">
                                                <b className="mr-2">Others: </b>
                                                <ul className="list-unstyled">
                                                    <li>Enriquez, Ryan (BSIT Student)</li>
                                                    <li>Flores, Jaizen Ann Noble (BSIT Student)</li>
                                                    <li>Ruiz, Jehiele Jeff (BSIT Student)</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </h6>
                                </div>
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
}

export default AboutUs;