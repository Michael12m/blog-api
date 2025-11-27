const path = require("path");
const User = require(path.join(__dirname, "..", "models", "User"));
const catchAsync = require(path.join(__dirname, "..", "errors", "catchAsync"));
const AppError = require(path.join(__dirname, "..", "errors", "appError"));
const { pagination } = require(path.join(__dirname,'..','utils','pagination'));
const getUsers = catchAsync(async (req, res) => {
    const querypage=req.query.page
    const { posts, page, totalPages, isNext,count } = await pagination(querypage,User);
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
const getUser = catchAsync(async (req, res) => {
    const id = req.params.id;
const user = await User.findById(id)
  .select('firstName lastName')
  .populate({
    path: 'posts',
    select: 'title content createdAt -user ' ,
populate: {
    path: 'comments',
    select: 'content user createdAt -post -_id'
}});
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
})
const registerUser = catchAsync(async (req, res) => {
    const body = req.body;
    const newUser = await User.create(body);
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
})
const updateUser = catchAsync(async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
})
const deleteUser = catchAsync(async (req, res) => {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    res.status(204).json({
        status: 'delete successfully',
        data: null
    });
})

module.exports = {
  getUsers,
  getUser,
  registerUser,
  updateUser,
  deleteUser,
};