const path=require("path")
const crypto=require('crypto')
const User=require(path.join(__dirname,'..','models','user'))
const catchAsync=require(path.join(__dirname,'..','errors','catchAsync'))
const{accessToken,refreshToken}=require(path.join(__dirname,'..','utils','auth','token'))
//login user
const loginUser=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body
    console.log(email, password);
    const user=await User.findOne({email})
    console.log(user.password);
    if(!user){
        return res.status(401).json({message:"Invalid email or password"})
    }
    const isMatch=await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message:"Invalid email or password"})
    }
    const access=accessToken(user);
    const refresh=refreshToken(user);
    res.cookie('refreshToken',refresh,{
        httpOnly:true,
        signed:true
    });    
    user.refreshToken.push(crypto.createHash('sha256').update(refresh).digest('hex'));
    await user.save();
    res.status(200).json({message:"Login successful", user, accessToken: access});
})
//generate new tokens
 const generateTokens=(async(req,res,next)=>{
const refreshToken=req.signedCookies.refreshToken;
if(!refreshToken){
    return res.status(401).json({message:"No refresh token provided"});
}
const hashedToken=crypto.createHash('sha256').update(refreshToken).digest('hex');
const user=await User.findOne({refreshToken:hashedToken});
if(!user){
    return res.status(403).json({message:"Invalid refresh token"});
}
const newAccessToken=accessToken(user);
const newRefreshToken=refreshToken(user);
res.cookie('refreshToken',newRefreshToken,{
    httpOnly:true,
    signed:true
});
user.refreshToken=user.refreshToken.filter(token=>token!==hashedToken);
user.refreshToken.push(crypto.createHash('sha256').update(newRefreshToken).digest('hex'));
await user.save();
res.status(200).json({accessToken:newAccessToken});
 })
 //logout user
 const logoutUser=catchAsync(async(req,res,next)=>{
    const refreshToken=req.signedCookies.refreshToken;
    if(!refreshToken){
        return res.status(400).json({message:"No refresh token provided"});
    }
    const hashedToken=crypto.createHash('sha256').update(refreshToken).digest('hex');
    const user=await User.findOne({refreshToken:hashedToken});
    if(user){
        user.refreshToken=user.refreshToken.filter(token=>token!==hashedToken);
        await user.save();
    }
    res.clearCookie('refreshToken');
    res.status(200).json({message:"Logout successful"});
 })
module.exports={loginUser,generateTokens,logoutUser};