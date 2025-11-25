const path=require('path');
const {getComments,
    getComment,
    updateComments,
    deleteComments,
    createComments}=require(path.join(__dirname,'..','controllers','commentsController'));
const express=require('express');
const router=express.Router();
router.route('/').get(getComments)
router.route("/post/:id").post(createComments);
router.route('/:id').get(getComment).patch(updateComments).delete(deleteComments);
module.exports=router;