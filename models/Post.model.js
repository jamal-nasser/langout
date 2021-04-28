const { Schema, model } = require('mongoose');

const postSchema = new Schema(
  {
    title: { type: String, required: [true, 'Name is required']},
    description: { type: String, required: [true, 'Description is required']},
    imageUrl: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [],
  }
);

module.exports = model('Post', postSchema);