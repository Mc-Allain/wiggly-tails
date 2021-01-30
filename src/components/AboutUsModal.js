import React, { Component } from 'react';

class AboutUsModal extends Component {
    state = { }

    onVisitFBPage = () => {
        window.open("https://www.facebook.com/wigglytailsvetclinic/");
    }

    render() {
        return (
            <React.Fragment>
                <div className="modal fade" id="aboutUsModal" tabIndex="-1" role="dialog" data-backdrop="static"
                    aria-labelledby="aboutUsModalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="aboutUsModalTitle">About us</h5>
                                <button className="btn btn-light text-danger p-1" data-dismiss="modal">
                                    <i className="fa fa-window-close fa-lg"></i>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row mx-2 mt-4">
                                    <div className="col-12 pr-1">
                                        <h5 className="px-2 text-center">
                                            Dr. Roma Ador Dionisio-Pajarillo's (DVM)
                                            <br />Veterinary Clinic - Wiggly Tails
                                        </h5>
                                        <h6 className="px-3 font-weight-normal">
                                            <span className="ml-4">Here</span> at Wiggly Tails Veterinary Clinic,
                                            we understand the special role of your pet as another part of your family member
                                            and it is our commitment to provide quality care to make them comfortable
                                            and healthy for a lifetime. Our services and facilities are designed for routine preventive care,
                                            early detection and treatment of diseases, emergency and surgical care.
                                        </h6>
                                        <h6 className="px-3 text-center pb-3 bottom-border-light">
                                            <b>Open from Monday to Saturday at 9:00am to 5:00pm</b>
                                        </h6>
                                    </div>

                                    <div className="col-12 pb-3 pl-md-3 pr-1">
                                        <h5 className="mb-3">Offers</h5>
                                        <h6 className="pl-3 bottom-border-light font-weight-normal">
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
                                        <h5 className="mb-3">Clinic Address</h5>
                                        <h6 className="pl-3 font-weight-normal">
                                            Santa Rosa - Tarlac Road, Brgy. Sta Cruz, Zaragoza, Nueva Ecija
                                        </h6>
                                        <div className="row justify-content-center align-items-center bottom-border-light mt-3 pb-3">
                                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3845.67146241087!2d120.8062437152265!3d15.44827345988108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396d98621cad99f%3A0x8fe641df89530131!2sWiggly%20Tails%20Veterinary%20Clinic%20and%20Pet%20Supplies!5e0!3m2!1sen!2sph!4v1610805951302!5m2!1sen!2sph"
                                            allowfullscreen="" aria-hidden="false" tabindex="0" title="clinic-address"
                                            className="col-12 border-0 h-400px" />
                                        </div>
                                    </div>

                                    <div className="col-12 pb-3 pl-md-3 pr-1">
                                        <h5 className="mb-3">Contact Information</h5>
                                        <h6 className="pl-3 bottom-border-light font-weight-normal">
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
                                        <h5 className="mb-3">Developers</h5>
                                        <h6 className="pl-3 bottom-border-light font-weight-normal">
                                            <ul className="list-unstyled list-lh-1">
                                                <li><b>Main Developer: </b>Casindad, Mc Allain Sanchez (BSIT Student)</li>
                                                <li><b>Database Source: </b>Dr. Roma Ador Dionisio-Pajarillo (Veterinary Clinic Owner)</li>
                                                <li><b>Interviewer: </b>Dela Torre, Emmanuel (BSIT Student)</li>
                                                <li className="d-block d-md-flex">
                                                    <b className="mr-2">Others: </b>
                                                    <ul className="list-unstyled list-lh-1">
                                                        <li>Enriquez, Ryan Tonido (BSIT Student)</li>
                                                        <li>Flores, Jaizel Ann Noble (BSIT Student)</li>
                                                        <li>Ruiz, Jehiele Jeff (BSIT Student)</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </h6>
                                    </div>

                                    <div className="col-12 pb-3 pl-md-3 pr-1">
                                        <h5 className="mb-3">Libraries and Frameworks</h5>
                                        <h6 className="pl-3 bottom-border-light font-weight-normal">
                                            <ul className="list-unstyled list-lh-1">
                                                <li><b>Main Language: </b>ReactJS (Javascript Framework)</li>
                                                <li><b>CSS Library: </b>Bootstrap</li>
                                                <li><b>Database: </b>PhpMyAdmin (Php)</li>
                                                <li className="d-block d-md-flex">
                                                    <b className="mr-2">Others: </b>
                                                    <ul className="list-unstyled list-lh-1">
                                                        <li>Font Awesome (Font Icons)</li>
                                                        <li>Axios (API Connector)</li>
                                                        <li>JQuery (Javascript Library)</li>
                                                        <li>Developers' Customized CSS</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </h6>
                                    </div>

                                    <div className="col-12 pb-3 pl-md-3 pr-1">
                                        <h5 className="mb-3">Copyright &copy; 2021: Some Rights Reserved</h5>
                                        <h6 className="px-3 font-weight-normal">
                                            <span className="ml-4">This</span> Website was developed for the purpose of University Project.
                                            Most of the content and data that has been put in this website are not originally ours
                                            but from the owner of the clinic. Owner was interviewed as a reference and source to
                                            meet the expectation of the project's actual function. 
                                        </h6>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-danger w-auto" data-dismiss="modal">
                                    <i className="fa fa-window-close"></i>
                                    <span className="ml-1">Close</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default AboutUsModal;