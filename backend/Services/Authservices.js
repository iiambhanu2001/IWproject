const bcrypt = require('bcrypt');


const passwordhasing=async(password)=>  {
    const saltRounds = 10;

    const hashedpass = await bcrypt.hash(password, saltRounds)
    return hashedpass;

}
const passwordverification=async(userconfirmpass, hashedpass)=>{
    return isMatch = await bcrypt.compare(userconfirmpass, hashedpass);

}


module.exports={
passwordhasing,
passwordverification
}