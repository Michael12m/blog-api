const jwt=require('jsonwebtoken');
const accessTokenSecret=process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret=process.env.REFRESH_TOKEN_SECRET
const accessToken=(user)=>{
    return jwt.sign({id:user._id,email:user.email},accessTokenSecret,{expiresIn:'15m'});
}
const refreshToken=(user)=>{
    return jwt.sign({id:user._id,email:user.email},refreshTokenSecret,{expiresIn:'7d'});
}
module.exports={accessToken,refreshToken}