const jwt = require("jsonwebtoken")

const verfiyjwtmw=async(req, res, next)=> {
    const token = req.cookies?.token
    if (!token) return res.status(401).json("Access Denied")
    try {
        const veriftcookietoken = jwt.verify(token, process.env.SECRET)

        req.user = veriftcookietoken
        next()
    }
    catch (err) {
        res.status(401).json({
            success: false,
            message: "Unauthorized access",
            error: err?.message
        })
    }

}

module.exports={
    verfiyjwtmw,
}