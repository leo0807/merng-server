"use strict";

var _require = require('mongoose'),
    model = _require.model,
    Schema = _require.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String
});
module.exports = model('User', userSchema);