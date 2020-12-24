import axios from 'axios';
import React, { Component } from 'react';

class CustomerLoginForm extends Component {
    state = {
        record:
        {
            emailAddress: '',
            email: '',
            userPassword: ''
        },
        records: [],
        errors:
        {
            emailAddress: 'Please input your Email Address',
            userPassword: 'Please input your Password'
        },
        submitError: false,
        loginError: false
    }

    onChangeRecord = e => {
        let { name, value } = e.target;

        if(name === "emailAddress") {
            value = this.removeSpaces(value);
        }

        this.setState(currentState => ({
            ...currentState,
            record: {
                ...currentState.record,
                [name]: value
            }
        }), () => this.onCheckRecordErrors(e))
    }

    onCheckRecordErrors = e => {
        const { name, value } = e.target;
        const errors = {...this.state.errors};

        switch(name){
            case 'emailAddress':
                errors.emailAddress=  value.length === 0 ? "Please input your Email Address" : ""
                break;
            
            case 'userPassword':
                errors.userPassword= value.length === 0 ? "Please input your Password" : ""
                break;

            default:
                break;
        }

        this.setState({ errors });
    }

    onSubmit = e => {
        e.preventDefault();
        const errors  = {...this.state.errors};
        const records = [...this.state.records];
        const record = {...this.state.record};

        if(this.validForm({ errors })) {
            let submitError = false;
            let loginError = false;

            this.setState({ submitError, loginError });

            const result = records.filter(row => 
                (row.emailAddress + row.email).toLowerCase() === (record.emailAddress + record.email).toLowerCase() &&
                row.userPassword === record.userPassword
            )

            if(result.length > 0) {
                const { history } = this.props;
                history.replace('/customer', {verified: true, id: result[0].id});
            }
            else {
                submitError = true;
                loginError = true;
                record.userPassword = '';
                errors.userPassword = 'Please input your Password';
            }

            this.setState({ record, errors, submitError, loginError });
        }
        else {
            const submitError = true;
            this.setState({ submitError });
        }
    }

    validForm = ({ errors }) => {
        let valid = true;
      
        Object.values(errors).forEach(value => {
            value.length > 0 && (valid = false);
        });
      
        return valid;
    }

    renderRecordErrors = errorMsg => {
        if(this.state.submitError) {
            if(errorMsg.length > 0) {
                return(
                    <small className="text-danger ml-2">
                        <i className="fa fa-exclamation text-danger mr-1"></i>
                        {errorMsg}
                    </small>
                )
            }   
        }
    }

    renderLoginError = () => {
        if(this.state.loginError) {
            return(
                <div className="alert alert-danger d-flex align-items-center my-1 py-0">
                    <i className="fa fa-exclamation text-danger mr-2"></i>
                    <span className="lh-0 my-1">Incorrect Email Address or Password</span>
                </div>
            )
        }
    }

    onReset = e => {
        e.preventDefault();
        const record = {...this.state.record};
        record.emailAddress = '';
        record.email = '@yahoo.com';
        record.userPassword = '';

        const errors = {...this.state.errors};
        errors.emailAddress = 'Please input your Email Address';
        errors.userPassword = 'Please input your Password';

        const submitError = false;
        const loginError = false;

        this.setState({ record, errors, submitError, loginError });
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        const { record, errors } = this.state;
        return (
            <form className="form-light p-5 mt-4" noValidate
            onSubmit={this.onSubmit} onReset={this.onReset}>
                <h2 className="font-weight-normal text-center">Customer Login</h2>
                <h5 className="font-weight-light text-center mb-4">
                    Please input your credentials.
                </h5> { this.renderLoginError() }

                <div className="form-group">
                    <label className="m-0 ml-2">Email Address</label>
                    <div className="input-group d-block d-sm-flex px-0">
                        <input className={"w-sm-100 " + this.inputFieldClasses(errors.emailAddress)}
                        type="text" name="emailAddress"  value={record.emailAddress}
                        onChange={this.onChangeRecord} noValidate />
                        <div className="input-group-append justify-content-end">
                            <span className="input-group-text">@</span>
                            <select className="input-group-text"
                            name="email" value={record.email}
                            onChange={this.onChangeRecord} noValidate>
                                <option value="@yahoo.com">yahoo.com</option>
                                <option value="@gmail.com">gmail.com</option>
                                <option value="@outlook.com">outlook.com</option>
                            </select>
                        </div>
                    </div>
                    { this.renderRecordErrors(errors.emailAddress) }
                </div>

                <div className="form-group">
                    <label className="m-0 ml-2">Password</label>
                    <input className={this.inputFieldClasses(errors.userPassword)}
                        type="password" name="userPassword" value={record.userPassword}
                        onChange={this.onChangeRecord} noValidate />
                    { this.renderRecordErrors(errors.userPassword) }
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4">
                    <button type="submit" className="btn btn-primary w-49">
                        <i className="fa fa-sign-in-alt"></i>
                        <span className="ml-1">Login</span>
                    </button>
                    <button type="reset" className="btn btn-danger w-49">
                        <i className="fa fa-eraser"></i>
                        <span className="ml-1">Reset</span>
                    </button>
                </div>
            </form>
        );
    }

    inputFieldClasses = errorMsg => {
        let classes = "form-control ";
        classes+= errorMsg.length > 0 && this.state.submitError ? "border border-danger" : ""
        return classes;
    }

    getData = () => {
        axios.get('http://localhost/reactPhpCrud/veterinaryClinic/viewCustomers.php')
        .then(res => {
            const records = res.data;
            this.setState({ records });
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    removeSpaces = value => {
        let result = "";
        for(var i = 0; i < value.length; i++) {
            if(value.charAt(i) !== " ") {
                result += value.charAt(i);         
            }
        }
        return result;
    }
}
 
export default CustomerLoginForm;