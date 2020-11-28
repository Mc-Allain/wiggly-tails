import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
            <div className="navbar">
                <div className="container">
                    <ul>
                        {this.props.navs.map(nav => 
                            <li key={nav.id}>
                                <button
                                className={this.navButtonClasses(nav.id)}
                                onClick={this.props.handleNavs.bind(this, nav)}
                                >
                                    {nav.value}
                                </button>
                                {
                                    nav.value === "Owned Champions" ?
                                    <span className="badge badge-yellow">{this.props.champions.filter(champion =>
                                        champion.sold === true
                                    ).length}</span> : null
                                }
                            </li>    
                        )}
                    </ul>
                </div>
            </div>
        );
    }

    navButtonClasses = navId => {
        let classes = "btn btn-";

        this.props.navs.filter(nav =>
            nav.id === navId
        ).map(nav =>
            classes += nav.selected === true ? "selected " : "default "
        )

        return classes;
    }
}
 
export default Navbar;