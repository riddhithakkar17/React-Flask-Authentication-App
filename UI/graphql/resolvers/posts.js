const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/Posts')
const checkUser = require('../../utils/checkAuth')

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 })
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },

    Mutation: {
        async createPost(_, { body }, context) {
            //Check token for Logged User
            const user = checkUser(context)

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save()
            context.pubsub.publish('NEW_POST', {
                newPost: post
            });

            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkUser(context);
            try {
                const post = await Post.findById(postId)
                if (user.username === post.username) {
                    await post.delete();
                    return 'Post deleted';
                } else {
                    throw new AuthenticationError('You cant delete this post')
                }
            } catch (err) {
                throw new Error(err)
            }


        }
    },
    //For refreshing post feed everytime when there is a new post
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}