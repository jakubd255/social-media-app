import GroupModel from "../../models/groups";
import mongoose from "mongoose";



const getRole = async (groupId: string, userId: string) => {
    const group = await GroupModel.findOne(
        {
            _id: new mongoose.Types.ObjectId(groupId), 
            "members._id": new mongoose.Types.ObjectId(userId)
        },
        {
            _id: 1, 
            "members.$": 1, 
            privilages: 1
        }
    ).exec();

    const role = group?.members[0].role || null;
    return role;
}

export default getRole;