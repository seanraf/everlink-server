const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    links: [
      {
        label: {
          type: String,
          required: true, // Label for the link
          trim: true,
        },
        value: {
          type: String,
          required: true, // URL of the link
          validate: {
            validator: function (value) {
              // Simple validation for URL format
              return /^https?:\/\/\S+$/.test(value);
            },
            message: (props) => `${props.value} is not a valid URL`,
          },
          trim: true,
        },
      },
    ],
    theme: {
      type: String,
      enum: ["dark", "light"], // Only allow 'dark' or 'light'
      default: "light", // Default theme is 'light'
      required: true,
    },
    googleAnalyticsTag: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", linkSchema);
module.exports = Link;
