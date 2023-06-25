const postResolvers = require('./posts')
const userResolvers = require('./users')
const commentResolvers = require('./comments')
const likeResolvers = require('./likes')

module.exports = {
    Post: {
        likeCount: (parent) => postResolvers.likes.length,
        commentCount: (parent) => postResolvers.comments.length
    },
    Query: {
        ...postResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...likeResolvers.Mutation
    },
    Subscription: {
        ...postResolvers.Subscription
    }
}