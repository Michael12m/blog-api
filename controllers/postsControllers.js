const path=require('path');
const Post = require(path.join(__dirname, '..', 'models', 'Posts'));
const catchAsync=require(path.join(__dirname,'..','errors','catchAsync'));
const jwt=require('jsonwebtoken');
const getPosts = catchAsync(async (req, res) => {
    //pagination 
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit =20;
    const skip =(page-1)*limit;
    const posts=await Post.find().skip(skip).limit(limit);
    const count=await Post.estimatedDocumentCount();
    const totalPages=Math.ceil(count/limit);
    const isNext=totalPages>=(page+1);
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
            totalPages: Math.ceil(count / limit),
            docCount: posts.length,
            isNext,
            nextPage: isNext ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            posts,
            
        }
    });
})
const getPost=catchAsync(async(req,res)=>{
    const id=req.params.id;
    const post=await Post.findById(id);
    if(!post){
        return res.status(404).json({
            status:'fail',
            message:'Post not found'
        });
    }
    res.status(200).json({
        status:'success',
        data:{
            post
        }
    });
})
const createPost=catchAsync(async(req,res)=>{
    const body=req.body;
    const token=req.headers.authorization.split(' ')[1];
    const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    body.user=decoded.id;
    const newPost=await Post.create(body);
    res.status(201).json({
        status:'success',
        data:{
            post:newPost
        }
    });
})
const updatePost=catchAsync(async(req,res)=>{
    const id=req.params.id;
    const body=req.body;
    const post=await Post.findByIdAndUpdate(id,body,{new:true,runValidators:true});
    if(!post){
        return  res.status(404).json({
            status:'fail',
            message:'Post not found'
        });
    }
    res.status(200).json({
        status:'success',
        data:{
            post
        }
    });
})
const deletePost=catchAsync(async(req,res)=>{
    const id=req.params.id;
    const post=await Post.findByIdAndDelete(id);
    if(!post){
        return res.status(404).json({
            status:'fail',
            message:'Post not found'
        });
    }
    res.status(204).json({
        status:'delete successfully',
        data:null
    });
})
module.exports={
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
}