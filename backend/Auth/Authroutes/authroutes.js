const User = require("../../Models/userschema.js")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const {verfiyjwtmw} = require("../../Middleware/middleware.js")





const express = require("express");

const { signup,getuserinfo, login, logout } = require("../Authcontrollers/authcontrollers.js")
const router = express.Router()



router.post("/getstarted", signup)
router.post("/login",login)
router.get("/getuserinfo", verfiyjwtmw,getuserinfo )
router.get("/logout",logout)


module.exports = router;