import mongoose from "mongoose";



const GroupSchema = new mongoose.Schema({
    name: {type: String, required: true},
    private: {type: Boolean, required: true},
    hidden: {type: Boolean, required: false},

    members: {type: [{
        _id: {type: mongoose.Schema.ObjectId, ref: "users", required: true},
        role: {type: String, enum: ["author", "admin", "mod", null], required: false}
    }], required: true},
    
    backgroundImage: {type: String, required: false},
    description: {type: String, required: false},
    
    rules: {type: [Object], required: false},
    privilages: {type: {
        posting: {type: String, enum: ["admin", "mod", "all"]},
        approving: {type: String, enum: ["admin", "mod", "all"]},
    }, required: true},

    requests: {type: [mongoose.Schema.ObjectId], ref: "users", required: false}
});

const GroupModel = mongoose.model("groups", GroupSchema);
export default GroupModel;