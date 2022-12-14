
const userModel = require("../models/userModel")
const roomModel = require("../models/roomModel")


function randomSt(length) {
    let result = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const dashboard = async (req, res) => {
    try {
        delete req.userData.password
        res.status(200).send({ status: true, msg: "Success", data: req.userData })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: "Internal Server Error" })
    }
}


const getRoomId = async (req, res) => {
    try {
        const userId = req.userData._id;
        const code = randomSt(8)
        const room = await roomModel.create({ userId, code })

        return res.status(201).send({ status: true, msg: "Success", data: room })
    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }

}

const getRoomIdByCode = async (req, res) => {
    try {
        const code = req.body.code
        const room = await roomModel.findOne({ code: code }).lean()
        if (!room)
            return res.status(400).send({ status: false, msg: "Invalid Invite code, please enter correct one" })

        return res.status(200).send({ status: true, msg: "Success", data: room._id })
    } catch (error) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }

}

module.exports = { dashboard, getRoomId, getRoomIdByCode }