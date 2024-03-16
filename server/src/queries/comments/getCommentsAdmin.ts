import CommentModel from "../../models/comments";



const getCommentsAdmin = async (page: number, pageSize: number, input: string) => {
    const searchCriteria = {
        $or: [
            {"user.fullname": {$regex: new RegExp(input, "i")}},
            {"user.username": {$regex: new RegExp(input, "i")}},
            {text: {$regex: new RegExp(input, "i")}}
        ]
    };

    return CommentModel.aggregate([
        {$lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "author",
        }},
        {$unwind: "$author"},
        ...input ? [{$match: {
            $and: [
                searchCriteria
            ]
        }}] : [],
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
            },
        }},
        {$sort: {time: -1}},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize}
    ]);
}

export default getCommentsAdmin;