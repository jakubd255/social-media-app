import PostModel from "../../models/posts";



const getPostsAdmin = async (page: number, pageSize: number, input: string) => {
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
            $or: [
                {text: {$regex: new RegExp(input, "i")}},
                {"author.username": {$regex: new RegExp(input, "i")}},
                {"author.fullname": {$regex: new RegExp(input, "i")}}
            ]
        }},
        {$addFields: {
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
        }},
        {$sort: {time: -1}},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize},
    ]).exec();
}

export default getPostsAdmin;