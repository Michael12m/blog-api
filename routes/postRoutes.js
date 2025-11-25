const path=require('path');
const {getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost}=require(path.join(__dirname, '..', 'controllers', 'postsControllers'));
    const {userAuthorization}=require(path.join(__dirname,'..','middleware','autherization','autherization'));
const express=require('express');
const router=express.Router();
// router.use(userAuthorization);
router.route('/').get(getPosts).post(createPost);
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost);
module.exports=router;