import React, {Component} from "react";
import { connect } from "react-redux";
import './DetailClinic.scss'
import { FormattedMessage } from "react-intl";
import HomeHeader from "../../HomePage/HomeHeader";
import { withRouter } from "react-router";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import {getAllDetailClinicById} from "../../../services/userService";
import _ from "lodash";
import { languages } from "../../../utils";

class DetailClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
        }
}

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            this.setState({
                currentDoctorId: this.props.match.params.id
            })
            
            let res = await getAllDetailClinicById({
                id: this.props.match.params.id,
            }) 


            if(res && res.errCode === 0) {
                let data = res.data
                let arrDoctorId = []
                if(data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic
                    if(arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,
                })
            }
        }
    } 
    render() {
        let {arrDoctorId, dataDetailClinic} = this.state
        console.log(dataDetailClinic)
        return (
            <div className="detail-specialty-container">
              <HomeHeader />
              <div className="detail-specialty-body">
                <div className="description-specialty">
                    {
                        dataDetailClinic && !_.isEmpty(dataDetailClinic)
                        &&
                        <>
                            <div className="clinic-name">{dataDetailClinic.name}</div>
                            <div className="clinic-address">{dataDetailClinic.address}</div>
                            <div dangerouslySetInnerHTML={{__html: dataDetailClinic.descriptionHTML}}>
                            </div>
                        </>
                    }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailClinic));