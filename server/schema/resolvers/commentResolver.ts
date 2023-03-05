import Posts from "../../models/Post"
import checkAuth from "../../utils/check-auth";
import { AuthenticationError, UserInputError } from "apollo-server"

type Props = {
    postId: string
    body: string
}
type DeleteComment = {
    postId: string
    commentID: string
    id: string
}

type Context = {
    req: {
        headers: {
            authorization: string
        }
    };
}

export const commentResolver = {
    Mutation: {
        createComment: async (_: object, args: Props, context: Context) => {
            const { username } = checkAuth(context)
            const body = args.body
            const postId = args.postId
            if (body === "") {
                throw new UserInputError("Comment is empty", {
                    errors: {
                        body: "Comments must not be empty"
                    }
                })
            }
            const post = await Posts.findById(postId)
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save()
                return post
            }
            else {
                throw new UserInputError("Post not found")
            }
        },
        deleteComment: async (_: object, args: DeleteComment, context: Context) => {
            const { username } = checkAuth(context);
            const postId = args.postId;
            const commentID = args.commentID; // Fix typo in variable name
            const post = await Posts.findById(postId);
            if (post) {
                const commentIndex = post.comments.findIndex((c : any) => c.id && c.id.toString() === commentID);
                if (commentIndex === -1) {
                    throw new UserInputError("Comment not found");
                }
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError("Not allowed");
                }
            } else {
                throw new UserInputError("Post not found");
            }
        }

    }
}