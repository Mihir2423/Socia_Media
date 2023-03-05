import { gql } from "apollo-server";

export const typeDefs = gql`
  type Post {
    id: ID!
    body : String!
    userId : String!
    username: String
    comments : [Comments]
    likes : [Like]!
    likeCount : Int
    commentCount : Int
    createdAt : String
  }
  type User{
    id: ID!
    email: String!
    token: String
    username: String
    createdAt : String
    updatedAt : String
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type Comments{
    id: ID
    username : String
    body : String
    createdAt : String
  }
  input RegisterInput{
    username : String!
    password : String!
    confirmPassword : String
    email : String!
  }
  input LoginInput{
    username : String!
    password : String!
  }
  input PostInput{
    body : String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId : ID!) : Post
    getUser: [User]!
  }
  type Mutation {
    registerUser(input : RegisterInput) : User!
    loginUser(input : LoginInput) : User!
    createPost(input : PostInput) : Post
    deletePost(postId : ID!)  : String
    createComment(postId : ID!, body : String) : Post
    deleteComment(postId : ID!, commentID : ID!) : Post
    likePost(postId : ID!) : Post
  }
`;

