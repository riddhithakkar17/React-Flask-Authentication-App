const { gql } = require('apollo-server')
module.exports = gql `
    
    type Post{
        id: ID!,
        body: String!,
        fitness: [FitnessDetails]!,
        username: String!,
        createdAt:String!,
        comments:[Comment]!,
        likes:[Like]!,
        likeCount:Int!,
        commentCount: Int!
    }
    type FitnessDetails{
        heartPts: Int!,
        steps: Int!,
        cal: Int!,
        km: Int!,   
    }
    type Comment{
        id: ID!,
        body: String!,
        username: String!, 
        createdAt: String!
    }
    type Like{
        id: ID!,
        username:String!,
        createdAt:String!
    }
    type User {
        id: ID,
        email: String!,
        token: String!,
        username: String!,
        createdAt: String!
    }
    input RegisterInput{
        username:String!,
        password: String!,
        confirmPassword: String!,
        email: String!
    }
    
    type Query{
        getPosts:[Post]
        getPost(postId: ID!):Post
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password : String!): User!
        createPost(body: String!):Post!
        deletePost(postId: ID!): String!
        createComment(body:String!, postId: String!): Post!
        deleteComment(postId:ID!, commentId:ID!): Post!
        likePost(postId: ID!): Post!
    }
    type Subscription{
        newPost:Post!
    }
`;