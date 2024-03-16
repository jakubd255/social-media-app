import mongoose from "mongoose";
import UserModel from "../../models/users";



const getFollowing = async (profileId: string, myId: string, page: number, pageSize: number) => {
    const userId = new mongoose.Types.ObjectId(profileId);
    const loggedInUserId = new mongoose.Types.ObjectId(myId);

    return UserModel.aggregate([
        {$match: {followers: userId}},
        {$project: {
            fullname: 1,
            username: 1,
            profileImage: 1,
            private: 1,
            followers: 1,
            requests: 1
        }},
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
        {$limit: pageSize},
    ]);
}

export default getFollowing;