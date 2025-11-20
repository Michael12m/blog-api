const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
 const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..','..',"images"));
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now()+'-'+crypto.randomBytes(6).toString('hex');
        const ext=file.mimetype.split('/')[1];
        cb(null,`profile-${uniqueSuffix}.${ext}`);
    }
 })
 const upload=multer({
    storage:storage,
    limits:{fileSize:1024*1024*5}, //5MB
 })
 module.exports=upload;