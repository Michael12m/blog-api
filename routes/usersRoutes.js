const path = require("path");
const {getUsers,
  getUser,
  registerUser,
  updateUser,
  deleteUser,}=require(path.join(__dirname,'..','controllers','usersControllers'));
const express = require("express");
const router = express.Router();
router.route('/').get(getUsers).post(registerUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = router;