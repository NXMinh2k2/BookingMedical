import React, {Component} from "react"
import { connect } from "react-redux"
import './BookingModal.scss'
import { FormattedMessage } from "react-intl";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import ProfileDoctor from "../ProfileDoctor"
import _ from "lodash"
import DatePicker from "../../../../components/Input/DatePicker"
import * as actions from "../../../../store/actions"
import { languages } from "../../../../utils"
import Select from 'react-select'
import {postPatientBookAppointment} from "../../../../services/userService"
import { toast } from "react-toastify";
import moment from "moment";

class BookingModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            doctorId: '',
            genders: '',
            timeType: ''
        }
    }

    componentDidMount() {
        this.props.getGenders()
    }   

    buildDataGender = (data) => {
        let result = []
        let language = this.props.language

        if(data && data.length > 0) {
            data.map(item => {
                let obj = {}
                obj.label = language === languages.VI ? item.valueVi : item.valueEn
                obj.value = item.keyMap
                result.push(obj)
            })
        }
        return result
    }

    componentDidUpdate(prevProps) {
        if(prevProps.genders !== this.props.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if(prevProps.language !== this.props.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if(this.props.dataScheduleTimeModal !== prevProps.dataScheduleTimeModal) {
            if(this.props.dataScheduleTimeModal && !_.isEmpty(this.props.dataScheduleTimeModal)) {
                let doctorId = this.props.dataScheduleTimeModal.doctorId
                let timeType = this.props.dataScheduleTimeModal.timeTypes
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    handleOnchangeInput = (e, id) => {
        let valueInput = e.target.value
        let stateCopy = {...this.state}
        stateCopy[id] = valueInput
        this.setState({
            ...stateCopy
        })
    }

    handleChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        })
    }

    buildTimeBooking = (dataScheduleTimeModal) => {
        let {language} = this.props
        if(dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
            let time = language === languages.VI ? dataScheduleTimeModal.timeTypeData.valueVi : dataScheduleTimeModal.timeTypeData.valueEn
            let date = language === languages.VI ?  
            moment(new Date(+dataScheduleTimeModal.date)).format("dddd - DD/MM/YYYY")
            :
            moment(new Date(+dataScheduleTimeModal.date)).locale('en').format("ddd - MM/DD/YYYY")

            return `${time}, ${date}`
        }
        return ``
    }

    buildDoctorName = (dataScheduleTimeModal) => {
        let {language} = this.props
        if(dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
            let name = language === languages.VI ? 
            `${dataScheduleTimeModal.doctorData.lastName} ${dataScheduleTimeModal.doctorData.firstName}` : 
            `${dataScheduleTimeModal.doctorData.firstName} ${dataScheduleTimeModal.doctorData.lastName}`
        
            return name
        }
        return ``
    }

    handleConfirmBooking = async () => {
        let date = new Date(this.state.birthday).getTime()
        let timeString = this.buildTimeBooking(this.props.dataScheduleTimeModal)
        let doctorName = this.buildDoctorName(this.props.dataScheduleTimeModal)

        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: this.props.dataScheduleTimeModal.date,
            birthday: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })

        if(res && res.errCode === 0) {
            toast.success("Booking a new appointment succeed!")
            this.props.closeBookingModal()
        } else {
            toast.error("Booking a new appointment error!")
        }
    }

    render() {
        let {isOpenModalBooking, closeBookingModal, dataScheduleTimeModal} = this.props
        return (
            <Modal 
                isOpen={isOpenModalBooking} 
                className={'booking-modal-container'}
                size="lg"
                centered
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left"><FormattedMessage id="patient.booking-modal.title" /></span>
                        <span 
                            className="right"
                            onClick={closeBookingModal}
                        >
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="booking-modal-body">
                        <div className="doctor-infor">
                            <ProfileDoctor 
                                doctorId={this.state.doctorId}
                                isShowDescriptionDoctor={false}
                                dataScheduleTimeModal={dataScheduleTimeModal}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>
                        {/* <div className="price">
                            <FormattedMessage id="patient.booking-modal.price" />
                            : 500.000đ
                        </div> */}
                        <div className="row">
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.fullName" /></label>
                                <input 
                                    className="form-control"
                                    value={this.state.fullName}
                                    onChange={(e) => this.handleOnchangeInput(e, 'fullName')} 
                                >
                                </input>
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.phoneNumber" /></label>
                                <input 
                                    className="form-control"
                                    value={this.state.phoneNumber}
                                    onChange={(e) => this.handleOnchangeInput(e, 'phoneNumber')} 
                                ></input>
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                <input 
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={(e) => this.handleOnchangeInput(e, 'email')} 
                                >
                                </input>
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.address" /></label>
                                <input 
                                    className="form-control"
                                    value={this.state.address}
                                    onChange={(e) => this.handleOnchangeInput(e, 'address')}
                                >  
                                </input>
                            </div>
                            <div className="col-12 form-group">
                                <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                                <input 
                                    className="form-control"
                                    value={this.state.reason}
                                    onChange={(e) => this.handleOnchangeInput(e, 'reason')} 
                                >
                                </input>
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.birthday" /></label>
                                <DatePicker 
                                    onChange={this.handleChangeDatePicker}
                                    className="form-control"
                                    value={this.state.birthday}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                <Select 
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                />
                            </div>
                            
                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <Button 
                            className="btn-booking-confirm"
                            onClick={() => this.handleConfirmBooking()}
                        >
                            <FormattedMessage id="patient.booking-modal.btnConfirm" />
                        </Button>
                        <Button 
                            className="btn-booking-cancel"  
                            onClick={closeBookingModal}
                        >
                            <FormattedMessage id="patient.booking-modal.btnCancel" />
                        </Button>
                    </div>
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);