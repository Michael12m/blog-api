const mongoose=require('mongoose');
const commentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    // user:{
    //     ref:'User',
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:false
    // },
    // post:{
    //     ref:'Post',
    //     type:mongoose.Schema.Types.ObjectId,
    //     required:false
    // }
})
const Comment=mongoose.model('Comment',commentSchema);
module.exports=Comment;