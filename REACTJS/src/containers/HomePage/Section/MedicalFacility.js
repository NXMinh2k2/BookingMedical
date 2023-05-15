import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacility.scss'
import Slider from "react-slick";
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
    
class MedicalFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataClinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic()
        if(res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data
            })
        }
    }

    handleViewDetailClinic = (clinic) => {
        this.props.history.push(`/detail-clinic/${clinic.id}`)
    }

    render() {
        const {settings} = this.props
        const {dataClinics} = this.state
        console.log(dataClinics)
        return (
            <div className='section-share section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cơ sở y tế nổi bật</span>
                        <button className='btn-section'>Tìm kiếm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            {dataClinics && dataClinics.length > 0 &&
                                dataClinics.map((item, index) => {
                                    return (
                                        <div 
                                            key={index} 
                                            className='section-customize medical-facility-child'
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        >
                                            <div 
                                                className='bg-image section-medical-facility'
                                                style={{backgroundImage: `url(${item.image})`}}
                                            >
                                            </div>
                                            <div className='clinic-name'>{item.name}</div>
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
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));