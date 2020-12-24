import axios from 'axios';
import React, { Component } from 'react';

import AdminNavbar from "../AdminNavbar.js"
import Footer from '../../Footer.js';

class AddPet extends Component {
    state = {
        pet:
        {
            id: '',
            ownerId: '',
            pccId: '',
            petName: '',
            birthdate: '',
        },
        added: false,
        addedId: '',
        owners: []
    }

    onChangeId = e => {
        const pet = {...this.state.pet};
        pet.id = e.target.value;
        this.setState({ pet });
    }

    onChangeOwnerId = e => {
        const pet = {...this.state.pet};
        pet.ownerId = e.target.value;
        this.setState({ pet });
    }

    onChangePccId = e => {
        const pet = {...this.state.pet};
        pet.pccId = e.target.value;
        this.setState({ pet });
    }

    onChangePetName = e => {
        const pet = {...this.state.pet};
        pet.petName = e.target.value;
        this.setState({ pet });
    }

    onChangeBirthdate = e => {
        const pet = {...this.state.pet};
        pet.birthdate = e.target.value;
        this.setState({ pet });
    }

    onSubmit = e => {
        e.preventDefault();
        let pet = {...this.state.pet};
        console.log(pet);
        axios.post('http://localhost/reactPhpCrud/veterinaryClinic/insertPet.php', pet)
        .then(res => console.log(res.data));

        const addedId = pet.id;
        
        let added = {...this.state.added};
        added = true;

        pet = {...this.state.pet};
        pet.id = '';
        pet.ownerId = '';
        pet.pccId = '';
        pet.petName = '';
        pet.birthdate = '';

        this.setState({ pet, added, addedId });
    }

    componentDidMount() {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewOwners.php')
        .then(res => {
            const owners = res.data;
            this.setState({ owners });
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    render() { 
        const { pet, added, addedId } = this.state;

        return (
            <React.Fragment>
                <AdminNavbar activeId={2}/>
                <div className="container-fluid">
                    <div className="h-full row justify-content-center align-items-center bg-secondary text-light">
                        <div className="col text-center">
                            <h1 className="display-1">Add Pet</h1>
                            <h2 className="font-weight-light">Scroll down to input your credentials.</h2>
                        </div>
                    </div>

                    <div className="h-full row justify-content-center align-items-center bg-warning text-dark">
                        <div className="col-xl-4 col-lg-6 col-md-8 col-sm-10 text-center">
                            <h3 className="display-4 pb-3 mb-3">Add Pet</h3>
                            {
                                added === true ?
                                <div className="alert alert-success d-flex justify-content-evenly align-items-center">
                                    <i className="fa fa-check text-success"></i>
                                    <span>Successfully added.</span>
                                    <a className="alert-link" href="/admin/managepets">{"View '" + addedId + "'"}</a>
                                </div> : null
                            }
                            <form onSubmit={this.onSubmit}>
                                <div className="input-group">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>ID</span>
                                    </div>
                                    <input type="text" className="form-control" maxLength="6" minLength="6"
                                    onChange={this.onChangeId} value={pet.id}
                                    placeholder="Exactly 6 characters" required={true}></input>
                                </div>
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>Owner ID</span>
                                    </div>
                                    <select className="form-control" onChange={this.onChangeOwnerId}
                                    defaultValue="" required>
                                        <option value="" disabled>Please choose an owner</option>
                                        {
                                            this.state.owners.map(owner =>
                                                <option key={owner.id} value={owner.id}>
                                                    {owner.id + " | " + owner.lastName + ", " + owner.firstName}
                                                </option>
                                            )
                                        }
                                    </select>
                                </div>
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>PCC ID</span>
                                    </div>
                                    <input type="text" className="form-control" maxLength="6" minLength="6"
                                    onChange={this.onChangePccId} value={pet.pccId}
                                    placeholder="Exactly 6 characters" required={true}></input>
                                </div>
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>Pet Name</span>
                                    </div>
                                    <input type="text" className="form-control" maxLength="24" minLength="2"
                                    onChange={this.onChangePetName} value={pet.petName}
                                    placeholder="Maximum of 24 characters" required={true}></input>
                                </div>
                                <div className="input-group my-2">
                                    <div className="input-group-text bg-primary text-light">
                                        <span>Birthdate</span>
                                    </div>
                                    <input type="date" className="form-control"
                                    onChange={this.onChangeBirthdate} value={pet.birthdate} required={true}></input>
                                </div>
                                <div className="d-flex justify-content-evenly">
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
            </React.Fragment>
        );
    }
}
 
export default AddPet;