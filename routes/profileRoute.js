const path=require('path');
const upload=require(path.join(__dirname,'..','middleware','upload','profilePhoto'));
const {
     getProfile,
    getProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    removeBio,
    removePhoto
}=require(path.join(__dirname,'..','controllers','profileController'));
const express=require('express');
const router=express.Router();
router
.route('/')
.get(getProfiles).post(upload.single('avatar'),createProfile)
router.route('/bio')
router
.route('/:id').get(getProfile).delete(deleteProfile).patch(upload.single('avatar'),updateProfile);
router.route('/:id/bio').patch(removeBio);
router.route('/:id/photo').patch(removePhoto);
module.exports=router;