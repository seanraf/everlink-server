const mongoose = require("mongoose");
const Provider = require("../enums/providerEnum");

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
        return this.provider === Provider.FARCASTER;
      },
      unique: true,
    },
    email: {
      type: String,
      required: function () {
        return this.provider === Provider.GMAIL;
      },
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: Object.values(Provider),
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
