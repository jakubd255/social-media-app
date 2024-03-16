import UserModel from "../../models/users";
import mongoose from "mongoose";



const getProfile = async (profileId: string, myId: string) => {
    const userId = new mongoose.Types.ObjectId(profileId);
    const loggedInUserId = new mongoose.Types.ObjectId(myId);

    const following = await UserModel.count({followers: {$in: [profileId]}}).exec();

    return UserModel.aggregate([
        {$match: {_id: userId}},
        {$lookup: {
            from: "users",
            localField: "_id",
            foreignField: "requests",
            as: "userMe"
        }},
        {$unwind: {
            path: "$userMe",
            preserveNullAndEmptyArrays: true
        }},
        {$project: {
            _id: 1,
            fullname: 1,
            username: 1,
            email: 1,
            password: 1,
            profileImage: 1,
            backgroundImage: 1,
            groups: 1,
            private: 1,
            followers: {$ifNull: ["$followers", []]},
            requests: {$ifNull: ["$requests", []]},
            bio: 1,
            pronouns: 1,
            location: 1,
            links: 1,
            admin: 1,
            isFollowed: {
                $cond: {
                    if: {$in: [loggedInUserId, {$ifNull: ["$followers", []]}]},
                    then: true,
                    else: false
                }
            },
            isRequested: {
                $cond: {
                    if: {$in: [loggedInUserId, {$ifNull: ["$requests", []]}]},
                    then: true,
                    else: false
                }
            },
            requestedMe: {
                $cond: {
                    if: {$eq: ["$userMe._id", loggedInUserId]},
                    then: true,
                    else: false
                }
            }
        }},
        {$addFields: {
            followers: {$size: "$followers"},
            requests: {$size: "$requests"},
            following: following
        }}
    ]);
}

export default getProfile;