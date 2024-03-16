import mongoose from "mongoose";
import UserModel from "../../models/users";



const getUserRequests = async (profileId: string, myId: string, page: number, pageSize: number) => {
    const userId = new mongoose.Types.ObjectId(profileId);
    const loggedInUserId = new mongoose.Types.ObjectId(myId);

    return UserModel.aggregate([
        {$match: {_id: userId}},
        {$graphLookup: {
            from: "users",
            startWith: "$requests",
            connectFromField: "requests",
            connectToField: "_id",
            as: "userRequests"
        }},
        {$unwind: "$userRequests"},
        {$replaceRoot: {newRoot: "$userRequests"}},
        {$match: {_id: {$ne: userId}}},
        {$addFields: {
            requestedMe: true
        }},
        {$project: {
            _id: 1,
            fullname: 1,
            username: 1,
            profileImage: 1,
            private: 1,
            requestedMe: 1
        }},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize},
    ]);
}

export default getUserRequests;