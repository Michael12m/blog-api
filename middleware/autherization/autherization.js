const path=require('path');
const jwt=require('jsonwebtoken');
const catchAsync=require(path.join(__dirname,'..','..','errors','catchAsync'));
const User=require(path.join(__dirname,'..','..','models','user'));
const accessTokenSecret=process.env.ACCESS_TOKEN_SECRET
const userAuthorization=catchAsync(async(req,res,next)=>{
const authHeader=req.headers.authorization;
if (!authHeader||!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message:"please login to access this resource"})
}
const token= authHeader.split(' ')[1];
console.log(accessTokenSecret);
const decoded=  jwt.verify(token,accessTokenSecret);
const user=await User.findById(decoded.id);
if(!user){
    return res.status(401).json({message:"User not found"});
}
next();
})



module.exports={userAuthorization};