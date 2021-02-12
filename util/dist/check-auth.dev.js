"use strict";

var _require = require('apollo-server'),
    AuthenticationError = _require.AuthenticationError;

var jwt = require('jsonwebtoken');

var _require2 = require('../config'),
    SECRET_KEY = _require2.SECRET_KEY;

module.exports = function (context) {
  // context = { ... headers }
  var authHeader = context.req.headers.authorization;

  if (authHeader) {
    // Bearer ....
    var token = authHeader.split('Bearer ')[1];

    if (token) {
      jwt.verify(token, SECRET_KEY, function (err, decoded) {
        if (err) {
          console.log(err);
        } else {
          console.log(decoded);
        }
      });

      try {
        var user = jwt.verify(token, SECRET_KEY);
        console.log(user);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }

    throw new Error("Authentication token must be 'Bearer [token]");
  }

  throw new Error('Authorization header must be provided');
};