import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { preProcessFile } from 'typescript';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash'
class ModalEditUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        }
    }

    componentDidMount() {
        let user = this.props.userEdit
        if(user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                password: '',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address
            })
        }
    }

    toggle = () => {
        this.props.toggleUserModal()
    }

    handleOnChangeInput = (event, id) => {
        let copyState = {...this.state}
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
        console.log(copyState)
    }

    checkValidateInput = () => {
        let isValid = true
        let arrayInput = ['email', 'password', 'firstName', 'lastName', 'address']
        for(let i=0; i<arrayInput.length; i++) {
            if(!this.state[arrayInput[i]]) {
                isValid = false
                alert('Missing parameter: ' + arrayInput[i])
                break
            }
        }
        return isValid
    }

    handleAddNewUser = () => {
        let  isValid = this.checkValidateInput()
        if(isValid) {
            //call api
            this.props.createNewUser(this.state)
        }
    }

    handleSaveUser = () => {
        let  isValid = this.checkValidateInput()
        if(isValid) {
            //call api
            this.props.editUser(this.state)
        }
    }

    render() {
        return (
            <Modal 
                isOpen={this.props.isOpen} 
                toggle={() => this.toggle()}
                size="lg"
                centered
                className='modal-user-container'
            >
                <ModalHeader toggle={() => this.toggle()}>Edit user</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input 
                                type='text' 
                                onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                value={this.state.email}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Password</label>
                            <input 
                                type='password'
                                onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                value={this.state.password}
                            />
                        </div>
                        <div className='input-container'>
                            <label>First Name</label>
                            <input 
                                type='text' 
                                onChange={(event) => this.handleOnChangeInput(event, 'firstName')}
                                value={this.state.firstName}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Last Name</label>
                            <input 
                                type='text' 
                                onChange={(event) => this.handleOnChangeInput(event, 'lastName')}
                                value={this.state.lastName}
                            />
                        </div>
                        <div className='input-container'>
                            <label>Address</label>
                            <input 
                                type='text' 
                                onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                value={this.state.address}
                            />
                        </div>                    
                    </div>
                </ModalBody>
                <ModalFooter>
                <Button className='px-3' color="primary" onClick={() => this.handleSaveUser()}>
                    Save Change
                </Button>{' '}
                <Button className='px-3' color="secondary" onClick={() => this.toggle()}>
                    Close
                </Button>
                </ModalFooter>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);

