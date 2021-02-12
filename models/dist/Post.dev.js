"use strict";

var _require = require('mongoose'),
    model = _require.model,
    Schema = _require.Schema;

var postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [{
    body: String,
    username: String,
    createdAt: String
  }],
  likes: [{
    username: String,
    createdAt: String
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});
module.exports = model('Post', postSchema);