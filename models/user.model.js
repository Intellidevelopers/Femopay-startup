import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      minLength: 2,
      unique: true,
    },
    tagName: { type: String, unique: true, sparse: true },
    firstName: {
      type: String,
      trim: true,
      minLength: 2,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    transactionPin: {
      type: String,
      select: false, // prevents it from being returned in queries unless explicitly selected
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "agent"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnboarded: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Auto-hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;

