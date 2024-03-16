import mongoose from "mongoose";
import UserModel from "../../models/users";



const getFollowers = async (profileId: string, myId: string, page: number, pageSize: number) => {
    const userId = new mongoose.Types.ObjectId(profileId);
    const loggedInUserId = new mongoose.Types.ObjectId(myId);

    return UserModel.aggregate([
        {$match: {_id: userId}},
        {$lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers"
        }},
        {$unwind: "$followers"},
        {$replaceRoot: {newRoot: "$followers"}},
        {$addFields: {
            isFollowed: {
                $or: [
                    {$in: [loggedInUserId, "$followers"]},
                    false
                ]
            },
            isRequested: {
                $cond: {
                    if: {
                        $and: [
                            {$isArray: "$requests"},
                            {$in: [loggedInUserId, "$requests"]}
                        ]
                    },
                    then: true,
                    else: false
                }
            },
        }},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize}
    ]);
}

export default getFollowers;