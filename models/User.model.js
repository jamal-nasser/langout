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
      // required: [true, 'Please use a valid email address'],
    },
    passwordHash: {
      type: String,
      // required: [true, 'Password is required'],
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