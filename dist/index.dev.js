"use strict";

var _require = require('apollo-server'),
    ApolloServer = _require.ApolloServer,
    PubSub = _require.PubSub;

var mongoose = require('mongoose'); // 获取 MongoDB链接配置


var _require2 = require('./config'),
    MONGODB = _require2.MONGODB;

var pubsub = new PubSub();

var typeDefs = require('./graphql/typeDefs');

var resolvers = require('./graphql/resolvers');

var server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: function context(_ref) {
    var req = _ref.req;
    return {
      req: req,
      pubsub: pubsub
    };
  } //直接在 context访问request body

});
mongoose.connect(MONGODB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(function () {
  console.log('MongoDB Connected');
  return server.listen({
    port: 5000
  });
}).then(function (res) {
  console.log("Server runnning at ".concat(res.url));
});