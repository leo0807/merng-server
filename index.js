const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

// 获取 MongoDB链接配置
const { MONGODB } = require('./config');

const pubsub = new PubSub();
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }) //直接在 context访问request body
});
mongoose.connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({ port: 5000 });
    }).then(res => {
        console.log(`Server runnning at ${res.url}`);
    })