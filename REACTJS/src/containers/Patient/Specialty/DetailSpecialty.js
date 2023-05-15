import React, {Component} from "react";
import { connect } from "react-redux";
import './DetailSpecialty.scss'
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import { withRouter } from "react-router";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import { getAllCodeService, getAllDetailSpecialtyById } from "../../../services/userService";
import _ from "lodash";
import { languages } from "../../../utils";

class DetailSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: []
        }
}

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            this.setState({
                currentDoctorId: this.props.match.params.id
            })
            
            let res = await getAllDetailSpecialtyById({
                id: this.props.match.params.id,
                location: 'ALL'
            }) 

            let resProvince = await getAllCodeService("PROVINCE")

            if(res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data
                let arrDoctorId = []
                if(data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty
                    if(arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                let dataProvince = resProvince.data
                if(dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        createdAt: null,
                        keyMap: "ALL",
                        type: "PROVINCE",
                        valueEn: "ALL",                        
                        valueVi: "Toàn quốc"
                    })
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince
                })
            }
        }
    } 

    handleOnChangeSelect = async (e) => {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let location = e.target.value

            let res = await getAllDetailSpecialtyById({
                id: this.props.match.params.id,
                location: location
            }) 

            if(res && res.errCode === 0) {
                let data = res.data
                let arrDoctorId = []
                if(data && !_.isEmpty(data)) {
                    let arr = data.doctorSpecialty
                    if(arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    }

    render() {
        let {arrDoctorId, dataDetailSpecialty, listProvince} = this.state
        return (
            <div className="detail-specialty-container">
              <HomeHeader />
              <div className="detail-specialty-body">
                <div className="description-specialty">
                    {
                        dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty)
                        &&
                        <div dangerouslySetInnerHTML={{__html: dataDetailSpecialty.descriptionHTML}}>
                        </div>
                    }
                </div>
                <div className="search-specialty-doctor">
                    <select onChange={(e) => this.handleOnChangeSelect(e)}>
                        {
                            listProvince && listProvince.length > 0 &&
                            listProvince.map((item, index) => {
                                return (
                                    <option key={index} value={item.keyMap}>
                                        {this.props.language === languages.VI ? item.valueVi : item.valueEn}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
                {
                    arrDoctorId && arrDoctorId.length > 0 &&
                    arrDoctorId.map((item, index) => {
                        return (
                            <div className="each-doctor" key={index}>
                                <div className="dt-content-left">
                                    <div className="profile-doctor">
                                        <ProfileDoctor 
                                            doctorId={item}
                                            isShowDescriptionDoctor={true}
                                            isShowLinkDetail={true}
                                            isShowPrice={false}
                                        />
                                    </div>
                                </div>
                                <div className="dt-content-right">
                                    <div className="doctor-shedule">
                                        <DoctorSchedule currentDoctorId={item}/>
                                    </div>
                                    <div className="doctor-extra-infor">
                                        <DoctorExtraInfor currentDoctorId={item}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty));