import React, { Component } from 'react';

class Champion extends Component {
    state = {view: {
            show: false,
            text: "Show"
        }
    }

    handleShow = () => {
        const view = {...this.state.view};
        view.show = !view.show;
        view.text = view.show ? "Hide" : "Show";
        this.setState({ view });
    }

    render() { 
        return (
            <React.Fragment>
                <div className="ch-item">
                    <p>{this.props.champion.name}</p>
                    <div className="ch-btn">
                        {this.props.champion.sold === false ? 
                            <div className="ch-buy">
                                <p>Price: {this.props.champion.price}</p>
                                <button onClick={this.props.handleBuy.bind(this, this.props.champion)}>Buy</button>
                            </div> : null
                        }
                        <button onClick={() => this.handleShow()}>{this.state.view.text}</button>
                    </div>
                </div>
                
                {this.state.view.show === true ?
                    <div className="ch-details">
                        <ul>
                            <p>Skills:</p>
                            {this.props.champion.skills.map(skill =>
                                <li
                                    className={this.getSkillClasses(skill)} key={skill}
                                >{skill}</li>
                            )}
                        </ul>
                    </div> : null
                }
            </React.Fragment>
        );
    }

    getSkillClasses = (skill) => {
        let classes = "ch-skill "
        classes += this.props.champion.skills.indexOf(skill) === 3 ? "ch-ultimate" : ""
        return classes;
    }
}
 
export default Champion;