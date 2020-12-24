import axios from 'axios';
import React, { Component } from 'react';

class AddOwnerModal extends Component {
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
            noOfPets: 0
        },
        userConfirmPassword: '',
        validations:
        {
            lastName: 'This field is required.',
            firstName: 'This field is required.',
            homeAddress: 'This field is required.',
            mobileNumber: 'This field is required.',
            emailAddress: 'This field is required.',
            email: '@yahoo.com',
            userPassword: 'This field is required.',
            confirmedPassword: true,
            valid: false
        },
        added: false,
    }

    onChangeId = e => {
        const owner = {...this.state.owner};
        owner.id = e.target.value;
        this.setState({ owner });
    }

    onChangeLastName = e => {
        const owner = {...this.state.owner};
        owner.lastName = e.target.value;

        const validations = {...this.state.validations};
        validations.lastName = owner.lastName.length === 0 ? "This field is required." :
        owner.lastName.length < 2 ? "At least 2 characters are required." : ""

        this.setState({ owner, validations });
    }

    onChangeFirstName = e => {
        const owner = {...this.state.owner};
        owner.firstName = e.target.value;

        const validations = {...this.state.validations};
        validations.firstName = owner.firstName.length === 0 ? "This field is required." :
        owner.firstName.length < 2 ? "At least 2 characters are required." : ""

        this.setState({ owner, validations });
    }

    onChangeMiddleName = e => {
        const owner = {...this.state.owner};
        owner.middleName = e.target.value;
        this.setState({ owner });
    }

    onChangeHomeAddress = e => {
        const owner = {...this.state.owner};
        owner.homeAddress = e.target.value;
        
        const validations = {...this.state.validations};
        validations.homeAddress = owner.homeAddress.length === 0 ? "This field is required." :
        owner.homeAddress.length < 2 ? "At least 2 characters are required." : ""

        this.setState({ owner, validations });
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

    onChangeEmail = e => {
        const validations = {...this.state.validations};
        validations.email = e.target.value;
        this.setState({ validations });
    }

    onChangeUserPassword = e => {
        const owner = {...this.state.owner};
        owner.userPassword = e.target.value;
        this.setState({ owner });
    }

    onChangeUserConfirmPassword = e => {
        let userConfirmPassword = {...this.state.userConfirmPassword};
        userConfirmPassword = e.target.value;
        this.setState({ userConfirmPassword });
    }

    postSubmit = owner => {
        let userConfirmPassword = {...this.state.userConfirmPassword};
        userConfirmPassword = '';

        const validations = {...this.state.validations}
        validations.confirmedPassword = true;
        
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

        this.setState({ owner, userConfirmPassword, validations, added });

        added = false;
        setTimeout(() => this.setState({ added }), 5000);
    }

    onSubmit = e => {
        e.preventDefault();
        
        const { onRefresh } = this.props;
        let owner = {...this.state.owner};
        
        if(owner.userPassword === this.state.userConfirmPassword) {
            owner.emailAddress += this.state.validations.email;
            owner.mobileNumber = "09" + owner.mobileNumber
            
            axios.post('http://localhost/reactPhpCrud/veterinaryClinic/insertOwner.php', owner)
            .then(onRefresh, this.postSubmit(owner));
        }
        else {
            const validations = {...this.state.validations}
            validations.confirmedPassword = false;
            this.setState({ validations })
        }
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
        const { owner, userConfirmPassword, validations, added } = this.state;

        return (
            <React.Fragment>
                <div className="modal fade" id="addOwnerModal" tabIndex="-1" role="dialog" aria-labelledby="addOwnerModalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addOwnerModalTitle">Add Customer</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            
                            
                            <form onSubmit={this.onSubmit} onReset={this.onReset} noValidate>
                                <div className="modal-body">
                                {
                                    added === true ?
                                    <div className="alert alert-success d-flex align-items-center">
                                        <i className="fa fa-check text-success mr-2"></i>
                                        <span>Successfully added.</span>
                                    </div> : null
                                }
                                {
                                    validations.confirmedPassword === false ?
                                    <div className="alert alert-warning d-flex align-items-center">
                                        <i className="fa fa-exclamation text-warning mr-2"></i>
                                        <span>Passwords do not match.</span>
                                    </div> : null
                                }
                                    {/* START OF FORM GROUP */}
                                    <div className="input-group my-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">ID</span>
                                        </div>
                                        <input type="text" className="form-control" maxLength="6"
                                        onChange={this.onChangeId} value={owner.id}></input>
                                    </div>
                                    {/* END OF FORM GROUP */}

                                    {/* START OF FORM GROUP */}
                                    <div className="input-group my-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Last Name</span>
                                        </div>
                                        <input type="text" className="form-control" maxLength="24"
                                        onChange={this.onChangeLastName} value={owner.lastName}></input>
                                    </div>
                                    {/* END OF FORM GROUP */}

                                    {/* START OF FORM GROUP */}
                                    <div className="input-group my-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">First Name</span>
                                        </div>
                                        <input type="text" className="form-control" maxLength="24"
                                        onChange={this.onChangeFirstName} value={owner.firstName}></input>
                                    </div>
                                    {/* END OF FORM GROUP */}

                                    {/* START OF FORM GROUP */}
                                    <div className="input-group my-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Middle Name</span>
                                        </div>
                                        <input type="text" className="form-control" maxLength="24"
                                        onChange={this.onChangeMiddleName} value={owner.middleName}></input>
                                    </div>
                                    {/* END OF FORM GROUP */}

                                    {/* START OF FORM GROUP */}
                                    <div className="input-group my-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Home Address</span>
                                        </div>
                                        <textarea type="text" className="form-control" maxLength="150"
                                        onChange={this.onChangeHomeAddress} value={owner.homeAddress}
                                        placeholder="Lot/Block, Street, Subdivision, Barangay, Municipality, Province"
                                        rows="3"></textarea>
                                    </div>
                                    {/* END OF FORM GROUP */}

                                    {/* START OF FORM GROUP */}
                                    <div className="input-group my-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Mobile Number</span>
                                            <span className="input-group-text">09</span>
                                        </div>
                                        <input type="tel" className="form-control" maxLength="9"
                                        onChange={this.onChangeMobileNumber} value={owner.mobileNumber}></input>
                                    </div>
                                    {/* END OF FORM GROUP */}

                                    {/* START OF FORM GROUP */}
                                    <div className="input-group my-2">
                                        <div className="input-group-prepend d-none d-md-inline">
                                            <span className="input-group-text">Email Address</span>
                                        </div>
                                        <input type="text" className="form-control" maxLength="40"
                                        onChange={this.onChangeEmailAddress} value={owner.emailAddress}></input>
                                        <div className="input-group-append">
                                                <span className="input-group-text">@</span>
                                                <select className="input-group-text" onChange={this.onChangeEmail}>
                                                    <option value="@yahoo.com">yahoo.com</option>
                                                    <option value="@gmail.com">gmail.com</option>
                                                    <option value="@outlook.com">outlook.com</option>
                                                </select>
                                        </div>
                                    </div>
                                    {/* END OF FORM GROUP */}
                                    
                                    {/* START OF FORM GROUP */}
                                    <div className="input-group my-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Password</span>
                                        </div>
                                        <input type="password" className="form-control" maxLength="24"
                                        onChange={this.onChangeUserPassword} value={owner.userPassword}></input>
                                    </div>
                                    {/* END OF FORM GROUP */}

                                    {/* START OF FORM GROUP */}
                                    <div className="input-group my-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Confirm Password</span>
                                        </div>
                                        <input type="password" className="form-control" maxLength="24"
                                        onChange={this.onChangeUserConfirmPassword} value={userConfirmPassword}></input>
                                    </div>
                                    {/* END OF FORM GROUP */}
                                </div>

                                <div className="modal-footer">
                                    <div className="d-flex justify-content-end w-100">
                                        <button type="submit" className="btn btn-primary min-w-130px w-25 mr-1">
                                            <i className="fa fa-sign-in-alt"></i>
                                            <span className="ml-1">Submit</span>
                                        </button>
                                        <button type="reset" className="btn btn-danger min-w-130px w-25">
                                            <i className="fa fa-eraser"></i>
                                            <span className="ml-1">Reset</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default AddOwnerModal;