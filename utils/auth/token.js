const jwt=require('jsonwebtoken');
const crypto =require('crypto');
const accessTokenSecret=process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret=process.env.REFRESH_TOKEN_SECRET
const accessToken=(user)=>{
    return jwt.sign({id:user._id,email:user.email},accessTokenSecret,{expiresIn:'15m'});
}
const refreshToken=(user)=>{
    return jwt.sign({id:user._id,email:user.email},refreshTokenSecret,{expiresIn:'7d'});
}
const hashToken=(token)=>{
    return crypto.createHash('sha256').update(token).digest('hex');
}
module.exports={accessToken,refreshToken,hashToken}