import axios from 'axios';
import React, { Component } from 'react';

import AdminNavbar from "./AdminNavbar.js"
import PetsTable from './PetsTable.js';
import Footer from '../Footer.js';
import Forbidden from './Forbidden.js';

class ManagePets extends Component {
    state = {
        pets: [],
        customers: [],
        searchValue: ""
    }

    componentDidMount() {        
        this.getData();
    }

    onRefresh = () => {
        this.getData();
    }

    onSearch = e => {
        const searchValue = e.target.value;
        searchValue.length > 0 ? this.searchData(searchValue) : this.getData()
        this.setState({ searchValue })
    }

    onClear = () => {
        const searchValue = '';
        this.getData();
        this.setState({ searchValue })
    }

    renderContent = () => {
        const { history } = this.props;
        return (
            <React.Fragment>
                <AdminNavbar  sourceId={3} activeId={6} history={history} />
                <div className="container-fluid">
                    <div className="min-h-full row bg-light justify-content-center text-dark py-4">
                        <div className="col-12 mt-5 table-responsive">
                            <h3>Manage Pets</h3>
                            <PetsTable pets={this.state.pets}
                            onRefresh={this.onRefresh} onSearch={this.onSearch}
                            searchValue={this.state.searchValue} onClear={this.onClear} />
                            <div className="mt-5">
                                {
                                    this.state.pets.length === 0 ?
                                    <h1 className="display-5 text-center mb-5">No Records Found</h1> : null
                                }
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

    getData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewPets.php')
        .then(res => {
            const pets = res.data;
            this.setState({ pets });
        })
        .catch(error => console.log(error));
    }

    searchData = searchValue => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/searchPet.php?search='+searchValue)
        .then(res => {
            const pets = res.data;
            this.setState({ pets });
        })
        .catch(error => console.log(error));
    }
}
 
export default ManagePets;