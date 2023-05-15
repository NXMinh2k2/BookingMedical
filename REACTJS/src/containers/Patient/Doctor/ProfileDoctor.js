import React, {Component} from "react";
import { connect } from "react-redux";
import './ProfileDoctor.scss'
import { FormattedMessage } from "react-intl";
import { getProfileDoctorById } from "../../../services/userService";
import { languages } from "../../../utils";
import _ from "lodash";
import moment from "moment/moment";
import localization from 'moment/locale/vi'
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";

class ProfileDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let data = await this.getInforDoctor(this.props.doctorId)
        this.setState({
            dataProfile: data
        })
    }
    
    async componentDidUpdate(prevProps) {
        if(prevProps.language !== this.props.language) {
        }
        
        if(prevProps.doctorId !== this.props.doctorId) {
            if (this.props.doctorId !== prevProps.doctorId) {
                let data = await this.getInforDoctor(this.props.doctorId);
                this.setState({
                    dataProfile: data,
                });
            }
        }   
    }

    getInforDoctor = async (doctorId) => {
        let result = {}
        if(doctorId) {
            let res = await getProfileDoctorById(doctorId)
            if(res && res.errCode === 0) {
                result = res.data
            }
        }
        return result
    }

    renderTimeBooking = (dataScheduleTimeModal) => {
        let {language} = this.props
        if(dataScheduleTimeModal && !_.isEmpty(dataScheduleTimeModal)) {
            let time = language === languages.VI ? dataScheduleTimeModal.timeTypeData.valueVi : dataScheduleTimeModal.timeTypeData.valueEn
            let date = language === languages.VI ?  
            moment(new Date(+dataScheduleTimeModal.date)).format("dddd - DD/MM/YYYY")
            :
            moment(new Date(+dataScheduleTimeModal.date)).locale('en').format("ddd - MM/DD/YYYY")

            return (
                 <>
                     <div>{time}, {date}</div>
                     <div><FormattedMessage id="patient.booking-modal.priceBooking"/></div>
                 </>
            )
            return <></>
        }
    }

    render() {
        let {dataProfile} = this.state
        let {language, dataScheduleTimeModal, isShowDescriptionDoctor, isShowLinkDetail, isShowPrice} = this.props
        console.log(isShowDescriptionDoctor)
        console.log(dataProfile)
        let nameVi='', nameEn= ''
        if(dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }

        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div 
                        className="content-left"
                        style={{backgroundImage: `url(${dataProfile.image})`}}
                    >
                    </div>
                    <div className="content-right">
                        <div className="up">
                            {language === languages.VI ? nameVi : nameEn}
                        </div>
                        {
                            isShowDescriptionDoctor === true ?
                            <div className="down">
                                {   dataProfile && dataProfile.Markdown
                                    && dataProfile.Markdown.description
                                    &&
                                    <span>{dataProfile.Markdown.description}</span>
                                }
                            </div>
                            :
                            <div>
                                {
                                    this.renderTimeBooking(dataScheduleTimeModal)
                                }
                            </div>
                        }
                    </div>
                </div>
                {
                    isShowLinkDetail === true && 
                    <div className="view-detail-doctor">
                        <Link to={`/detail-doctor/${this.props.doctorId}`}>Xem thêm</Link>
                    </div>
                }
                {
                    isShowPrice === true &&
                    <div className="price">
                        <FormattedMessage id="patient.booking-modal.price" />
                        {
                            dataProfile && dataProfile.Doctor_Infor && language === languages.VI &&
                            <NumberFormat value={dataProfile.Doctor_Infor.priceTypeData.valueVi} thousandSeparator={true} suffix={'VNĐ'} displayType={'text'}/>
                        }
                        {
                            dataProfile && dataProfile.Doctor_Infor && language === languages.EN &&
                            <NumberFormat value={dataProfile.Doctor_Infor.priceTypeData.valueEn} thousandSeparator={true} prefix={'$'} displayType={'text'}/>
                        }
                    </div>
                }
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);