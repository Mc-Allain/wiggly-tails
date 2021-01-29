import React, { Component } from 'react';

import consultation from '../../img/consultation.png';
import treatmentVaccination from '../../img/treatment-vaccination.png';
import confinement from '../../img/confinement.png';
import grooming from '../../img/grooming.png';

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
                            <img className="d-block w-100" src={consultation} alt="consultation" />
                            <div className="carousel-caption d-none d-md-block bg-dark-40 px-1 py-2">
                                <h5>Consultation</h5>
                                <p>You will find our veterinarians focusing on preventive measures
                                    to help how to maintain your pet's in great health.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={treatmentVaccination} alt="treatment_vaccination" />
                            <div className="carousel-caption d-none d-md-block bg-dark-40 px-1 py-2">
                                <h5>Treatment and Vaccination</h5>
                                <p>Our preventive care plans include vaccinations,
                                    parasite prevention plans, and wellness screening.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={confinement} alt="confinement" />
                            <div className="carousel-caption d-none d-md-block bg-dark-40 px-1 py-2">
                                <h5>Confinement</h5>
                                <p>We can accommodate pets that needed to be confined for treatment while
                                    recovering from a disease, injury, or elective surgery.</p>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src={grooming} alt="grooming" />
                            <div className="carousel-caption d-none d-md-block bg-dark-40 px-1 py-2">
                                <h5>Grooming</h5>
                                <p>By being regularly groomed, they'll be feeling, smelling,
                                    and looking their best, and of course, the cuddles from their owners
                                    after the grooming session is a win-win.</p>
                            </div>
                        </div>
                    </div>
                    <a className="carousel-control-prev text-dark" href="#index-carousel" role="button" data-slide="prev">
                        <i className="fa fa-arrow-left fa-lg"></i>
                    </a>
                    <a className="carousel-control-next text-dark" href="#index-carousel" role="button" data-slide="next">
                        <i className="fa fa-arrow-right fa-lg"></i>
                    </a>
                </div>
            </React.Fragment>
        );
    }
}
 
export default IndexCarousel;