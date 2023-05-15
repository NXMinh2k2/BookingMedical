import React, {Component} from "react";
import { connect } from "react-redux";
import './DoctorSchedule.scss'
import { languages } from "../../../utils";
import moment from "moment";
import localization from 'moment/locale/vi'
import {getScheduleDoctorByDate} from '../../../services/userService'
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";

class DoctorSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDays: [],
            allAvailabelTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {}
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    async componentDidMount() {
        let {language} = this.props
        let arrDays = this.getArrDay(language)
        this.setState({
            allDays: arrDays
        })

        if(this.props.currentDoctorId) {
            let res = await getScheduleDoctorByDate(this.props.currentDoctorId, arrDays[0].value)
            this.setState({
                allAvailabelTime: res.data ? res.data : []
            })
        }
        
    }   

    getArrDay = (language) => {
        let arrDays = []
        for(let i=0; i<7; i++) {
            let obj = {}
            if(language === languages.VI){
                if(i==0) {
                    let ddMM = moment(new Date()).format('DD/MM')
                    let today = `Hôm nay - ${ddMM}`
                    obj.label = today

                } else {
                    obj.label = this.capitalizeFirstLetter(moment(new Date()).add(i, 'days').format('dddd - DD/MM'))
                }
            } else {
                if(i==0) {
                    let ddMM = moment(new Date()).format('DD/MM')
                    let today = `Today - ${ddMM}`
                    obj.label = today

                } else {
                    obj.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM')
                }
            }
            obj.value = moment(new Date()).add(i, 'days').startOf('day').valueOf()

            arrDays.push(obj)
        }
        return arrDays
    }

    async componentDidUpdate(prevProps) {
        if(prevProps.language !== this.props.language) {
            let arrDays = this.getArrDay(this.props.language)
            this.setState({
                allDays: arrDays
            })
        }
        if(this.props.currentDoctorId !== prevProps.currentDoctorId) {
            let arrDays = this.getArrDay(this.props.language) 
            let res = await getScheduleDoctorByDate(this.props.currentDoctorId, arrDays[0].value)
            this.setState({
                allAvailabelTime: res.data ? res.data : []
            })
        }
    }

    handleOnChangeSelect = async (e) => {
        if(this.props.currentDoctorId) {
            let doctorId = this.props.currentDoctorId
            let date = e.target.value
            let res = await getScheduleDoctorByDate(doctorId, date)
            if(res && res.errCode === 0) {
                this.setState({
                    allAvailabelTime: res.data
                })
            }
        }
    }

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    render() {
        let {allDays, allAvailabelTime} = this.state
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select onChange={(e) => this.handleOnChangeSelect(e)}>
                            {
                                allDays && 
                                allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option 
                                            value={item.value} 
                                            key={index}
                                        >
                                            {item.label}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="all-availabel-time">
                        <div className="text-calendar">
                            <i class="fa-regular fa-calendar"></i>
                            <span><FormattedMessage id="patient.detail-doctor.schedule"/></span>
                        </div>
                        <div className="time-content">
                            {
                                allAvailabelTime &&
                                allAvailabelTime.length > 0 ?
                                <>
                                    <div className="time-content-btns">
                                        {allAvailabelTime.map((item, index) => {
                                            return (
                                                <button 
                                                    key={index}
                                                    onClick={() => this.handleClickScheduleTime(item)}
                                                >
                                                    {this.props.language === languages.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn}
                                                </button>
                                                )
                                            })
                                        } 
                                    </div>

                                    <div className="book-free">
                                        <span><FormattedMessage id="patient.detail-doctor.choose"/> <i class="fa-solid fa-hand-point-up"></i> <FormattedMessage id="patient.detail-doctor.book-free"/> </span>
                                    </div>
                                </>
                                :
                                <div className="none-schedule"><FormattedMessage id="patient.detail-doctor.no-schedule"/></div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal 
                    isOpenModalBooking={this.state.isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    dataScheduleTimeModal={this.state.dataScheduleTimeModal}
                />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);