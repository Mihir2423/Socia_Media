import Posts from "../../models/Post"
import checkAuth from "../../utils/check-auth";
import { UserInputError } from "apollo-server";

type Props = {
  postId: string
}
type PostInput = {
  input: {
    body: string
  }
}
interface User {
  id: string;
  username: string
}




type Context = {
  req: {
    headers: {
      authorization: string
    }
  };
}
export const postResolver = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Posts.find()
        return posts
      } catch (error) {
        console.log("Error Occurred", error);
      }
    },
    getPost: async (_: object, args: Props) => {
      const postId = args.postId
      try {
        const post = Posts.findById(postId)
        if (post) {
          return post
        }
        else {
          throw new Error("Post Not Found");

        }
      } catch (error) {
        throw new Error("Error");

      }
    }
  },
  Mutation: {
    createPost: async (_: object, args: PostInput, context: Context) => {
      try {
        const user: User = checkAuth(context);
        const { body } = args.input;
        if (body.trim() === '') {
          throw new Error('Body should not be empty');
        }
        const post = new Posts({
          body,
          userId: user.id,
          username: user.username,
        });
        const newPost = await post.save();
        console.log(newPost);
        return newPost;
      } catch (error) {
        throw new Error('Error creating post');
      }
    },
    deletePost: async (_: object, args: Props, context: Context) => {
      try {
        const user: User = checkAuth(context)
        const postId = args.postId
        const post = await Posts.findById(postId)
        if (post?.username === user.username) {
          await post.deleteOne()
        }
        return "Post deleted Successfully"

      } catch (error) {
        throw new Error('Error creating post');
      }
    },
    likePost: async (_: object, args: Props, context: Context) => {
      const { username } = checkAuth(context)
      const postId = args.postId
      const post = await Posts.findById(postId)
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => like.username !== username)
        }
        else{
          post.likes.push({
            username,
            createdAt : new Date().toISOString()
          })
        }
        await post.save()
        return post
      }
      else {
        throw new UserInputError("Post not found");

      }
    }
  }
};

