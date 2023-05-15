import React, {Component} from "react";
import { connect } from "react-redux";
import './ManagePatient.scss'
import { FormattedMessage } from "react-intl";
import DatePicker from "../../../components/Input/DatePicker";
import { getAllPatientForDoctor, postSendRemedy } from "../../../services/userService";
import moment from "moment";
import { languages } from "../../../utils";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from 'react-loading-overlay'

class ManagePatient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoaing: false
        }
    }

    async componentDidMount() {
        let formatedDate = moment(this.state.currentDate).startOf('day').valueOf()
        let res = await getAllPatientForDoctor({
            doctorId: this.props.user.id,
            date: formatedDate
        })
        if(res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }   

    handleChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            let formatedDate = moment(this.state.currentDate).startOf('day').valueOf()
            let res = await getAllPatientForDoctor({
                doctorId: this.props.user.id,
                date: formatedDate
            })
            if(res && res.errCode === 0) {
                this.setState({
                    dataPatient: res.data
            })
        }
        })
      };

    handleBtnConfirm = (item) => {
        let data= {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
        })
    }

    sendRemedy = async (dataChild) => {
        let {dataModal} = this.state
        this.setState({
            isShowLoaing: true
        })
        let res = await postSendRemedy({
            email: dataChild.email,
            imageBase64: dataChild.imageBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            patientName: dataModal.patientName,
            language: this.props.language
        })
        if(res && res.errCode === 0) {
            toast.success("Gửi hóa đơn thành công")
            this.setState({
                isShowLoaing: false
            })
            this.closeRemedyModal()
            let formatedDate = moment(this.state.currentDate).startOf('day').valueOf()
            let res = await getAllPatientForDoctor({
                doctorId: this.props.user.id,
                date: formatedDate
            })
            if(res && res.errCode === 0) {
                this.setState({
                    dataPatient: res.data
                })
            }
        } else {
            this.setState({
                isShowLoaing: false
            })
            toast.error("Gửi hóa đơn thất bại")
        }
    }
    
    render() {
        let {dataPatient} = this.state
        let {language} = this.props
        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoaing}
                    spinner
                    text="Loading..."
                >

                    <RemedyModal 
                        isOpenRemedyModal={this.state.isOpenRemedyModal}
                        dataModal={this.state.dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                    <div className="manage-patient-container">
                        <div className="m-p-title">
                            Quản lý bệnh nhân khám bệnh
                        </div>
                        <div className="manage-patient-body row">
                            <div className="col-4 form-group">
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    onChange={this.handleChangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className="col-12 table-manage-patient">
                                <table style={{width: '100%'}}>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thời gian</th>
                                        <th>Họ và Tên</th>
                                        <th>Địa chỉ</th>
                                        <th>Giới tính</th>
                                        <th>Actions</th>
                                    </tr>
                                    {
                                        dataPatient && dataPatient.length > 0 ?
                                        dataPatient.map((item, index) => {
                                            let time = language === languages.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn
                                            let gender = language === languages.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{time}</td>
                                                    <td>{item.patientData.firstName}</td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>{gender}</td>
                                                    <td>
                                                        <button 
                                                            className="btn-confirm"
                                                            onClick={() => this.handleBtnConfirm(item)}
                                                        >
                                                            Xác nhận
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }):
                                        <tr>
                                            <td colSpan={6}>No data</td>
                                        </tr>
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </LoadingOverlay>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);