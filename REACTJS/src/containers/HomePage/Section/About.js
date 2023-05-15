import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class About extends Component {

    render() {
        return (
            <div className='section-share section-about'>
               <div className='section-about-header'>
                    Truyền thông nói gì về tôi
               </div>
               <div className='section-about-content'>
                    <div className='content-left'>
                    <iframe width="700" height="400" src="https://www.youtube.com/embed/7tiR7SI4CkI" title="BookingCare trên VTV1 ngày 21/02/2018 - Chương trình Cà phê khởi nghiệp" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                    <div className='content-right'>
                       <p>
                       Đặt lịch khám 24/7 thân thiện, tiện ích

BookingCare hoạt động liên tục 24 giờ một ngày, 7 ngày một tuần, và 365 ngày một năm, kể cả ngày nghỉ và ngày lễ để bạn có thể đặt lịch trực tuyến. Đây là một lợi thế lớn của hệ thống đặt lịch khám trên Internet, hoạt động liên tục 24/7 thay vì chỉ giới hạn trong giờ hành chính như dịch vụ truyền thống.

Bạn có thể sử dụng dịch vụ đặt lịch khám của BookingCare bất cứ lúc nào nếu bạn có một tình trạng sức khỏe không khẩn cấp, có kế hoạch thăm khám chủ động. Hoặc đơn giản là muốn có một lựa chọn phù hợp, hiệu quả thay cho cho việc đến đăng ký khám trực tiếp và chờ đợi, xếp hàng tại các cơ sở y tế.
                       </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
