"use strict";

var _require = require('apollo-server'),
    ApolloServer = _require.ApolloServer,
    PubSub = _require.PubSub;

var mongoose = require('mongoose');

var typeDefs = require('./graphql/typeDefs');

var resolvers = require('./graphql/resolvers');

var _require2 = require('./config.js'),
    MONGODB = _require2.MONGODB;

var pubsub = new PubSub();
var PORT = process.env.port || 5000;
var server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: function context(_ref) {
    var req = _ref.req;
    return {
      req: req,
      pubsub: pubsub
    };
  }
});
mongoose.connect(MONGODB, {
  useNewUrlParser: true
}).then(function () {
  console.log('MongoDB Connected');
  return server.listen({
    port: PORT
  });
}).then(function (res) {
  console.log("Server running at ".concat(res.url));
})["catch"](function (err) {
  console.error(err);
});