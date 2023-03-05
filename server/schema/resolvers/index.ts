import { postResolver } from "./postResolver"
import { userResolver } from "./userResolver"
import { commentResolver } from "./commentResolver"

interface Comments {
    id: string
    username: string
    body: string
    createdAt: string
}

interface Like {
    id: string
    username: string
    createdAt: string
}

interface PostParent {
    likes: Like[];
    comments: Comments[];
}

export default {
    Post: {
        likeCount: (parent: PostParent) => parent.likes.length,
        commentCount: (parent: PostParent) => parent.comments.length
    },
    Query: {
        ...postResolver.Query,
        ...userResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...postResolver.Mutation,
        ...commentResolver.Mutation
    }
}
