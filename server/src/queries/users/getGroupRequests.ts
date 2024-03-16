import GroupModel from "../../models/groups";
import mongoose from "mongoose";



const getGroupRequests = (groupId: string, page: number, pageSize: number) => {
    return GroupModel.aggregate([
        {$match: {_id: new mongoose.Types.ObjectId(groupId)}},
        {$addFields: {
            requestsAsObjectId: {
                $map: {
                    input: "$requests",
                    as: "requestId",
                    in: {$toObjectId: "$$requestId"}
                }
            }
        }},
        {$lookup: {
            from: "users",
            localField: "requestsAsObjectId",
            foreignField: "_id",
            as: "requestingUsers"
        }},
        {$unwind: "$requestingUsers"},
        {$project: {
            _id: "$requestingUsers._id",
            username: "$requestingUsers.username",
            fullname: "$requestingUsers.fullname",
            profileImage: "$requestingUsers.profileImage",
        }},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize},
    ]);
}

export default getGroupRequests;