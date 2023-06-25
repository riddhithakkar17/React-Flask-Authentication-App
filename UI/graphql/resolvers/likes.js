const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Posts');
const checkUser = require('../../utils/checkAuth')

module.exports = {
    Mutation: {
        likePost: async(_, { postId }, context) => {
            const user = checkUser(context);
            const post = await Post.findById(postId);

            if (post) {
                if (user) {
                    if (post.likes.find((like) => like.username === user.username)) {
                        //Post already liked, unlike
                        post.likes = post.likes.filter((like) => like.username !== user.username)
                    } else {
                        // Post not like,  
                        post.likes.push({
                            username: user.username,
                            createdAt: new Date().toISOString()
                        })
                    }

                    await post.save()
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}