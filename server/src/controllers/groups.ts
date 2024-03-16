import {Request, Response} from "express";
import GroupModel from "../models/groups";
import LinkModel from "../models/links";
import PostModel from "../models/posts";
import getGroupMembers from "../queries/users/getGroupMembers";
import getGroupRequests from "../queries/users/getGroupRequests";
import mongoose from "mongoose";
import getGroup from "../queries/groups/getGroup";
import getRole from "../queries/groups/getRole";

const pageSize = 10;



//Create new group
export const add = async (req: Request, res: Response) => {
    let {group} = req.body;
    const {user} = req.body;

    if(!group.private)
        delete group.hidden;

    group.members = [{role: "author", _id: user._id}];
    group.privilages = {
        posting: "all",
        approving: "admin"
    };

    const newGroup = new GroupModel(group);
    await newGroup.save();

    return res.status(201).json({groupId: newGroup._id});
}



//Get all groups which you are member of
export const getAll = async (req: Request, res: Response) => {
    const page = parseInt(String(req.query.page)) || 1;
    const {user} = req.body;

    const groups = await GroupModel.aggregate([
        {$match: {"members._id": new mongoose.Types.ObjectId(user._id)}},
        {$addFields: {membersCount: {$size: "$members"}}},
        {$project: {
            _id: 1,
            name: 1,
            backgroundImage: 1,
            private: 1,
            hidden: 1,
            members: {$size: "$members"}
        }},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize}
    ]);
    return res.status(200).json({groups: groups});
}



//Get chosen group
export const getOne = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {id} = req.params;

    const groups = await getGroup(id, user._id);

    if(groups.length !== 1) {
        return res.status(404).send();
    }
    else {
        const myRole = await getRole(id, user._id);

        return res.status(200).json({group: {...groups[0], myRole}});
    }
}



//Get all groups as admin
export const adminGet = async (req: Request, res: Response) => {
    const page = parseInt(String(req.query.page)) || 1;
    const {input} = req.params;

    const searchCriteria = {
        $or: [
            {name: {$regex: new RegExp(input, "i")}},
            {description: {$regex: new RegExp(input, "i")}}
        ]
    };

    const groups = await GroupModel.find(input ? searchCriteria: {})
    .select("_id name description backgroundImage private hidden")
    .skip((page - 1) * pageSize).limit(pageSize)
    .exec();
    
    const pages = Math.ceil((await GroupModel.countDocuments(input ? searchCriteria: {}))/pageSize);

    return res.status(200).json({groups: groups, pages: pages});
}



//Search group
export const search = async (req: Request, res: Response) => {
    const {input} = req.params;
    const {user} = req.body;
    const page = parseInt(String(req.query.page)) || 1;

    const userId = new mongoose.Types.ObjectId(user._id);

    if(!input) {
        return res.status(200).json({groups: []});
    }

    const searchCriteria = {
        $and: [
            {name: {$regex: new RegExp(input, "i")}},
            {$or: [
                {hidden: {$in: [null, false]}},
                {$and: [
                    {hidden: true},
                    {members: {$elemMatch: {
                        _id: userId}}
                    }
                ]}
            ]
        }]
    };
    const groups = await GroupModel.find(searchCriteria)
    .select("_id name backgroundImage")
    .skip((page - 1) * pageSize).limit(pageSize)
    .exec();

    return res.status(200).json({groups: groups});
}



//Explore groups
export const explore = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {input} = req.params;
    const page = parseInt(String(req.query.page)) || 1;

    const userId = new mongoose.Types.ObjectId(user._id);

    const searchCriteria = {
        $and: [
            ...input ? [{$or: [
                {name: {$regex: new RegExp(input, "i")}},
                {description: {$regex: new RegExp(input, "i")}}
            ]}] : [],
            {$or: [
                {hidden: {$in: [null, false]}},
                {$and: [
                    {hidden: true},
                    {members: {$elemMatch: 
                        {_id: userId}}
                    }
                ]}
            ]}
        ]
    };

    const groups = await GroupModel.aggregate([
        {$match: searchCriteria},
        {$addFields: {membersCount: {$size: "$members"}}},
        {$project: {
                _id: 1,
                name: 1,
                backgroundImage: 1,
                private: 1,
                hidden: 1,
                members: {$size: "$members"}
            }},
        {$skip: (page - 1) * pageSize},
        {$limit: pageSize}
    ]);

    return res.status(200).json({groups: groups});
}



//Get group members
export const getMembers = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {id} = req.params;
    const page = parseInt(String(req.query.page)) || 1;

    const users = await getGroupMembers(id, user._id, page, pageSize);

    return res.status(200).json({users: users});
}



//Get users which have requested to the group
export const getRequests = async (req: Request, res: Response) => {
    const {id} = req.params;
    const page = parseInt(String(req.query.page)) || 1;

    const users = await getGroupRequests(id, page, pageSize);

    return res.status(200).json({users: users});
}



//Edit group
export const edit = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {user, formData} = req.body;
    const data = JSON.parse(formData);

    const role = await getRole(id, user._id);

    if(!(role === "author" || role === "admin")) {
        return res.status(403).send();
    }

    const files = req.files as {[fieldname: string]: Express.Multer.File[]};
    const backgroundImage = (files["backgroundImage"]?.[0]?.path || "") as string;

    let response: any = {};

    if(backgroundImage !== "") {
        data.backgroundImage = backgroundImage;
        response.backgroundImage = backgroundImage;
    }

    await GroupModel.findByIdAndUpdate(id, data).exec();

    return res.status(200).json({images: response});
}



//Change member's role
export const changeRole = async (req: Request, res: Response) => {
    const {user, role: newRole} = req.body;
    const {groupId, userId} = req.params;

    const role = await getRole(groupId, user._id);

    if(!(role === "author" || role === "admin")) {
        return res.status(403).send();
    }

    const result = await GroupModel.updateOne(
        {_id: groupId, "members._id": userId, "members.role": {$ne: "author"}},
        {$set: {"members.$.role": newRole}}
    );

    if(result?.modifiedCount === 0) {
        return res.status(404).send();
    }

    return res.status(200).send();
}



//Join/request to group or abandon
export const join = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {id} = req.params;

    const group = await GroupModel.findById(id).select("_id private hidden").exec();

    if(!group) {
        return res.status(404).send();
    }

    const groupId = new mongoose.Types.ObjectId(id);
    const userId = new mongoose.Types.ObjectId(user._id);

    //If group is public
    if(!group.private) {
        const result = await GroupModel.updateOne(
            {_id: groupId, "members._id": {$ne: userId}},
            {$addToSet: {members: {_id: userId}}}
        ).exec();

        //If users is already in the group - remove from members
        if(result.modifiedCount === 0) {
            await GroupModel.updateOne(
                {_id: groupId, "members._id": userId},
                {$pull: {members: {_id: userId}}}
            ).exec();
        }
    }
    //If group is private
    else if(group.private && !group.hidden) {
        const result = await GroupModel.updateOne(
            {_id: groupId, private: true, requests: {$ne: userId}},
            {$addToSet: {requests: userId}}
        ).exec();

        //If user has already requested - remove from requests
        if(result.modifiedCount === 0) {
            await GroupModel.updateOne(
                {_id: groupId, private: true, requests: userId},
                {$pull: {requests: userId}}
            ).exec();
        }
    }

    return res.status(200).send();
}



//Join to hidden group by link
export const joinToHidden = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {linkId} = req.params;

    const link = await LinkModel.findById(linkId).exec();
    if(!link) {
        return res.status(404).send();
    }

    const group = await GroupModel.findById(link.groupId).select("_id").exec();
    if(!group) {
        return res.status(404).send();
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const result = await GroupModel.updateOne(
        {_id: group._id, "members._id": {$ne: userId}},
        {$addToSet: {members: {_id: userId}}}
    ).exec();

    if(result.modifiedCount === 0) {
        return res.status(409).send();
    }

    return res.status(200).json({id: group._id});
}



//Accept new member
export const accept = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {choice} = req.body;
    const {groupId, userId} = req.params;

    const group = await GroupModel.findOne(
        {
            _id: new mongoose.Types.ObjectId(groupId), 
            "members._id": new mongoose.Types.ObjectId(user._id)
        },
        {
            _id: 1,
            privilages: 1,
            "members.$": 1
        }
    ).exec();

    if(!group) {
        return res.status(400).send();
    }

    const role = group.members[0].role || null;
    const {approving} = group.privilages;
    let canApprove = false;

    if(approving === "all" || (approving === "mod" && role) || role === "admin" || role === "author") {
        canApprove = true;
    }

    if(canApprove) {
        let query;
        
        if(choice) {
            query = {
                $push: {members: {_id: new mongoose.Types.ObjectId(userId)}}, 
                $pull: {requests: new mongoose.Types.ObjectId(userId)}
            };
        }
        else {
            query = {$pull: {requests: new mongoose.Types.ObjectId(userId)}};
        }

        await GroupModel.findByIdAndUpdate(groupId, query).exec();

        return res.status(200).send();
    }
    else {
        return res.status(403).send();
    }
}



//Remove user from group
export const removeMember = async (req: Request, res: Response) => {    
    const {user} = req.body;
    const {groupId, userId} = req.params;

    const role = await getRole(groupId, user._id);

    if(!(role === "author" || role === "admin")) {
        return res.status(403).send();
    }

    await GroupModel.findByIdAndUpdate(groupId, {$pull: {members: {_id: userId}}}).exec();

    return res.status(200).send();
}



//Remove group
export const remove = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {id} = req.params;

    const role = await getRole(id, user._id);

    if(role !== "author") {
        return res.status(403).send();
    }

    const group = await GroupModel.findByIdAndDelete(id).select("_id").exec();

    if(!group) {
        return res.status(404).send();
    }

    await PostModel.deleteMany({groupId: group._id}).exec();

    return res.status(200).send();
}