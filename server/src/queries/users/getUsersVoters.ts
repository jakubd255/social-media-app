import PostModel from "../../models/posts";
import mongoose from "mongoose";



const getUsersVoters = (postId: string, myId: string, index: number, page: number, pageSize: number) => {
    const loggedInUserId = new mongoose.Types.ObjectId(myId);

    return PostModel.aggregate([
        {$match: {_id: new mongoose.Types.ObjectId(postId)}},
        {$project: {
            users: {
                $filter: {
                    input: {
                        $map: {
                            input: {$arrayElemAt: ["$survey.choices.votes", index]},
                            as: "vote",
                            in: {$toObjectId: "$$vote"}
                        }
                    },
                    as: "userId",
                    cond: {$ne: ["$$userId", null]}
                }
            }
        }},
        {$lookup: {
            from: "users",
            localField: "users",
            foreignField: "_id",
            as: "userDetails"
        }},
        {$unwind: "$userDetails"},
        {$project: {
            _id: "$userDetails._id",
            fullname: "$userDetails.fullname",
            username: "$userDetails.username",
            profileImage: "$userDetails.profileImage",
            isFollowed: {$or: [
                    {$in: [loggedInUserId, "$userDetails.followers"]},
                    false
                ]},
            isRequested: {
                $cond: {
                    if: {
                        $and: [
                            {$isArray: "$userDetails.requests"},
                            {$in: [loggedInUserId, "$userDetails.requests"]}
                        ]
                    },
                    then: true,
                    else: false
                }
            },
        }},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize}
    ]).exec();
}

export default getUsersVoters;