import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import {handleLoginApi} from '../../services/userService';
import { userLoginSuccess } from '../../store/actions';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '' ,
            errMessage: ''
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState( {
            username: event.target.value,
            errMessage: ''
        })
    }

    handleOnChangePassword = (event) => {
        this.setState( {
            password: event.target.value
        })
    }

    handelLogin = async () => {
        console.log(123)
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLoginApi(this.state.username, this.state.password)
            console.log(data)
            if(data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if(data && data.errCode === 0) {
                console.log('login success')
                this.props.userLoginSuccess(data.user)
            }
        } catch (error) {
            if(error.response) {
                if(error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }

    handleEnter = (event) => {
        if(event.key === 'Enter') {
            this.handelLogin()
        }
    }

    render() {
        return (
           <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-center text-login'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Username: </label>
                            <input 
                                type='text' 
                                placeholder='Enter your username' 
                                className='form-control'
                                value={this.state.username} 
                                onChange={(event) => this.handleOnChangeUsername(event)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password: </label>
                            <input 
                                type='password'
                                placeholder='Enter your password'
                                className='form-control'
                                value={this.state.password} 
                                onChange={(event) => this.handleOnChangePassword(event)}
                                onKeyDown={(event) => this.handleEnter(event)}

                            />
                        </div>
                        <div className='col-12' style={{color: 'red'}}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12'>
                            <button onClick={() => this.handelLogin()} className='btn-login'>Login</button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot your password</span>
                        </div>
                        <div className='col-12 text-center my-3 fw-bold'>
                            <span>Or Login with: </span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fa-brands fa-google-plus-g google"></i>
                            <i class="fa-brands fa-facebook facebook"></i>
                        </div>
                    </div>
                </div>
           </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
