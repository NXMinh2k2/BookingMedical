import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss'
import { FormattedMessage } from 'react-intl';
import {languages} from '../../utils'
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router';

class HomeHeader extends Component {

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    returnToHome = () => {
        if(this.props.history) {
            this.props.history.push('/home')
        }
    }

    render() {
        let language = this.props.language
        return (
            <>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i class="fa-solid fa-bars"></i>
                            <div className='header-logo' onClick={() => this.returnToHome()}></div>
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="home-header.speciality" /></b></div>
                                <div className='subs-title'><FormattedMessage id="home-header.search-doctor"/></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="home-header.health-facility"/></b></div>
                                <div className='subs-title'><FormattedMessage id="home-header.select-room"/></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="home-header.doctor"/></b></div>
                                <div className='subs-title'><FormattedMessage id="home-header.select-doctor"/></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="home-header.fee"/></b></div>
                                <div className='subs-title'><FormattedMessage id="home-header.check-health"/></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'><i className="fa-solid fa-circle-question"></i></div>
                            <FormattedMessage id="home-header.support"/>
                            <div  className={language === languages.VI ? 'language active' : 'language'}>
                                <span onClick={() => this.changeLanguage(languages.VI)}>VN</span></div>
                            <div className={language === languages.EN ? 'language active' : 'language'}>
                                <span onClick={() => this.changeLanguage(languages.EN)}>EN</span>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id="banner.title1"/></div>
                            <div className='title2'><FormattedMessage id="banner.title2"/></div>
                            <div className='search'>
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input placeholder='Tìm chuyên khoa khám bệnh'/>
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child'><i class="fa-regular fa-hospital"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child1"/></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i class="fa-solid fa-mobile-screen-button"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child2"/></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i class="fa-solid fa-bed"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child3"/></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i class="fa-solid fa-microscope"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child4"/></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i class="fa-solid fa-notes-medical"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child5"/></div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child'><i class="fa-solid fa-tooth"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child6"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
