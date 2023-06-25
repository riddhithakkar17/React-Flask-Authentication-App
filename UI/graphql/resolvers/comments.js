const { UserInputError, AuthenticationError } = require("apollo-server");

const Post = require("../../models/Posts");
const checkAuth = require("../../utils/checkAuth");
const checkUser = require("../../utils/checkAuth");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const user = checkUser(context);

      if (body.trim() === "") {
        throw new UserInputError("Comment empty", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString(),
        });

        console.log(post.comments[0]);
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const user = checkUser(context);
      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);

        // Post user and Comment User both can delete the comment
        if (
          post.comments[commentIndex].username === user.username ||
          post.username === user.username
        ) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};
