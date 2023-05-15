import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss'
import {getAllUsers, createNewUserService, deleteUserService, editUserService} from '../../services/userService'
import ModalUser from './ModalUser';
import {emitter} from '../../utils/emitter'
import ModalEditUser from './ModalEditUser';

class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrayUsers:  [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
       await this.getAllUsersFromReact()
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    createNewUser = async (data) => {
        try {
            let res = await createNewUserService(data)
            if(res && res.errCode == 0) {
               this.getAllUsersFromReact()
               this.toggleUserModal()
               emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (error) {
            console.log(error)
        }
    }

    getAllUsersFromReact = async () => {
        let res = await getAllUsers('ALL')
        if(res && res.errCode == 0) {
            this.setState({
                arrayUsers: res.users
            })
        }
    }

    handleDeleteUser = async (user) => {
       try {
            let res = await deleteUserService(user.id)
            if(res && res.errCode == 0) {
                this.getAllUsersFromReact()
             }
       } catch (error) {
            console.log(error)
       }
    }

    handleEditUser = (user) => {
        try {
            this.toggleUserEditModal()
            this.setState({
                userEdit: user
            })            
        } catch (error) {
            console.log(error)
        }
    }

    doEditUser = async (user) => {
       try {
            let res = await editUserService(user)
            if(res && res.errCode == 0) {
                this.setState({
                    isOpenModalEditUser: false
                })
                await this.getAllUsersFromReact()
            }
       } catch (error) {
        console.log(error)
       }
}

    render() {
        let arrayUsers = this.state.arrayUsers
        return (
            <div className="users-container">
                <ModalUser 
                    isOpen={this.state.isOpenModalUser}
                    toggleUserModal={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser 
                        isOpen={this.state.isOpenModalEditUser}
                        toggleUserModal={this.toggleUserEditModal}
                        createNewUser={this.createNewUser}
                        userEdit={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className='title text-center'>Manage Users</div>
                <div className='mx-1'>
                    <button 
                        className='btn btn-primary px-3'
                        onClick={() => this.handleAddNewUser()}
                    >
                        Add new users
                        <i class="fa-solid fa-plus mx-2"></i>
                    </button>
                </div>
                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
                        <tr>
                            <th>Email</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                        {
                            arrayUsers && arrayUsers.map((user, index) => {
                                return (
                                    <tr className='divClass' key={index}>
                                        <td>{user.email}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.address}</td>
                                        <td>
                                            <button
                                                onClick={() => this.handleEditUser(user)}
                                            >
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>    
                                            <button
                                                onClick={() => this.handleDeleteUser(user)}
                                            >
                                                <i class="fa-solid fa-trash"></i>
                                            </button>    
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
