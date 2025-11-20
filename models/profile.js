const mongoose=require('mongoose');
const profileSchema=new mongoose.Schema({
    bio:{
        type:String,
        default:'',
    },
    avatarUrl:{
        type:String,
        default:'',
    },
    avatarId:{
        type:String,
        default:'',
    },
    // user:{
    //     ref:'User',
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:true
    // }
})
const Profile=mongoose.model('Profile',profileSchema);
module.exports=Profile;
