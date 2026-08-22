const mongoose = require("mongoose")

async function connecttoDb() {
    try {
        await mongoose.connect(process.env.uri)
        console.log("connection successful")
    }
    catch (err) {
        console.log("not connected", err)
    }
}
module.exports={
    connecttoDb
}