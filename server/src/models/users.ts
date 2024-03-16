import mongoose from "mongoose";



const UsersSchema = new mongoose.Schema({
    fullname: {type: String, required: true, unique: false},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, lowercase: true, trim: true},
    password: {type: String, required: true},

    profileImage: {type: String, required: false},
    backgroundImage: {type: String, required: false},

    private: {type: Boolean, required: false, default: false},

    followers: {type: [mongoose.Schema.ObjectId], ref: "users", required: false, default: []},
    requests: {type: [mongoose.Schema.ObjectId], ref: "users", required: false, default: []},

    bio: {type: String, required: false},
    pronouns: {type: String, required: false},

    location: {type: String, required: false},
    links: {type: [String], required: false},
    
    admin: {type: Boolean, required: false},
});

const UserModel = mongoose.model("users", UsersSchema);
export default UserModel;