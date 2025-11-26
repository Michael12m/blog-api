const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      default: Date.now,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "write your password"],
      minlength: 6,
    },
    refreshToken: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    id: false,
  }
);
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});
userSchema.index({ email: 1 }, { unique: true });
userSchema.pre("save", function (next) {
  if (
    this.isModified("firstName") ||
    this.isModified("lastName") ||
    this.isNew
  ) {
    if (this.firstName) {
      this.firstName =
        this.firstName.charAt(0).toUpperCase() +
        this.firstName.slice(1).toLowerCase();
    }

    if (this.lastName) {
      this.lastName =
        this.lastName.charAt(0).toUpperCase() +
        this.lastName.slice(1).toLowerCase();
    }
  }

  next();
});
// userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
