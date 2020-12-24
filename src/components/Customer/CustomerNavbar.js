import React, { Component } from 'react';
import wiggy_tails_icon from '../../img/wiggly-tails-icon.png';

class CustomerNavbar extends Component {
    state = {
        navs:
        [
            {
                id: 0,
                text: "Account",
                link: "/wiggly-tails-vet/customer",
                items: []
            },
            {
                id: 1,
                text: "Transactions",
                link: "/wiggly-tails-vet/customer/view-transactions",
                items: [],
            },
            {
                id: 2,
                text: "Pets",
                link: "/wiggly-tails-vet/customer/manage-pets",
                items: [],
            },
            {
                id: 3,
                text: "About us",
                link: "/wiggly-tails-vet/customer/about-us",
                items: [],
            },
            {
                id: 10,
                text: "Sign out",
                link: "/wiggly-tails-vet",
                items: []
            }
        ]
    }

    onClickLink = nav => {
        const { history } = this.props;
        const link = nav.link;
        history.replace(link, {verified: true, id: history.location.state.id});
    }

    onClickBrand = () => {
        const { history } = this.props;
        const link = "/wiggly-tails-vet/customer";
        history.replace(link, {verified: true, id: history.location.state.id});
    }

    onClickSignOut = nav => {
        const { history } = this.props;
        const link = nav.link;
        history.replace(link);
    }


    render() { 
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                    <a onClick={this.onClickBrand} className="navbar-brand py-0">
                        <img src={wiggy_tails_icon} alt="" className="mr-2" />Veterinary Clinic
                    </a>

                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#customer-navbar" aria-controls="customer-navbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="customer-navbar">
                        <ul className="navbar-nav ml-auto">
                            {
                                this.state.navs.map(nav =>
                                    nav.items.length > 0 ?
                                    <li key={nav.id} className="nav-item dropdown mr-1">
                                        <a className={"dropdown-toggle " + this.linkItemClasses(nav.id)} id={"dropdown" + nav.id}
                                        href={nav.link} data-toggle="dropdown">{nav.text}</a>
                                        <div className="dropdown-menu" aria-labelledby={"dropdown" + nav.id}>
                                            {
                                                nav.items.map(item =>
                                                    item.id === 7 ?
                                                    <a key={item.id} className={this.dropdownItemClasses(item.id)}
                                                    data-toggle="modal" data-target="#manageEmployeesModal">
                                                        {item.text}</a> :
                                                    <a key={item.id} className={this.dropdownItemClasses(item.id)}
                                                    onClick={() => this.onClickLink(item)}>{item.text}</a>
                                                    
                                                )
                                            }
                                        </div>
                                    </li> :
                                    <li key={nav.id} className="nav-item mr-1">
                                        {
                                            nav.id === 10 ?
                                            <a onClick={() => this.onClickSignOut(nav)} className={this.linkItemClasses(nav.id)}>
                                                {nav.text}
                                            </a> :
                                            <a onClick={() => this.onClickLink(nav)} className={this.linkItemClasses(nav.id)}>
                                                {nav.text}
                                            </a>
                                        }
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </nav>
            </React.Fragment>
        );
    }

    linkItemClasses = id => {
        const { activeId, sourceId } = this.props;

        let classes = "nav-link ";
        classes+= id === activeId ? "active" :
        id === sourceId ? "active" : 
        id === 10  ? "text-danger" : "inactive"
        return classes;
    }

    dropdownItemClasses = id => {
        const { activeId } = this.props;

        let classes = "dropdown-item "
        classes+= id === 7 ? "text-danger " : "text-dark "
        classes+= id === activeId ? "active-dropdown" : "inactive-dropdown"

        return classes;
    }
}
 
export default CustomerNavbar;