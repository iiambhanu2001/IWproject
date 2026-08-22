const express = require("express")

const {verfiyjwtmw} = require("../../Middleware/middleware.js")

const { startusersession, getallwaitingsessions, sendquetoserbyIW, getasession, sendanswerfromuser, postfeedback, resultbyiv,fetchallsessiondata,checkinglastseen } = require("../../Controllers/Usercontrollers/useriv.js");


const router = express.Router();


router.get("/startinterview", verfiyjwtmw, startusersession)
router.get("/sessions", verfiyjwtmw, getallwaitingsessions)

router.post("/sendque/session/:sessionid", verfiyjwtmw, sendquetoserbyIW)
router.get("/session/:sessionid", verfiyjwtmw, getasession)

router.post("/startinterview/session/:sessionid",verfiyjwtmw, sendanswerfromuser)
router.post("/interview/feedback/:sessionid", verfiyjwtmw, postfeedback)

router.get("/interview/session/result/:sessionid", verfiyjwtmw, resultbyiv)
router.get("/sessionsdata",verfiyjwtmw,fetchallsessiondata)




router.get('/lastseenAt/:sessionid',verfiyjwtmw,checkinglastseen)

module.exports = router;