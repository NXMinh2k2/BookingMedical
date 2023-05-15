import bcrypt from 'bcryptjs'
import db from "../models/index" 
const salt = bcrypt.genSaltSync(10)
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExit = await checkUserEmail(email)
            if(isExit) {
               let user = await db.User.findOne({
                attributes:  ['id','email', 'roleId', 'password', 'firstName', 'lastName'],
                where : {email:email},
                raw: true
               })
               if(user) {
                    let check = await bcrypt.compareSync(password, user.password)
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok'
                        delete user.password
                        userData.user = user
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password'
                    }
                } else {
                userData.errCode = 2;
                userData.errMessage = `User's not found`
               }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist`
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: userEmail}
            })
            if(user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleGetAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if(userId === 'ALL') {
                users = await db.User.findAll({
                    // attributes: {
                    //     exclude: ['password']
                    // },
                })
            } 
            if(userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {id: userId},
                    // attributes: {
                    //     exclude: ['password']
                    // },
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let handleCreateNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email co ton tai khong
            let check = await checkUserEmail(data.email)
            if(check) {
                resolve ({
                    errCode: 1,
                    messeage: 'Your email is already in used, Plz try another email'
                })
            } else {
                let hashPasswordFromBscrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBscrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    messeage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
           let user = await db.User.findOne({
            where: {id: userId}
           })
           if(!user) {
            resolve({
                errCode: 2,
                errMessage: "The user isn't exist"
            })
           }
            await db.User.destroy({
                where: {id: userId}
            })
            resolve ({
                errCode: 0,
                messeage: 'OK'
            })
        } catch (error) {
            reject(error)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let user = await db.User.findOne( {
                where: {id: data.id},
                raw: false
            })
            if(user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                user.roleId =  data.roleId
                user.positionId = data.positionId
                user.gender = data.gender
                user.phoneNumber= data.phoneNumber

                if(data.avatar) {
                    user.image = data.avatar
                }

                await user.save()
                resolve({
                    errCode: 0,
                    messeage: 'OK'
                })
            } else {
                resolve({
                    errCode: 0,
                    messeage: `User's not found`
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramerters !'
                })
            } else {
                let res = {}
                let allcode = await db.Allcode.findAll({
                    where: {type: typeInput}
                })
                res.errCode = 0
                res.data = allcode
                resolve(res)
            }
        } catch (error) {
            
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService
}