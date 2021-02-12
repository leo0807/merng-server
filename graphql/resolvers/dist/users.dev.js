"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var _require = require('apollo-server'),
    UserInputError = _require.UserInputError;

var _require2 = require('../../util/validators'),
    validateRegisterInput = _require2.validateRegisterInput,
    validateLoginInput = _require2.validateLoginInput;

var _require3 = require('../../config'),
    SECRET_KEY = _require3.SECRET_KEY;

var User = require('../../models/User');

function generateToken(user) {
  return jwt.sign({
    id: user.id,
    email: user.email,
    username: user.username
  }, SECRET_KEY, {
    expiresIn: '7d'
  });
}

module.exports = {
  Mutation: {
    login: function login(_, _ref) {
      var username, password, _validateLoginInput, errors, valid, user, match, token;

      return regeneratorRuntime.async(function login$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              username = _ref.username, password = _ref.password;
              _validateLoginInput = validateLoginInput(username, password), errors = _validateLoginInput.errors, valid = _validateLoginInput.valid;

              if (valid) {
                _context.next = 4;
                break;
              }

              throw new UserInputError('Errors', {
                errors: errors
              });

            case 4:
              _context.next = 6;
              return regeneratorRuntime.awrap(User.findOne({
                username: username
              }));

            case 6:
              user = _context.sent;

              if (user) {
                _context.next = 10;
                break;
              }

              errors.general = 'User not found';
              throw new UserInputError('User not found', {
                errors: errors
              });

            case 10:
              _context.next = 12;
              return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

            case 12:
              match = _context.sent;

              if (match) {
                _context.next = 16;
                break;
              }

              errors.general = 'Wrong crendetials';
              throw new UserInputError('Wrong crendetials', {
                errors: errors
              });

            case 16:
              token = generateToken(user);
              return _context.abrupt("return", _objectSpread({}, user._doc, {
                id: user._id,
                token: token
              }));

            case 18:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    register: function register(_, _ref2) {
      var _ref2$registerInput, username, email, password, confirmPassword, _validateRegisterInpu, valid, errors, user, newUser, res, token;

      return regeneratorRuntime.async(function register$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _ref2$registerInput = _ref2.registerInput, username = _ref2$registerInput.username, email = _ref2$registerInput.email, password = _ref2$registerInput.password, confirmPassword = _ref2$registerInput.confirmPassword;
              // Validate user data
              _validateRegisterInpu = validateRegisterInput(username, email, password, confirmPassword), valid = _validateRegisterInpu.valid, errors = _validateRegisterInpu.errors;

              if (valid) {
                _context2.next = 4;
                break;
              }

              throw new UserInputError('Errors', {
                errors: errors
              });

            case 4:
              _context2.next = 6;
              return regeneratorRuntime.awrap(User.findOne({
                username: username
              }));

            case 6:
              user = _context2.sent;

              if (!user) {
                _context2.next = 9;
                break;
              }

              throw new UserInputError('Username is taken', {
                errors: {
                  username: 'This username is taken'
                }
              });

            case 9:
              _context2.next = 11;
              return regeneratorRuntime.awrap(bcrypt.hash(password, 12));

            case 11:
              password = _context2.sent;
              newUser = new User({
                email: email,
                username: username,
                password: password,
                createdAt: new Date().toISOString()
              });
              _context2.next = 15;
              return regeneratorRuntime.awrap(newUser.save());

            case 15:
              res = _context2.sent;
              token = generateToken(res);
              return _context2.abrupt("return", _objectSpread({}, res._doc, {
                id: res._id,
                token: token
              }));

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }
};