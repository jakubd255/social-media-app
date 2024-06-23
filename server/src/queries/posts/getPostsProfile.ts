import PostModel from "../../models/posts";
import mongoose from "mongoose";



const getPostsProfile = async (myId: string, profileId: string, page: number, pageSize: number) => {
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
        {$match: {
            $and: [
                {"userId": new mongoose.Types.ObjectId(profileId)},
                {"groupId": {$exists: false}},
                {
                    $or: [
                        {"author.private": false },
                        {
                            "author.private": true,
                            "author.followers": loggedInUserId
                        },
                        {"userId": loggedInUserId}
                    ]
                },
            ]
        }},
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

        {$project: {
            _id: 1,
            text: 1,
            files: 1,
            comments: 1,
            likes: 1,
            isLiked: 1,
            isSaved: 1,
            time: 1,
            userId: 1,
            user: {
                _id: "$author._id",
                fullname: "$author.fullname",
                username: "$author.username",
                profileImage: "$author.profileImage",
            },
            survey: 1,
        }},
        {$sort: {time: -1}},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize},
    ]).exec();
}

export default getPostsProfile;