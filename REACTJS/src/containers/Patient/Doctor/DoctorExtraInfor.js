import React, {Component} from "react";
import { connect } from "react-redux";
import './DoctorExtraInfor.scss'
import { languages } from "../../../utils";
import {getExtraInforDoctorById, getScheduleDoctorByDate} from '../../../services/userService'
import { FormattedMessage } from "react-intl";
import NumberFormat from 'react-number-format'

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowDetailInfor: false,
            extraInfor: {}
        }
    }

    async componentDidMount() {
        if(this.props.currentDoctorId) {
            let res = await getExtraInforDoctorById(this.props.currentDoctorId)
            if(res && res.errCode === 0 )
            this.setState({
                extraInfor: res.data
            })
        }
    }   

    async componentDidUpdate(prevProps) {
        if(this.props.currentDoctorId !== prevProps.currentDoctorId) {
            let res = await getExtraInforDoctorById(this.props.currentDoctorId)
            if(res && res.errCode === 0 )
            console.log(res)
            this.setState({
                extraInfor: res.data
            })
        }
    }

    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status
        })
    }

    render() {
        let {isShowDetailInfor, extraInfor} = this.state
        return (
            <div className="doctor-extra-infor-container">
                <div className="content-up">
                    <div className="text-address"><FormattedMessage id="patient.extra-infor-doctor.text-address"/></div>
                    <div className="name-clinic">{extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}</div>
                    <div className="detail-address">{extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}</div>
                </div>
                <div className="content-down">
                    
                    {
                        isShowDetailInfor === false ?
                        <div className="short-infor"> 
                            <FormattedMessage id="patient.extra-infor-doctor.price"/>
                            {
                               extraInfor && extraInfor.priceTypeData && this.props.language === languages.VI &&
                                <NumberFormat value={extraInfor.priceTypeData.valueVi} thousandSeparator={true} suffix={'VNĐ'} displayType={'text'}/>
                            }
                            {
                               extraInfor && extraInfor.priceTypeData && this.props.language === languages.EN &&
                                <NumberFormat value={extraInfor.priceTypeData.valueEn} thousandSeparator={true} prefix={'$'} displayType={'text'}/>
                            }
                            <span onClick={() => this.showHideDetailInfor(true)}><FormattedMessage id="patient.extra-infor-doctor.detail"/></span>
                        </div>
                        :
                        <>
                            <div className="title-price">
                                <FormattedMessage id="patient.extra-infor-doctor.price"/>
                            </div>
                            <div className="detail-infor">
                                <div className="price">
                                    <div className="left"><FormattedMessage id="patient.extra-infor-doctor.price"/></div>
                                    <div className="right">
                                        {
                                        extraInfor && extraInfor.priceTypeData && this.props.language === languages.VI &&
                                            <NumberFormat value={extraInfor.priceTypeData.valueVi} thousandSeparator={true} suffix={'VNĐ'} displayType={'text'}/>
                                        }
                                        {
                                        extraInfor && extraInfor.priceTypeData && this.props.language === languages.EN &&
                                            <NumberFormat value={extraInfor.priceTypeData.valueEn} thousandSeparator={true} prefix={'$'} displayType={'text'}/>
                                        }
                                    </div>
                                </div>
                                <div className="note">{extraInfor && extraInfor.note ? extraInfor.note : ''}</div>
                            </div>
                            <div className="payment"><FormattedMessage id="patient.extra-infor-doctor.payment"/>:  
                                {
                                    extraInfor && extraInfor.paymentTypeData && this.props.language === languages.VI &&
                                    extraInfor.paymentTypeData.valueVi 
                                }
                                {
                                    extraInfor && extraInfor.paymentTypeData && this.props.language === languages.EN &&
                                    extraInfor.paymentTypeData.valueEn
                                }
                            </div>
                            <div className="hide-price">
                                <span onClick={() => this.showHideDetailInfor(false)}><FormattedMessage id="patient.extra-infor-doctor.hide-price"/></span>
                            </div>
                        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);