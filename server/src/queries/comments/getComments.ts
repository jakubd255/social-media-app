import CommentModel from "../../models/comments";
import mongoose from "mongoose";



const getComments = async (postId: string, myId: string, page: number, pageSize: number) => {
    const loggedInUserId = new mongoose.Types.ObjectId(myId);

    return CommentModel.aggregate([
        {$match: {postId: new mongoose.Types.ObjectId(postId)}},
        {$lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "author",
        }},
        {$unwind: "$author"},
        {$lookup: {
            from: "posts",
            localField: "postId",
            foreignField: "_id",
            as: "post"
        }},
        {$unwind: "$post"},
        {$lookup: {
            from: "groups",
            localField: "post.groupId",
            foreignField: "_id",
            as: "groupData",
        }},
        {$unwind: {
            path: "$groupData",
            preserveNullAndEmptyArrays: true,
        }},
        //User's role
        {$lookup: {
            from: "groups",
            let: {groupId: "$post.groupId", userId: myId},
            pipeline: [
                {$match: {
                        $expr: {
                            $and: [
                                {$eq: ["$_id", "$$groupId"]},
                                {$in: [loggedInUserId, "$members._id"]},
                            ],
                        },
                    }},
                {$unwind: "$members"},
                {$match: {"members._id": loggedInUserId}},
            ],
            as: "userGroup",
        }},
        {$unwind: {path: "$userGroup", preserveNullAndEmptyArrays: true}},
        //Author's role
        {$lookup: {
            from: "groups",
            let: {authorId: "$author._id", groupId: "$post.groupId"},
            pipeline: [
                {$match: {
                    $expr: {
                        $and: [
                            {$eq: ["$_id", "$$groupId"]},
                            {$in: ["$$authorId", "$members._id"]},
                        ],
                    },
                }},
                {$unwind: "$members"},
                {$match: {"members._id": "$$authorId"}},
            ],
            as: "authorGroup",
        }},
        {$project: {
            _id: 1,
            text: 1,
            time: 1,
            postId: 1,
            userId: 1,
            user: {
                _id: "$author._id",
                fullname: "$author.fullname",
                username: "$author.username",
                profileImage: "$author.profileImage",
                role: {
                    $let: {
                        vars: {
                            authorGroup: {
                                $ifNull: [
                                    {$first: {
                                        $filter: {
                                            input: "$groupData.members",
                                            as: "member",
                                            cond: {$eq: ["$$member._id", "$author._id"]},
                                        },
                                    }},
                                    null,
                                ],
                            },
                        },
                        in: "$$authorGroup.role",
                    },
                },
            },
            myRole: {
                $cond: {
                    if: {$ne: ["$userGroup", null]},
                    then: "$userGroup.members.role",
                    else: null,
                },
            }
        }},
        {$sort: {time: -1}},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize}
    ]);
}

export default getComments;