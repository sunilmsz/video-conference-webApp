const express = require("express")
const router = express.Router();
const {authentication} = require("../middleware/auth")
const userController = require("../controller/userController")
const dashboardController = require("../controller/dashboardController")

router.post("/api/users/login",userController.login)

router.post("/api/users/register",userController.register)

router.post("/api/users/dashboard",authentication,dashboardController.dashboard)

router.get("/api/:userId/users/ev/:randomSt",userController.verifyEmail)
router.get("/api/:userId/users/isvrpl/:randomSt",userController.isValidRPLink)
router.post("/api/:userId/users/rp/:randomSt",userController.resetPassword)
router.post("/api/users/resetPasswordLink",userController.sendResetPasswordLink)

router.post("/api/users/dashboard/getRoomId",authentication,dashboardController.getRoomId)

router.post("/api/users/dashboard/getRoomIdByCode",authentication,dashboardController.getRoomIdByCode)

module.exports =router