const path = require("path");
const fs = require("fs").promises;
const catchAsync = require(path.join(__dirname, "..", "errors", "catchAsync"));
const Profile = require(path.join(__dirname, "..", "models", "profile"));
const cloudinary = require(path.join(__dirname, "..", "config", "cloudinary"));
const jwt = require("jsonwebtoken");
const getProfile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const profile = await Profile.findById(id).populate("user", "firstName lastName -_id");
  if (!profile) {
    return res.status(400).json({
      status: "fail",
      message: "Profile ID is not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});
const getProfiles = catchAsync(async (req, res) => {
  const profiles = await Profile.find();
  res.status(200).json({
    status: "success",
    results: profiles.length,
    data: {
      profiles,
    },
  });
});
const createProfile = catchAsync(async (req, res) => {
  const file = req.file;
  const bio = req.body.bio;
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "profiles",
    resource_type: "image",
    quality: "auto",
    overwrite: true,
  });
  const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.ACCESS_TOKEN_SECRET);
  const profile = await Profile.create({
    bio,
    avatarUrl: result.secure_url,
    avatarId: result.public_id,
    user: decoded.id
  });
  await fs.unlink(file.path);
  res.status(201).json({
    status: "success",
    data: { profile },
  });
});
const updateProfile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const file = req.file;
  const profile = await Profile.findById(id);
  if (!profile) {
    return res.status(400).json({
      status: "fail",
      message: "Profile ID is not found",
    });
  }
  if (req.file) {
    await cloudinary.uploader.destroy(profile.avatarId);
    const updatepic = await cloudinary.uploader.upload(file.path, {
      folder: "profiles",
      resource_type: "image",
      overwrite: true,
    });
    const updatePhoto = await Profile.findByIdAndUpdate(
      id,
      {
        avatarUrl: updatepic.secure_url,
        avatarId: updatepic.public_id,
      },
      { new: true, runValidators: true }
    );
    await fs.unlink(req.file.path);
    return res.status(200).json({
      status: "success",
      data: {
        updatePhoto,
      },
    });
  } else if (req.body) {
    const updatedProfile = await Profile.findByIdAndUpdate(id, req.body.bio, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: "success",
      data: {
        updatedProfile,
      },
    });
  }
  res.status(400).json({
    status: "fail",
    message: "No data provided for update",
  });
});
const deleteProfile = catchAsync(async (req, res) => {
  const id = req.params.id;
  const profile = await Profile.findByIdAndDelete(id);
  if (!profile) {
    res.status(400).json({
      status: "fail",
      message: "Profile ID is not found",
    });
  }
  await cloudinary.uploader.destroy(profile.avatarId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
const removeBio = catchAsync(async (req, res) => {
  const id = req.params.id;
  const profile = await Profile.findByIdAndUpdate(
    id,
    { $unset: { bio: 1 } },
    { new: true }
  );
  if (!profile) {
    res.status(400).json({
      status: "fail",
      message: "Profile ID is not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});
const removePhoto = catchAsync(async (req, res) => {
  const id = req.params.id;
  await cloudinary.uploader.destroy(profile.avatarId);
  const profile = await Profile.findByIdAndUpdate(
    id,
    { $unset: { avatarId: 1, avatarUrl: 1 } },
    { new: true }
  );
  if (!profile) {
    res.status(400).json({
      status: "fail",
      message: "Profile ID is not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});

module.exports = {
  getProfile,
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  removeBio,
  removePhoto,
};
