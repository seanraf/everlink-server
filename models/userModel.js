const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: function () {
        return this.provider === "farcaster";
      },
      unique: true,
    },
    email: {
      type: String,
      required: function () {
        return this.provider === "gmail";
      },
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["farcaster", "gmail"],
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
