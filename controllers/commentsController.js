const path=require('path');
const jwt=require('jsonwebtoken');
const Comment=require(path.join(__dirname,'..','models','comments'));
const catchAsync=require(path.join(__dirname,'..','errors','catchAsync'));
const AppError=require(path.join(__dirname,'..','errors','appError'));
const {pagination}=require(path.join(__dirname,'..','utils','pagination'))
const getComment=catchAsync(async(req,res)=>{
const id=req.params.id;
const comment=await Comment.findById(id);
if(!comment){
    return next(new AppError("Comment not found",404));
}
res.status(200).json({
    status:'success',
    data:{
        comment
    }
})
})
const getComments = catchAsync(async (req, res) => {
    const querypage=req.query.page
    const { posts, page, totalPages, isNext,count } = await pagination(querypage,Comment);
    if(!(isNext||totalPages===page)){
return res.status(200).json({ 
    status:'success',
    message:'No more pages',
    data:[]
 })
    }
    res.status(200).json({
        status: 'success',
        data: {
            page,
            totalPages,
           count,
            isNext,
            nextPage: isNext ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            posts,
            
        }
    });
})


const createComments = catchAsync(async (req, res) => {
    const body= req.body;
    const {id}=req.params;
    console.log(id);
    const token=req.headers.authorization.split(' ')[1];
    const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    body.user=decoded.id;
    body.post=id;
    const newComment=await Comment.create(body);
    res.status(201).json({
        status:'success',
        data:{
            comment: newComment
        }
    });
 })
const updateComments = catchAsync(async (req, res) => {
    const id=req.params.id;
    const body=req.body;
    const updatedComment=await Comment.findByIdAndUpdate(id,body,{new:true,runValidators:true});
    if(!updatedComment){
        return next(new AppError("Comment not found",404));
    }
    res.status(200).json({
        status:'success',
        data:{
            comment: updatedComment
        }
    });
})
const deleteComments = catchAsync(async (req, res) => {
    const id=req.params.id;
    const deletedComment=await Comment.findByIdAndDelete(id);
    if(!deletedComment){
        return next(new AppError("Comment not found",404));
    }
res.status(204).send();
})
module.exports={
    getComments,
    getComment,
    updateComments,
    deleteComments,
    createComments
}