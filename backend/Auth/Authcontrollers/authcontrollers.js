const { passwordhasing, passwordverification } = require("../../Services/Authservices")
var cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken")
const User = require("../../Models/userschema.js")
const {verfiyjwtmw} = require("../../Middleware/middleware.js")




const signup = async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const profession = req.body.profession
    const password = req.body.password
    const cpassword = req.body.cpassword
    const role = req.body.role


    const hashedpassword = await passwordhasing(password)



    const ismatched = await passwordverification(cpassword, hashedpassword)

    if (ismatched) {
        res.status(200).json("Login successful");
    } else {
        res.status(401).json("Invalid credentials");
    }
    const newuser = new User({
        role,
        name,
        email,
        profession,
        password: hashedpassword,

    })

    await newuser.save();

}

const login = async (req, res) => {
    const email = req.body.email
    const verifyemail = await User.findOne({ email: email })
    
    console.log(verifyemail)

    if (verifyemail) {

        const password = req.body.password


        const payload = { userid: verifyemail._id, role: verifyemail.role, name: verifyemail.name, email: verifyemail.email }

        const ismatched = await passwordverification(password, verifyemail.password)



        if (ismatched) {

            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '10h' })

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: "none",
                secure: true

            })

            return res.status(201).json({
                token,
                role: verifyemail.role,
                message: "login sucessufll"
            })


        }
        else
            res.status(401).json("Please enter the correct details!!!!")
    }
    else {
        res.status(404).json("No records found !!!")
    }
}

const getuserinfo = async (req, res) => {
    console.log(req.user)
    res.status(201).json({
        userinfo: req.user,
        message: "Re-Verification"

    })
}

const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });
    res.status(201).json({
        message: "Logout succesful"
    })

}

module.exports = {
    signup,
    login,
    getuserinfo,
    logout
}