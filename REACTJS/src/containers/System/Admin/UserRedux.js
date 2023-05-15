import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { languages, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as actions from "../../../store/actions"
import './UserRedux.scss'
import TableManageUser from './TableManageUser';
class UserRedux extends Component {
    constructor(props) {
        super(props)
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: "",

            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            gender: '',
            address: '',
            position: '',
            role: '',
            avatar: '',

            action: ''
        }
    }

    async componentDidMount() {
        this.props.getGenderStart()
        this.props.getPositionStart()
        this.props.getRoleStart()
    }

    componentDidUpdate(prevProps) {
        if(prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: this.props.genderRedux,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }

        if(prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux
            this.setState({
                positionArr: this.props.positionRedux,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }

        if(prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux
            this.setState({
                roleArr: this.props.roleRedux,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }

        if(prevProps.usersRedux !== this.props.usersRedux) {

            let arrGenders = this.props.genderRedux
            let arrPositions = this.props.positionRedux
            let arrRoles = this.props.roleRedux

           this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '', 
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                avatar: '',
                previewImgURL: '',
                action: CRUD_ACTIONS.CREATE
           })
        }
    }
    
    handleOnChangeImage = async (event) => {
        let data = event.target.files
        let file = data[0]
            
        if(file) {
            let base64 = await CommonUtils.getBase64(file)
            console.log(base64)
            let objectUrl = URL.createObjectURL(file)
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64
            })
        }
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

    onChangeInput = (event, id) => {
        let copyState = {...this.state}
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })     
    }
    
    handleSaveUser = () => {
        let  isValid = this.checkValidateInput()
        let action = this.state.action
        if(action === CRUD_ACTIONS.CREATE) {
            if(isValid == true) {
                this.props.createNewUser({
                    email: this.state.email,
                    password: this.state.password,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    address: this.state.address,
                    phoneNumber: this.state.phoneNumber,
                    gender: this.state.gender,
                    roleId: this.state.role,
                    positionId: this.state.position,
                    avatar: this.state.avatar
                })
            } else {
                return
            }
        }
        if(action === CRUD_ACTIONS.EDIT) {
            this.props.editUser({
                id: this.state.id,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })
        }

    }


    handleEditUserFromParent = (user) => {
        let imageBase64 = ''
        if(user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary')
        }

        this.setState({
            id: user.id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            roleId: user.role,
            positionId: user.position,
            action: CRUD_ACTIONS.EDIT,
            previewImgURL: imageBase64
        })

    }

    render() {
        let {email, password, firstName, lastName, phoneNumber, address,gender, position, role, avatar} = this.state
        let genders = this.state.genderArr
        let positions = this.state.positionArr
        let roles = this.state.roleArr
        let language = this.props.language
        let isLoadingGender = this.props.isLoadingGender

        return (
            <div className="user-redux-container" >
                <div className='title'>
                    Nguyen Xuan Minh
                </div>
                <div>{isLoadingGender === true ? 'Loading genders': ''}</div>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'><FormattedMessage id="manage-user.add"/></div>
                            <div className="col-6">
                                <label><FormattedMessage id="manage-user.email"/></label>
                                <input 
                                    className='form-control' 
                                    type='email'
                                    value={email}
                                    onChange={(event) => this.onChangeInput(event, 'email')}
                                />
                            </div>

                            <div className="col-6">
                                <label><FormattedMessage id="manage-user.password"/></label>
                                <input 
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true: false}
                                    className='form-control' 
                                    type='password'
                                    value={password}
                                    onChange={(event) => this.onChangeInput(event, 'password')}
                                />
                            </div>

                            <div className="col-6">
                                <label><FormattedMessage id="manage-user.first-name"/></label>
                                <input 
                                    className='form-control' 
                                    type='text'
                                    value={firstName}
                                    onChange={(event) => this.onChangeInput(event, 'firstName')}
                                />
                            </div>

                            <div className="col-6">
                                <label><FormattedMessage id="manage-user.last-name"/></label>
                                <input 
                                    className='form-control' 
                                    type='text'
                                    value={lastName}
                                    onChange={(event) => this.onChangeInput(event, 'lastName')}
                                />
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.phone-number"/></label>
                                <input 
                                    className='form-control' 
                                    type='text'
                                    value={phoneNumber}
                                    onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                                />
                            </div>

                            <div className="col-9">
                                <label><FormattedMessage id="manage-user.address"/></label>
                                <input 
                                    className='form-control' 
                                    type='text'
                                    value={address}
                                    onChange={(event) => this.onChangeInput(event, 'address')}
                                />
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.gender"/></label>
                                <select 
                                    value={gender}
                                    className='form-control' 
                                    onChange={(event) => this.onChangeInput(event, 'gender')}
                                >
                                    {
                                        genders && 
                                        genders.length > 0 && 
                                        genders.map((gender, index) => {
                                            return (
                                                <option key={index} value={gender.keyMap}>{language === languages.VI ? gender.valueVi : gender.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.position"/></label>
                                <select 
                                    value={position}
                                    className='form-control'
                                    onChange={(event) => this.onChangeInput(event, 'position')}
                                >
                                    {
                                        positions && 
                                        positions.length > 0 && 
                                        positions.map((position, index) => {
                                            return (
                                                <option key={index} value={position.keyMap}>{language === languages.VI ? position.valueVi : position.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.role"/></label>
                                <select 
                                    value={role}
                                    className='form-control'
                                    onChange={(event) => this.onChangeInput(event, 'role')}
                                >
                                    {
                                        roles && 
                                        roles.length > 0 && 
                                        roles.map((role, index) => {
                                            return (
                                                <option key={index} value={role.keyMap}>{language === languages.VI ? role.valueVi : role.valueEn}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.image"/></label>
                                <div className='preview-img-container'>
                                    <input 
                                        type='file' 
                                        id='previewImg' 
                                        hidden
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    />
                                    <label className='label-upload' htmlFor='previewImg'>Tải ảnh <i class="fa-solid fa-upload"></i></label>
                                    <div 
                                        className='preview-image'
                                        style={{backgroundImage: `url(${this.state.previewImgURL})`}}
                                    >
                                    </div>
                                </div>
                            </div>

                            <div className='col-12'>
                                <button 
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning my-2' : 'btn btn-primary my-2'}
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ?
                                    <FormattedMessage id="manage-user.edit"/>
                                    :
                                    <FormattedMessage id="manage-user.save"/>
                                    }
                                </button>
                            </div>

                            <div className='col-12 mb-5'>
                                <TableManageUser 
                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        usersRedux: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        editUser: (data) => dispatch(actions.editUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
