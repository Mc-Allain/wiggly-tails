import React, { Component } from 'react';
import wiggy_tails_icon from '../../img/wiggly-tails-icon.png';

class Navbar extends Component {
    state = {
        navs:
        [
            {
                id: 1,
                text: "Login",
                link: null,
                items: 
                [
                    {
                        id: 2,
                        text: "Customer",
                        link: null
                    },
                    {
                        id: 3,
                        text: "Employee",
                        link: null
                    }
                ]
            },
            {
                id: 10,
                text: "Register",
                link: null,
                items: []
            }
        ]
    }

    render() { 
        const { switchActiveId } = this.props;

        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
                    <a href="/" className="navbar-brand py-0">
                        <img src={wiggy_tails_icon} alt="" className="mr-2" />Veterinary Clinic
                    </a>

                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#main-navbar" aria-controls="main-navbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="main-navbar">
                        <ul className="navbar-nav ml-auto">
                            {
                                this.state.navs.map(nav =>
                                    nav.items.length > 0 ?
                                    <li key={nav.id} className="nav-item dropdown mr-1">
                                        <a className={"dropdown-toggle " + this.linkItemClasses(nav.id)} id={"dropdown" + nav.id}
                                        href="/" data-toggle="dropdown">{nav.text}</a>
                                        <div className="dropdown-menu" aria-labelledby={"dropdown" + nav.id}>
                                            {
                                                nav.items.map(item =>
                                                    <a key={item.id} className={this.dropdownItemClasses(item.id)}
                                                    href={item.link} onClick={() => switchActiveId(item.id)}>{item.text}</a>
                                                )
                                            }
                                        </div>
                                    </li> :
                                    <li key={nav.id} className="nav-item mr-1">
                                        {
                                            nav.id === 10 ?
                                            <a className={this.linkItemClasses(nav.id)}
                                            data-toggle="modal" data-target="#registerModal">
                                                {nav.text}
                                            </a> :
                                            <a href={nav.link} className={this.linkItemClasses(nav.id)}>
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
        id === 10 ?  "text-warning" : "inactive"
        return classes;
    }

    dropdownItemClasses = id => {
        const { activeId } = this.props;

        let classes = "dropdown-item text-dark "
        classes+= id === activeId ? "active-dropdown" : "inactive-dropdown"
        return classes;
    }
}
 
export default Navbar;