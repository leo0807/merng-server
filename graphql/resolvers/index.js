const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
    // parent会保持之前上一步操作所得到的数据
    Post: {
        likeCount: (parent) => parent.likes.length, //点赞数
        commentCount: (parent) => parent.comments.length //评论数
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
};
