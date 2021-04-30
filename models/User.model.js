const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
    },
    speakingLanguage: { type: String },
    learningLanguage: { type: String },
    imageUrl: { type: String },
    googleId: String,
    facebookId: String,
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);