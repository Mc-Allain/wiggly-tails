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

    onVisitFBPage = () => {
        window.open("https://www.facebook.com/wigglytailsvetclinic/");
    }

    renderContent = () => {
        const { history } = this.props;
        return(
            <React.Fragment>
                <CustomerNavbar activeId={3} history={history} />
                <div className="container-fluid">
                    <div className="row min-h-full justify-content-center align-items-center pt-5 pt-md-3 mt-md-3">
                        <div className="col-11 col-sm-10 col-md-8 col-lg-6 form-light my-5 my-md-5">
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
                                        <b>Open from Monday to Saturday at 9:00am to 5:00pm</b>
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
                                    <h6 className="pl-3 font-weight-light">
                                        Santa Rosa - Tarlac Road, Brgy. Sta Cruz, Zaragoza, Nueva Ecija
                                    </h6>
                                    <div className="row justify-content-center align-items-center bottom-border-light mt-3 pb-3">
                                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3845.67146241087!2d120.8062437152265!3d15.44827345988108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396d98621cad99f%3A0x8fe641df89530131!2sWiggly%20Tails%20Veterinary%20Clinic%20and%20Pet%20Supplies!5e0!3m2!1sen!2sph!4v1610805951302!5m2!1sen!2sph"
                                        allowfullscreen={""} aria-hidden={"false"} tabindex={"0"} title="clinic-address"
                                        className="col-12 border-0 h-400px" />
                                    </div>
                                </div>

                                <div className="col-12 pb-3 pl-md-3 pr-1">
                                    <h5 className="font-weight-normal mb-3">Contact Information</h5>
                                    <h6 className="pl-3 bottom-border-light font-weight-light">
                                        <ul className="list-unstyled list-lh-2">
                                            <li><b>Mobile Number: </b>+63923-119-0591</li>
                                            <li><b>Gmail: </b>wigglytailsvetclinic@gmail.com</li>
                                            <li><b>Facebook: </b>@wigglytailsvetclinic
                                                <button className="btn btn-primary btn-sm p-0 px-1 ml-1"
                                                onClick={this.onVisitFBPage}>Visit</button>
                                            </li>
                                        </ul>
                                    </h6>
                                </div>

                                <div className="col-12 pb-3 pl-md-3 pr-1">
                                    <h5 className="font-weight-normal mb-3">Developers</h5>
                                    <h6 className="pl-3 font-weight-light">
                                        <ul className="list-unstyled list-lh-1">
                                            <li><b>Main Developer: </b>Casindad, Mc Allain Sanchez (BSIT Student)</li>
                                            <li><b>Database Source: </b>Dr. Roma's Veterinary Clinic (Owner)</li>
                                            <li><b>Interviewer: </b>Dela Torre, Emmanuel (BSIT Student)</li>
                                            <li className="d-block d-md-flex">
                                                <b className="mr-2">Others: </b>
                                                <ul className="list-unstyled list-lh-1">
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