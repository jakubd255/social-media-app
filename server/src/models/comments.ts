import mongoose from "mongoose";



const CommentSchema = new mongoose.Schema({
    text: {type: String, required: true},
    postId: {type: mongoose.Schema.ObjectId, ref: "posts"},
    userId: {type: mongoose.Schema.ObjectId, ref: "users", required: true},
    time: {type: Number, required: true},
});

const CommentModel = mongoose.model("comments", CommentSchema);
export default CommentModel;