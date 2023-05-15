import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";


class HandBook extends Component {
    render() {
        const {settings} = this.props
        return (
            <div className='section-share section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cẩm nang</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cẩm nang 1</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cẩm nang 2</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cẩm nang 3</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cẩm nang 4</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cẩm nang 5</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cẩm nang 6</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cẩm nang 7</h3>
                            </div>
                            <div className='section-customize'>
                                <div className='bg-image section-handbook'></div>
                                <h3>Cẩm nang 8</h3>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
