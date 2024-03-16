import PostModel from "../../models/posts";
import mongoose from "mongoose";



const getPostsSaved = async (myId: string, page: number, pageSize: number) => {
    const loggedInUserId = new mongoose.Types.ObjectId(myId);

    return await PostModel.aggregate([
        {$lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "author",
        }},
        {$unwind: "$author"},
        {$lookup: {
            from: "groups",
            localField: "groupId",
            foreignField: "_id",
            as: "groupData",
        }},
        {$unwind: {
            path: "$groupData",
            preserveNullAndEmptyArrays: true,
        }},
        {$lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "postId",
            as: "comment",
        }},
        {$addFields: {comments: {$size: "$comment"}}},
        {$match: {"saves": {$in: [loggedInUserId]}}},
        {$addFields: {
            isLiked: {
                $in: [loggedInUserId, "$likes"],
            },
            isSaved: {
                $in: [loggedInUserId, "$saves"]
            },
            likes: {
                $size: "$likes",
            },
            survey: {
                $cond: {
                    if: {
                        $and: [
                            {$isArray: "$survey.choices"},
                            {$gt: [{$size: "$survey.choices"}, 0]},
                        ],
                    },
                    then: {
                        open: "$survey.open",
                        choices: {
                            $map: {
                                input: "$survey.choices",
                                as: "choice",
                                in: {
                                    text: "$$choice.text",
                                    votes: {$size: {$ifNull: ["$$choice.votes", []]}},
                                },
                            },
                        },
                        myVote: {
                            $indexOfArray: [
                                {
                                    $map: {
                                        input: "$survey.choices",
                                        as: "choice",
                                        in: {
                                            $cond: [
                                                {$in: [loggedInUserId, "$$choice.votes"]},
                                                1,
                                                0,
                                            ],
                                        },
                                    },
                                },
                                1,
                            ],
                        },
                        votesCount: {
                            $sum: {
                                $map: {
                                    input: "$survey.choices",
                                    as: "choice",
                                    in: {$size: {$ifNull: ["$$choice.votes", []]}},
                                },
                            },
                        },
                    },
                    else: null,
                },
            },
        }},
        //User's role
        {$lookup: {
            from: "groups",
            let: {groupId: "$groupId", userId: loggedInUserId},
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
            let: {authorId: "$author._id", groupId: "$groupId"},
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
            images: 1,
            comments: 1,
            likes: 1,
            isLiked: 1,
            isSaved: 1,
            time: 1,
            userId: 1,
            groupId: 1,
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
                                                cond: { $eq: ["$$member._id", "$author._id"] },
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
            group: {
                $cond: {
                    if: {
                        $or: [
                            {$eq: ["$groupId", null]},
                            {$not: { $gt: ["$groupId", null]}},
                        ],
                    },
                    then: null,
                    else: {
                        _id: "$groupData._id",
                        name: "$groupData.name",
                        backgroundImage: "$groupData.backgroundImage",
                    },
                },
            },
            survey: 1,
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
        {$limit: pageSize},
    ]).exec();
}

export default getPostsSaved;