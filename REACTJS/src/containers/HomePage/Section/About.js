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
                        <iframe width="100%" height="400px" src="https://www.youtube.com/embed/147SkAVXEqM?list=PLncHg6Kn2JT6E38Z3kit9Hnif1xC_9VqI" title="#51 Kết Thúc Design Giao Diện Clone BookingCare.vn 4 | React.JS Cho Người Mới Bắt Đầu" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                    <div className='content-right'>
                        <p>Theo số liệu bán hàng từ Hiệp hội các nhà sản xuất ô tô Việt Nam (VAMA), trong tháng 2/2023, tổng doanh số xe hạng A giá rẻ chỉ đạt 1.114 xe, nhưng tăng mạnh 43,55% so với tháng trước (bán 776 xe). 
Doanh số xe hạng A tăng mạnh là nhờ trong tháng 2, hai mẫu xe Hyundai Grand i10 và KIA Morning được các đại lý áp dụng chính sách ưu đãi về giá khá hấp dẫn nhằm xả kho, kích cầu người mua. 

Theo đó, Hyundai Grand i10 đã chào bán bản hatchback AT sản xuất năm 2022 với giá chưa đến 390 triệu đồng, giảm khoảng 50 triệu đồng so với giá niêm yết. Với phiên bản sedan, xe  có mức giảm khoảng 15 triệu đồng.

Các đại lý KIA cũng ưu đãi 30 triệu đồng cho khách hàng mua xe Morning đời 2022.</p>
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
