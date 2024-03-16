import mongoose from "mongoose";
import GroupModel from "../../models/groups";
import LinkModel from "../../models/links";



const getGroup = async (id: string, myId: string) => {
    const groupId = new mongoose.Types.ObjectId(id);
    const loggedInUserId = new mongoose.Types.ObjectId(myId);

    return GroupModel.aggregate([
        {$match: {_id: groupId}},
        {$lookup: {
            from: "users",
            localField: "members._id",
            foreignField: "_id",
            as: "members"
        }},
        {$addFields: {
            joined: {$in: [loggedInUserId, "$members._id"]},
            requested: {$in: [loggedInUserId, "$requests"]},
            links: {$ifNull: [await LinkModel.find({groupId: groupId}).exec(), []]}
        }},
        {$project: {
            _id: 1,
            name: 1,
            backgroundImage: 1,
            private: 1,
            hidden: 1,
            members: {$size: "$members"},
            links: 1,
            joined: 1,
            requested: 1,
            privilages: 1,
            rules: 1,
            description: 1
        }},
    ]);
}

export default getGroup;