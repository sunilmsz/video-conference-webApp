const userModel  = require("../models/userModel")
const jwt = require('jsonwebtoken')

const authentication =async (req,res,next) => {
    try {
        const token = req.cookies["x-api-key"]
        if (!token)
            return res.status(401).send({ status: false, msg: "Unauthorized user, token not provided" })

        let tokenData;
        try {
                tokenData = jwt.verify(token,"extraSecurity")
        } catch (error) {
                return res.status(401).send({status:false,msg:"Unauthorized user, Invalid token"})
        }
        console.log(tokenData)
        const userData = await userModel.findOne({_id:tokenData.id}).lean()
        if(!userData)
        return res.status(404).send({status:false,msg:"No user Found"})

        req.userData = userData;
        next()
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: "Internal Server Error" })
    }


}

module.exports = { authentication }