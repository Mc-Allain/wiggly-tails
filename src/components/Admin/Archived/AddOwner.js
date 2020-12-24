import axios from 'axios';
import React, { Component } from 'react';

import AdminNavbar from '../AdminNavbar.js';
import Footer from '../../Footer.js';

class AddOwner extends Component {
    state = {
        owner:
        {
            id: '',
            lastName: '',
            firstName: '',
            middleName: '',
            homeAddress: '',
            mobileNumber: '',
            emailAddress: '',
            userPassword: '',
        },
        added: false,
        addedId: ''
    }

    onChangeId = e => {
        const owner = {...this.state.owner};
        owner.id = e.target.value;
        this.setState({ owner });
    }

    onChangeLastName = e => {
        const owner = {...this.state.owner};
        owner.lastName = e.target.value;
        this.setState({ owner });
    }

    onChangeFirstName = e => {
        const owner = {...this.state.owner};
        owner.firstName = e.target.value;
        this.setState({ owner });
    }

    onChangeMiddleName = e => {
        const owner = {...this.state.owner};
        owner.middleName = e.target.value;
        this.setState({ owner });
    }

    onChangeHomeAddress = e => {
        const owner = {...this.state.owner};
        owner.homeAddress = e.target.value;
        this.setState({ owner });
    }

    onChangeMobileNumber = e => {
        const owner = {...this.state.owner};
        owner.mobileNumber = e.target.value;
        this.setState({ owner });
    }

    onChangeEmailAddress = e => {
        const owner = {...this.state.owner};
        owner.emailAddress = e.target.value;
        this.setState({ owner });
    }

    onChangeUserPassword = e => {
        const owner = {...this.state.owner};
        owner.userPassword = e.target.value;
        this.setState({ owner });
    }

    onSubmit = e => {
        e.preventDefault();
        let owner = {...this.state.owner};
        axios.post('http://localhost/reactPhpCrud/veterinaryClinic/insertOwner.php', owner)
        .then(res => console.log(res.data));

        const addedId = owner.id;
        
        let added = {...this.state.added};
        added = true;

        owner = {...this.state.owner};
        owner.id = '';
        owner.lastName = '';
        owner.firstName = '';
        owner.middleName = '';
        owner.homeAddress = '';
        owner.mobileNumber = '';
        owner.emailAddress = '';
        owner.userPassword = '';

        this.setState({ owner, added, addedId });
    }

    onReset = e => {
        e.preventDefault();

        const owner = {...this.state.owner};
        owner.id = '';
        owner.lastName = '';
        owner.firstName = '';
        owner.middleName = '';
        owner.homeAddress = '';
        owner.mobileNumber = '';
        owner.emailAddress = '';
        owner.userPassword = '';

        this.setState({ owner });
    }

    render() { 
        const { owner, added, addedId } = this.state;

        return (
            <React.Fragment>
                <AdminNavbar activeId={1}/>
                <div className="container-fluid">
                    <div className="h-full row justify-content-center align-items-center bg-primary text-light">
                        <div className="col text-center">
                            <h1 className="display-1">Add Customer</h1>
                            <h2 className="font-weight-light">Scroll down to input your credentials.</h2>
                        </div>
                    </div>

                    <div className="h-full row justify-content-center align-items-center bg-warning text-dark">
                        <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 text-center">
                            <h3 className="display-4 mb-3">Add Customer</h3>
                            {
                                added === true ?
                                <div className="alert alert-success d-flex align-items-center">
                                    <i className="fa fa-check text-success mr-2"></i>
                                    <span>Successfully added.</span>
                                    <a className="alert-link ml-auto" href="/admin/manageowners">{"View '" + addedId + "'"}</a>
                                </div> : null
                            }
                            <form onSubmit={this.onSubmit} onReset={this.onReset}>
                                {/* START OF FORM GROUP */}
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>ID</span>
                                    </div>
                                    <input type="text" className="form-control" maxLength="6" minLength="6"
                                    onChange={this.onChangeId} value={owner.id}
                                    placeholder="Exactly 6 characters" required={true}></input>
                                </div>
                                {/* END OF FORM GROUP */}

                                {/* START OF FORM GROUP */}
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>Last Name</span>
                                    </div>
                                    <input type="text" className="form-control" maxLength="24" minLength="2"
                                    onChange={this.onChangeLastName} value={owner.lastName}
                                    placeholder="Maximum of 24 characters" required={true}></input>
                                </div>
                                {/* END OF FORM GROUP */}

                                {/* START OF FORM GROUP */}
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>First Name</span>
                                    </div>
                                    <input type="text" className="form-control" maxLength="24" minLength="2"
                                    onChange={this.onChangeFirstName} value={owner.firstName}
                                    placeholder="Maximum of 24 characters" required={true}></input>
                                </div>
                                {/* END OF FORM GROUP */}

                                {/* START OF FORM GROUP */}
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>Middle Name</span>
                                    </div>
                                    <input type="text" className="form-control" maxLength="24"
                                    onChange={this.onChangeMiddleName} value={owner.middleName}
                                    placeholder="Optional"></input>
                                </div>
                                {/* END OF FORM GROUP */}

                                {/* START OF FORM GROUP */}
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>Home Address</span>
                                    </div>
                                    <input type="text" className="form-control" maxLength="100" minLength="30"
                                    onChange={this.onChangeHomeAddress} value={owner.homeAddress}
                                    placeholder="Lot/Block, Street, Subdivision, Barangay, Municipality, Province"
                                    required={true}></input>
                                </div>
                                {/* END OF FORM GROUP */}

                                {/* START OF FORM GROUP */}
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>Mobile Number</span>
                                    </div>
                                    <input type="tel" className="form-control" maxLength="11" minLength="11"
                                    onChange={this.onChangeMobileNumber} value={owner.mobileNumber} placeholder="09XXXXXXXXX"
                                    required={true}></input>
                                </div>
                                {/* END OF FORM GROUP */}

                                {/* START OF FORM GROUP */}
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>Email Address</span>
                                    </div>
                                    <input type="email" className="form-control" maxLength="40" minLength="9"
                                    onChange={this.onChangeEmailAddress} value={owner.emailAddress}
                                    placeholder="examplename@email.com" required={true}></input>
                                </div>
                                {/* END OF FORM GROUP */}
                                
                                {/* START OF FORM GROUP */}
                                <div className="form-group input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>Password</span>
                                    </div>
                                    <input type="password" className="form-control" maxLength="24" minLength="12"
                                    onChange={this.onChangeUserPassword} value={owner.userPassword}
                                    placeholder="At least 12 characters" required={true}></input>
                                </div>
                                <div className="d-flex justify-content-evenly mt-3">
                                    <button type="submit" className="btn btn-primary w-49">
                                        <i className="fa fa-sign-in-alt"></i>
                                        <span className="ml-1">Submit</span>
                                    </button>
                                    <button type="reset" className="btn btn-danger w-49">
                                        <i className="fa fa-eraser"></i>
                                        <span className="ml-1">Reset</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
                {
                     // owners.map(owner =>
                            //     <tr key={owner.id} className="table-row">
                            //         <td>{owner.lastName + ", " + owner.firstName + " " + owner.middleName}</td>
                            //         <td className="d-none d-md-table-cell">{owner.emailAddress}</td>
                            //         <td className="d-none d-lg-table-cell">{owner.mobileNumber}</td>
                            //         <td className="d-none d-sm-table-cell">{owner.noOfPets}</td>
                            //         <td>
                            //             <button className="btn btn-outline-primary btn-sm mr-1"
                            //                 href="/">
                            //                 <i className="fa fa-eye"></i>
                            //                 <span className="d-none d-sm-inline ml-1">View</span>
                            //             </button>
                            //             <button className="btn btn-outline-primary btn-sm"
                            //                 href="/">
                            //                 <i className="fa fa-pencil-alt"></i>
                            //                 <span className="d-none d-sm-inline ml-1">Transact</span>
                            //             </button>
                            //         </td>
                            //     </tr>
                            // )
                }
            </React.Fragment>
        );
    }
}
 
export default AddOwner;