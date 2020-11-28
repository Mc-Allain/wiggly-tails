import ChampionNavbar from "./ChampionNavbar.js";
import Champion from "./Champion.js";

import React, { Component } from 'react';

class Champions extends Component {
    state = {
        navs: [
            {
                id: 1,
                value: "All",
                selected: true
            },
            {
                id: 2,
                value: "Assassin",
                selected: false
            },
            {
                id: 3,
                value: "Fighter",
                selected: false
            },
            {
                id: 4,
                value: "Mage",
                selected: false
            },
            {
                id: 5,
                value: "Marksman",
                selected: false
            },
            {
                id: 6,
                value: "Support",
                selected: false
            },
            {
                id: 7,
                value: "Tank",
                selected: false
            }
        ],
        championClass: "",
    }

    handleNavs = nav => {
        this.offNavs();
        this.selectChampionClass(nav);

        const navs = [...this.state.navs];
        const index = navs.indexOf(nav);
        navs[index] = { ...nav };
        navs[index].selected = true;
        this.setState({ navs });
    }

    render() {
        return (
            <div>
                <ChampionNavbar navs={this.state.navs} handleNavs={this.handleNavs} />
                <ul className="container ch-container">
                    {this.props.champions.filter(champion =>
                        champion.classes.findIndex(championClass =>
                            championClass.startsWith(this.state.championClass)
                        ) >= 0 &&
                        (champion.sold === this.props.sold || this.props.sold === undefined)
                    ).map(champion =>
                        <li key={champion.id}>
                            <Champion champion={champion} handleBuy={this.props.handleBuy} />
                        </li>
                    )}
                </ul>
            </div>
        );
    }

    offNavs = () => {
        const navs = this.state.navs.map(nav => {
            nav.selected = false;
            return nav;
        })
        this.setState({ navs });
    }

    selectChampionClass = (nav) => {
        const championClass = nav.id === 1 ? "" : nav.value;
        this.setState({ championClass });
    }
}

export default Champions;