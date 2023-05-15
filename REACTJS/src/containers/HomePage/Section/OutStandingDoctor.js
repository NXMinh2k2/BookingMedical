import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import * as actions from '../../../store/actions'
import { languages } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';

class OutStandingDoctor extends Component {
    constructor(props) {
        super()
        this.state = {
            arrDoctors: []
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors()
    }

    componentDidUpdate(prevProps) {
        if(prevProps.topDoctorRedux !== this.props.topDoctorRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorRedux
            })
        }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`)
    }

    render() { 
        const {settings, language} = this.props
        let arrDoctors = this.state.arrDoctors
        return (
            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <h3 className='title-section'><FormattedMessage id="homepage.outstanding-doctor"/></h3>
                        <button className='btn-section'><FormattedMessage id="homepage.more-info"/></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                        {   arrDoctors &&
                            arrDoctors.length > 0 &&
                            arrDoctors.map((item, index) => {
                                let imageBase64 = ''
                                if(item.image) {
                                    imageBase64 = new Buffer(item.image, 'base64').toString('binary')
                                }
                                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`
                                let nameEn = `${item.positionData.valueEn}, ${item.lastName} ${item.firstName}`
                                return (
                                    <div 
                                        className='section-customize'
                                        onClick={() => this.handleViewDetailDoctor(item)}
                                    >
                                        <div className='customize-border'>
                                            <div className='outer-bg'>
                                                <div 
                                                    className='bg-image section-outstanding-doctor'
                                                    style={{backgroundImage: `url(${imageBase64})`}}
                                                >

                                                </div>
                                            </div>
                                            <div className='position text-center'>
                                                <h4>{language === languages.VI ? nameVi : nameEn}</h4>
                                                <h3>Da liễu</h3>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctorRedux: state.admin.topDoctors,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
