import GroupModel from "../../models/groups";
import mongoose from "mongoose";



const getGroupMembers = (groupId: string, myId: string, page: number, pageSize: number) => {
    const loggedInUserId = new mongoose.Types.ObjectId(myId);

    return GroupModel.aggregate([
        {$match: {_id: new mongoose.Types.ObjectId(groupId)}},
        {$unwind: "$members"},
        {$lookup: {
            from: "users",
            localField: "members._id",
            foreignField: "_id",
            as: "memberDetails"
        }},
        {$unwind: "$memberDetails"},
        {$project: {
            _id: "$members._id",
            role: "$members.role",
            fullname: "$memberDetails.fullname",
            username: "$memberDetails.username",
            profileImage: "$memberDetails.profileImage",
            isFollowed: {$or: [
                {$in: [loggedInUserId, "$memberDetails.followers"]},
                false
            ]},
            isRequested: {
                $cond: {
                    if: {
                        $and: [
                            {$isArray: "$memberDetails.requests"},
                            {$in: [loggedInUserId, "$memberDetails.requests"]}
                        ]
                    },
                    then: true,
                    else: false
                }
            },
        }},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize},
    ]);
}

export default getGroupMembers;