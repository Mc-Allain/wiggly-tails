import React, { Component } from 'react';

class Footer extends Component {
    state = {  }
    render() { 
        return (
            <div className="bg-dark text-light w-100 fixed-bottom">
                <p className="m-0 p-0 text-right small my-1 mr-3">
                    Copyright &copy; 2021: Some Rights Reserved</p>
            </div>
        );
    }
}
 
export default Footer;