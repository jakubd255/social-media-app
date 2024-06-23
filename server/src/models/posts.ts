import mongoose from "mongoose";



const PostSchema = new mongoose.Schema({
    text: {type: String, required: false},
    files: {type: [String], required: false},
    survey: {type: {
        open: Boolean,
        choices: [{
            text: String,
            votes: {type: [mongoose.Schema.ObjectId], ref: "users", unique: true}
        }]
    }, required: false},

    userId: {type: mongoose.Schema.ObjectId, required: true, ref: "users"},
    groupId: {type: mongoose.Schema.ObjectId, required: false, ref: "groups"},

    likes: {type: [mongoose.Schema.ObjectId], default: [], ref: "users"},
    saves: {type: [mongoose.Schema.ObjectId], ref: "users", default: []},

    time: {type: Number, required: true},
});

const PostModel = mongoose.model("posts", PostSchema);

export default PostModel;