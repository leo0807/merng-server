"use strict";

var _require = require('apollo-server'),
    AuthenticationError = _require.AuthenticationError,
    UserInputError = _require.UserInputError;

var Post = require('../../models/Post');

var checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    getPosts: function getPosts() {
      var posts;
      return regeneratorRuntime.async(function getPosts$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(Post.find().sort({
                createdAt: -1
              }));

            case 3:
              posts = _context.sent;
              return _context.abrupt("return", posts);

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              throw new Error(_context.t0);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 7]]);
    },
    getPost: function getPost(_, _ref) {
      var postId, post;
      return regeneratorRuntime.async(function getPost$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              postId = _ref.postId;
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(Post.findById(postId));

            case 4:
              post = _context2.sent;

              if (!post) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", post);

            case 9:
              throw new Error('Post not found');

            case 10:
              _context2.next = 15;
              break;

            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](1);
              throw new Error(_context2.t0);

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[1, 12]]);
    }
  },
  Mutation: {
    createPost: function createPost(_, _ref2, context) {
      var body, user, newPost, post;
      return regeneratorRuntime.async(function createPost$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              body = _ref2.body;
              user = checkAuth(context);

              if (!(body.trim() === '')) {
                _context3.next = 4;
                break;
              }

              throw new Error('Post body must not be empty');

            case 4:
              newPost = new Post({
                body: body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
              });
              _context3.next = 7;
              return regeneratorRuntime.awrap(newPost.save());

            case 7:
              post = _context3.sent;
              context.pubsub.publish('NEW_POST', {
                newPost: post
              });
              return _context3.abrupt("return", post);

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      });
    },
    deletePost: function deletePost(_, _ref3, context) {
      var postId, user, post;
      return regeneratorRuntime.async(function deletePost$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              postId = _ref3.postId;
              user = checkAuth(context);
              _context4.prev = 2;
              _context4.next = 5;
              return regeneratorRuntime.awrap(Post.findById(postId));

            case 5:
              post = _context4.sent;

              if (!(user.username === post.username)) {
                _context4.next = 12;
                break;
              }

              _context4.next = 9;
              return regeneratorRuntime.awrap(post["delete"]());

            case 9:
              return _context4.abrupt("return", 'Post deleted successfully');

            case 12:
              throw new AuthenticationError('Action not allowed');

            case 13:
              _context4.next = 18;
              break;

            case 15:
              _context4.prev = 15;
              _context4.t0 = _context4["catch"](2);
              throw new Error(_context4.t0);

            case 18:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[2, 15]]);
    },
    likePost: function likePost(_, _ref4, context) {
      var postId, _checkAuth, username, post;

      return regeneratorRuntime.async(function likePost$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              postId = _ref4.postId;
              _checkAuth = checkAuth(context), username = _checkAuth.username;
              _context5.next = 4;
              return regeneratorRuntime.awrap(Post.findById(postId));

            case 4:
              post = _context5.sent;

              if (!post) {
                _context5.next = 12;
                break;
              }

              if (post.likes.find(function (like) {
                return like.username === username;
              })) {
                // Post already likes, unlike it
                post.likes = post.likes.filter(function (like) {
                  return like.username !== username;
                });
              } else {
                // Not liked, like post
                post.likes.push({
                  username: username,
                  createdAt: new Date().toISOString()
                });
              }

              _context5.next = 9;
              return regeneratorRuntime.awrap(post.save());

            case 9:
              return _context5.abrupt("return", post);

            case 12:
              throw new UserInputError('Post not found');

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  },
  Subscription: {
    newPost: {
      subscribe: function subscribe(_, __, _ref5) {
        var pubsub = _ref5.pubsub;
        return pubsub.asyncIterator('NEW_POST');
      }
    }
  }
};