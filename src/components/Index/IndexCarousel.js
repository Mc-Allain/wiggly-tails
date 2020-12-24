import React, { Component } from 'react';

import noImage from '../../img/no-image.png';
// import consultation from '../../img/employees.jpg';
// import treatmentVaccination from '../../img/treatment-vaccination.jpg';
// import confinement from '../../img/confinement.jpg';
// import grooming from '../../img/grooming.jpg';

class IndexCarousel extends Component {
    state = {  }
    render() { 
        return (
            <React.Fragment>
                <div id="index-carousel" className="carousel slide" data-ride='carousel'>
                    <ul className="carousel-indicators">
                        <li data-target="#index-carousel" data-slide-to='0' className="active"></li>
                        <li data-target="#index-carousel" data-slide-to='1'></li>
                        <li data-target="#index-carousel" data-slide-to='2'></li>
                        <li data-target="#index-carousel" data-slide-to='3'></li>
                    </ul>
                    
                    <div className="carousel-inner">
                        <div className="carousel-item bg-dark active">
                            <img className="d-block w-100" src={noImage} alt="consultation" />
                            <div className="carousel-caption d-none d-md-block bg-dark-45">
                                <h5>Consultation</h5>
                                <p>Please suggest a Caption</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={noImage} alt="treatment_vaccination" />
                            <div className="carousel-caption d-none d-md-block bg-dark-45">
                                <h5>Treatment and Vaccination</h5>
                                <p>Please suggest a Caption</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={noImage} alt="confinement" />
                            <div className="carousel-caption d-none d-md-block bg-dark-45">
                                <h5>Confinement</h5>
                                <p>Please suggest a Caption</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={noImage} alt="grooming" />
                            <div className="carousel-caption d-none d-md-block bg-dark-45">
                                <h5>Grooming</h5>
                                <p>Please suggest a Caption</p>
                            </div>
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#index-carousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#index-carousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            </React.Fragment>
        );
    }
}
 
export default IndexCarousel;