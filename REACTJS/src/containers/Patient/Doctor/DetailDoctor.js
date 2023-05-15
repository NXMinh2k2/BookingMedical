import React, {Component} from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import './DetailDoctor.scss'
import { getDetailInfoDoctor } from "../../../services/userService";
import { languages } from "../../../utils";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfor from "./DoctorExtraInfor";

class DetailDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailDoctor: {},
            currentDoctorId: ''
        }
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            this.setState({
                currentDoctorId: this.props.match.params.id
            })
            
            let res = await getDetailInfoDoctor(this.props.match.params.id)
            if(res && res.errCode === 0) {
                this.setState({
                    detailDoctor: res.data,
                })
            }
        }
    }

    componentDidUpdate() {

    }


    render() {
        let {detailDoctor} = this.state
        let {language} = this.props
        let nameVi = '', nameEn=''
        if(detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`
        }
        
        return (
            <>
                <HomeHeader isShowBanner={false}/>
                <div className="doctor-detail-container">
                    <div className="intro-doctor">
                        <div 
                            className="content-left"
                            style={{backgroundImage: `url(${detailDoctor.image})`}}
                        >
                        </div>
                        <div className="content-right">
                            <div className="up">
                                {language === languages.VI ? nameVi : nameEn}
                            </div>
                            <div className="down">
                                {   detailDoctor && detailDoctor.Markdown
                                    && detailDoctor.Markdown.description
                                    &&
                                    <span>{detailDoctor.Markdown.description}</span>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="schedule-doctor">
                        <div className="content-left">
                            <DoctorSchedule currentDoctorId={this.state.currentDoctorId}/>
                        </div>
                        <div className="content-right">
                            <DoctorExtraInfor currentDoctorId={this.state.currentDoctorId}/>
                        </div>
                    </div>

                    <div className="detail-info-doctor">
                        {   detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML
                            && 
                            <div dangerouslySetInnerHTML={{__html: detailDoctor.Markdown.contentHTML}} >
                            </div>
                        }
                    </div>

                    <div className="comment-doctor"></div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);