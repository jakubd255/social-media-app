import UserModel from "../../models/users";
import mongoose from "mongoose";



const getUsersExplore = (myId: string, input: string, page: number, pageSize: number) => {
    const loggedInUserId = new mongoose.Types.ObjectId(myId);

    return UserModel.aggregate([
        {$match: {
            _id: {$ne: loggedInUserId},
            ...(input && {
                $or: [
                    {fullname: {$regex: new RegExp(input, "i")}},
                    {username: {$regex: new RegExp(input, "i")}}
                ]
            })
        }},
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

export default getUsersExplore;