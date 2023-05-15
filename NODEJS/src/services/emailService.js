require('dotenv').config()
import nodemailer from 'nodemailer'


let sendSimpleEmail = (dataSend) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    })

    let mailOptions = {
        from: process.env.EMAIL_APP,
        to: dataSend.reciverEmail,
        subject: 'Thông tin đặt lịch khám bệnh',
        html: `${dataSend.language} === 'en'` 
        ? 
            ` <h3>Xin chào ${dataSend.patientName}</h3>
                <h4>Bạn nhận được email này vì đã đặt lịch khám bệnh online qua Because of you</h4>
                <p>Thông tin đặt lịch khám bệnh: </p>
                <div><b>Thời gian: ${dataSend.time}</b></div>
                <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

                <p>Nếu các thông tin trên là đúng vui lòng click vào đường link để 
                    xác nhận và hoàn tất thủ tục đặt lịch khám bệnh
                </p>
                <a href="${dataSend.redirectLink} target="_blank">Click here</a>
                <div> Xin chân thành cảm ơn!</div>
            `
        :
            `
                <h3>Dear ${dataSend.patientName}</h3>
                <h4>You received this email because you booked an online consultation through Because of you</h4>
                <p>Medical appointment booking information:</p>
                <div><b>Time: ${dataSend.time}</b></div>
                <div><b>Doctor: ${dataSend.doctorName}</b></div>

                <p>If the above information is correct, please click on the link to 
                confirm and complete the procedure for booking a medical appointment
                </p>
                <div>
                <a href="${dataSend.redirectLink} target="_blank">Click here</a>
                <div> Sincerely thank! </div> 
            `
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


let sendAttachment = (dataSend) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD
        }
      });
      
      // Set up email data
      const mailOptions = {
        from: process.env.EMAIL_APP,
        to: dataSend.email,
        subject: 'Hóa đơn khám bệnh',
        html: ` <h3>Xin chào ${dataSend.patientName}</h3>
                <h4>Cảm ơn bạn đã tin tưởng Because of you</h4> 
                <h4>Thông tin hóa đơn có trong tệp đính kèm</h4>
                `,
        attachments: [
        {
            filename: `hóa đơn - ${dataSend.patientName}`,
            encoding: 'base64',
            content: dataSend.imageBase64.split("base64, ")[1]
        }],
    };
      
      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error occurred while sending email:', error);
        } else {
          console.log('Email sent successfully:', info.response);
        }
      });
}



module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}