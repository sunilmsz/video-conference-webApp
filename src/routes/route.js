const express = require("express")
const router = express.Router();
const {authentication} = require("../middleware/auth")
const userController = require("../controller/userController")
const dashboardController = require("../controller/dashboardController")

router.post("/users/login",userController.login)

router.post("/users/register",userController.register)

router.post("/users/dashboard",authentication,dashboardController.dashboard)

router.get("/:userId/users/ev/:randomSt",userController.verifyEmail)
router.get("/:userId/users/isvrpl/:randomSt",userController.isValidRPLink)
router.post("/:userId/users/rp/:randomSt",userController.resetPassword)
router.post("/users/resetPasswordLink",userController.sendResetPasswordLink)

router.post("/users/dashboard/getRoomId",authentication,dashboardController.getRoomId)

module.exports =router