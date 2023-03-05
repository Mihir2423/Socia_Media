import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        body: String,
        likes: [{
            username: String,
            createdAt: String
        }],
        comments: [
            {
                body: String,
                username: String,
                createdAt: String
            }
        ],
        image: String,
        username: String,
        userProfilePic: String
    },
    { timestamps: true }
)

export default mongoose.model("Posts", postSchema)