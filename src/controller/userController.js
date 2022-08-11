const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const nodeMailer = require("nodemailer")
const { v4: uuidV4 } = require("uuid")
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" })

const sendVerificationMail = async (email, subject, data) => {
    let transporter = nodeMailer.createTransport({
        host: "smtppro.zoho.in",
        port: 465,
        secure: true,
        auth: {
            user: process.env.email,
            pass: process.env.emailPass
        }
    })

    const mailOptions = {
        from: process.env.email,
        to: email,
        subject: subject,
        html: data
    }
    let info = await transporter.sendMail(mailOptions)
}


const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const randomSt = uuidV4();
        if (!name || !email || !password)
            return res.status(400).send({ status: false, msg: "mandatory field missing" })

        const duplicateEmail = await userModel.findOne({ email }).count()
        if (duplicateEmail == 1)
            return res.status(400).send({ status: false, msg: "Email is already registered" })



        const savedData = await userModel.create({ name, email, password, randomEmailSt: { st: randomSt, date: new Date(new Date().getTime() + (4 * 60 * 60 * 1000)) } })

        const subject = "Account Verification Email";
        const data = `<p>Click <a href="${process.env.host}/${savedData._id}/users/ev/${randomSt}"> here </a> to verify your account</p>`
        sendVerificationMail(email, subject, data);
        res.status(201).send({ status: true, msg: "Success", data: "Registration Done, Verification mail has been sent" })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: "Internal Server Error" })
    }
}



const login = async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).send({ status: false, msg: "mandatory field missing" })

        const user = await userModel.findOne({ email, password }).select({ password: 0 }).lean()

        if (!user)
            return res.status(400).send({ status: false, msg: "invalid Credentials" })

        if (user.emailVerify == false) {
            const uuid = uuidV4();
            if (new Date().getTime() < user.randomEmailSt.date.getTime())
                return res.status(400).send({ status: false, msg: "Verification mail has  already sent to your registered email,please verify email first before login" })

            const subject = "Account Verification Email";
            const data = `<p>Click <a href="${process.env.host}/${user._id}/users/ev/${uuid}"> here </a> to verify your account</p>`
            sendVerificationMail(user.email, subject, data)
            await userModel.findByIdAndUpdate(user._id, { randomEmailSt: { st: uuid, date: new Date(new Date().getTime() + (4 * 60 * 60 * 1000)) } })
            return res.status(400).send({ status: false, msg: " New Verification mail has been sent to your registered email,please verify email first before login" })
        }

        const token = jwt.sign({ id: user._id }, "extraSecurity")
        res.cookie("x-api-key", token,
            {
                expires: new Date((new Date).getTime() + (7 * 24 * 60 * 60 * 1000)),
                httpOnly: false
            })
        return res.status(200).send({ status: true, msg: "Success", data: user })

    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }


}

const verifyEmail = async (req, res) => {

    try {
        const { randomSt, userId } = req.params
        const isValidUser = await userModel.findOne({ _id: userId, isDeleted: false }).lean()
        if (!isValidUser)
            return res.status(400).send({ status: false, msg: "Invalid User" })

        if (isValidUser.randomEmailSt.st == randomSt) {
            if (new Date().getTime() > isValidUser.randomEmailSt.date.getTime)
                return res.status(400).send({ status: false, msg: "This link has been expired" })

            await userModel.findByIdAndUpdate(userId, { emailVerify: true })
            return res.status(200).send({ status: true, msg: "Success", data: "Email verified successfully, Now you can login your account" })
        }

        return res.status(400).send({ status: false, msg: "Invalid Link" })

    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }




}


const sendResetPasswordLink = async (req, res) => {

    try {
        const { email } = req.body;
        const uuid = uuidV4()
        const isValidUser = await userModel.findOneAndUpdate({ email }, { randomPassSt: { st: uuid, date: new Date(new Date().getTime() + (20 * 60 * 1000)), used: false } }).lean()
        if (!isValidUser)
            return res.status(400).send({ status: false, msg: "this email is not a registerd email" })

        const subject = "Reset Password "
        const data = `<p>Click <a href="${process.env.host}/${isValidUser._id}/users/rp/${uuid}"> here </a> to reset your password<br/> this link is valid only for next 20 minutes </p>`
        res.status(200).send({ status: true, msg: "Success", data: "Reset Password Link has been sent. " })
        sendVerificationMail(email, subject, data)
        // userModel.findByIdAndUpdate(isValidUser._id, )
    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }


}

const isValidRPLink = async (req, res) => {

    try {

        const { userId, randomSt } = req.params

        const isValid = await userModel.findOne({ _id: userId, isDeleted: false, "randomPassSt.st": randomSt, "randomPassSt.used": false }).lean()
        if (!isValid)
            return res.status(400).send({ status: false, msg: "invalid link" })

        if (isValid.randomPassSt.date.getTime() < new Date().getTime())
            return res.status(400).send({ status: false, msg: "This link is expired" })

        if (isValid.randomPassSt.used == true)
            return res.status(400).send({ status: false, msg: "This link can be used only once" })

        res.status(200).send({ status: true, msg: "Success" })

    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }


}

const resetPassword = async (req, res) => {

    try {
        const { userId, randomSt } = req.params
        const { password } = req.body
        const userData = await userModel.findOneAndUpdate({ _id: userId, _id: userId, isDeleted: false, "randomPassSt.st": randomSt, "randomPassSt.used": false }, { "randomPassSt.used": true, password })
        if (!userData)
            return res.status(400).send({ status: false, msg: "Invalid link" })

        return res.status(200).send({ status: true, msg: "Success", data: "Password Reset Successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }



}

module.exports = { register, login, verifyEmail, sendResetPasswordLink, isValidRPLink, resetPassword }