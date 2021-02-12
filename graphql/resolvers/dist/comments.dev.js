"use strict";

var _require = require('apollo-server'),
    AuthenticationError = _require.AuthenticationError,
    UserInputError = _require.UserInputError;

var checkAuth = require('../../util/check-auth');

var Post = require('../../models/Post');

module.exports = {
  Mutation: {
    createComment: function createComment(_, _ref, context) {
      var postId, body, _checkAuth, username, post;

      return regeneratorRuntime.async(function createComment$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              postId = _ref.postId, body = _ref.body;
              _checkAuth = checkAuth(context), username = _checkAuth.username;

              if (!(body.trim() === '')) {
                _context.next = 4;
                break;
              }

              throw new UserInputError('Empty comment', {
                errors: {
                  body: 'Comment body must not empty'
                }
              });

            case 4:
              _context.next = 6;
              return regeneratorRuntime.awrap(Post.findById(postId));

            case 6:
              post = _context.sent;

              if (!post) {
                _context.next = 14;
                break;
              }

              post.comments.unshift({
                body: body,
                username: username,
                createdAt: new Date().toISOString()
              });
              _context.next = 11;
              return regeneratorRuntime.awrap(post.save());

            case 11:
              return _context.abrupt("return", post);

            case 14:
              throw new UserInputError('Post not found');

            case 15:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    deleteComment: function deleteComment(_, _ref2, context) {
      var postId, commentId, _checkAuth2, username, post, commentIndex;

      return regeneratorRuntime.async(function deleteComment$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              postId = _ref2.postId, commentId = _ref2.commentId;
              _checkAuth2 = checkAuth(context), username = _checkAuth2.username;
              _context2.next = 4;
              return regeneratorRuntime.awrap(Post.findById(postId));

            case 4:
              post = _context2.sent;

              if (!post) {
                _context2.next = 17;
                break;
              }

              commentIndex = post.comments.findIndex(function (c) {
                return c.id === commentId;
              });

              if (!(post.comments[commentIndex].username === username)) {
                _context2.next = 14;
                break;
              }

              post.comments.splice(commentIndex, 1);
              _context2.next = 11;
              return regeneratorRuntime.awrap(post.save());

            case 11:
              return _context2.abrupt("return", post);

            case 14:
              throw new AuthenticationError('Action not allowed');

            case 15:
              _context2.next = 18;
              break;

            case 17:
              throw new UserInputError('Post not found');

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }
};