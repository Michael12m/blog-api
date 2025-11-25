const path = require("path");
const {getUsers,
  getUser,
  registerUser,
  updateUser,
  deleteUser,}=require(path.join(__dirname,'..','controllers','usersControllers'));
  const registerUserSchema = require(path.join(__dirname,'..','middleware','validations','registerUser'));
  const loginUserSchema = require(path.join(__dirname,'..','middleware','validations','loginUser'));
  const {loginUser,generateTokens,logoutUser} = require(path.join(__dirname,'..','controllers','auth'));
const express = require("express");
const router = express.Router();
router.route('/').get(getUsers)
router.route('/register').post(registerUserSchema,registerUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/login').post(loginUserSchema,loginUser);
router.route('/refreshtoken').post(generateTokens);
router.route('/logout').post(logoutUser);
module.exports = router;