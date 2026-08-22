const express = require("express")

const { verfiyjwtmw } = require("../../Middleware/middleware.js")

const { startivwithai, startSession, sendinganswertoai, resultai, fetchfeedback } = require("../../Controllers/Aicontrollers/ai.js");


const router = express.Router();

router.get('/iwquestion', verfiyjwtmw, startivwithai);
router.get('/iwquestion/:sessionid', verfiyjwtmw, startSession);
router.post('/iwanswer/:sessionid', verfiyjwtmw, sendinganswertoai);
router.get('/feedback/:sessionid', verfiyjwtmw, fetchfeedback);
router.post('/feedback/:sessionid', verfiyjwtmw, resultai)


module.exports = router;

