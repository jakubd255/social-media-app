import mongoose from "mongoose";



const LinkSchema = new mongoose.Schema({
    groupId: {type: mongoose.Schema.ObjectId, ref: "groups", required: true},
    expirationTime: {
        type: Date,
        required: false,
        index: {expires: 1},
    },
});

const LinkModel = mongoose.model("links", LinkSchema);
export default LinkModel;