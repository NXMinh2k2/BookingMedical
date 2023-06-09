import db from "../models/index"
import emaiService from './emailService'
import { v4 as uuidv4} from 'uuid'
require('dotenv').config()


let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    
    return result
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.email || !data.doctorId || !data.timeType || !data.date || 
                !data.fullName || !data.selectedGender || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else { 
                let token = uuidv4()
                console.log(data)

                await emaiService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })
                
                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName
                    }
                })

                if(user) {
                    await db.Booking.findOrCreate({
                        where: {patientId: user[0].id},
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient succeed '
                })
            }
        } catch (error) {
            reject(error)   
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where:
                        {
                            doctorId: data.doctorId,
                            token: data.token,
                            statusId: 'S1'
                        },
                    raw: false
                })
                if(appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    
                    resolve({
                        errCode: 0,
                        errMessage: "Updated the appointment succeed!"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or does not exist"
                    })
                }
            }
        } catch (error) {
            console.log(error)
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}