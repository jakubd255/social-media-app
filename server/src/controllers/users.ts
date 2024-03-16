import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/users";
import bcrypt from "bcrypt";
import PostModel from "../models/posts";
import CommentModel from "../models/comments";
import GroupModel from "../models/groups";
import getProfile from "../queries/users/getProfile";
import getFollowing from "../queries/users/getFollowing";
import getFollowers from "../queries/users/getFollowers";
import getUserRequests from "../queries/users/getUserRequests";
import getUsersExplore from "../queries/users/getUsersExplore";
import mongoose from "mongoose";

const pageSize = 10;



//Get your data or get chosen user's data
export const getUser = async (req: Request, res: Response) => {
    const {id} = req.params;

    if(!id) {
        const user = await UserModel.findById(req.body.user._id)
        .select("_id username fullname email profileImage admin").exec();

        return res.status(200).json({user: user});
    }
    else {
        const users = await getProfile(id, req.body.user._id);

        if(users.length !== 1) {
            return res.status(404).send();
        }
        else {
            return res.status(200).json({user: users[0]});
        }
    }
}



//Get all users as admin
export const adminGet = async (req: Request, res: Response) => {
    const page = parseInt(String(req.query.page)) || 1;
    const {input} = req.params;

    const searchCriteria = {
        $or: [
            {fullname: {$regex: new RegExp(input, "i")}},
            {username: {$regex: new RegExp(input, "i")}}
        ]
    };

    const users = await UserModel.find(input ? searchCriteria : {})
    .select("_id username fullname email private role profileImage admin")
    .skip((page-1)*pageSize).limit(pageSize)
    .exec();

    const pages = Math.ceil((await UserModel.countDocuments(input ? searchCriteria : {}))/pageSize);

    return res.status(200).json({users: users, pages: pages});
}



//Get followers, following and requests
export const getFollowUsers = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {option, id} = req.params;
    const page = parseInt(String(req.query.page)) || 1;

    if(option == "following") {
        const users = await getFollowing(id, user._id, page, pageSize);

        return res.status(200).json({users: users});
    }
    else if(option == "followers") {
        const users = await getFollowers(id, user._id, page, pageSize);

        return res.status(200).json({users: users});
    }
    else if(option == "requests") {
        const users = await getUserRequests(id, user._id, page, pageSize);

        return res.status(200).json({users: users});
    }

    return res.status(404).send();
}



//Search users
export const search = async (req: Request, res: Response) => {
    const {input} = req.params;
    const page = parseInt(String(req.query.page)) || 1;

    if(!input)
        return res.status(200).json({users: []});

    const searchCriteria = {
        $or: [
            {fullname: {$regex: new RegExp(input, "i")}},
            {username: {$regex: new RegExp(input, "i")}}
        ]
    };
    const users = await UserModel.find(searchCriteria)
    .select("_id fullname username profileImage")
    .skip((page - 1) * pageSize).limit(pageSize)
    .exec();

    return res.status(200).json({users: users});
}



//Explore users
export const explore = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {input} = req.params;
    const page = parseInt(String(req.query.page)) || 1;

    const users = await getUsersExplore(user._id, input, page, pageSize);

    return res.status(200).json({users: users});
}



//Update your account
export const edit = async (req: Request, res: Response) => {
    const {formData, user} = req.body;
    const data = JSON.parse(formData);

    const files = req.files as {[fieldname: string]: Express.Multer.File[]};

    const profileImage = (files["profileImage"]?.[0]?.path || "") as string;
    const backgroundImage = (files["backgroundImage"]?.[0]?.path || "") as string;

    let response: any = {};

    if(profileImage !== "") {
        data.profileImage = profileImage;
        response.profileImage = profileImage;
    }
    if(backgroundImage !== "") {
        data.backgroundImage = backgroundImage;
        response.backgroundImage = backgroundImage;
    }

    await UserModel.findByIdAndUpdate(user._id, data).exec();

    return res.status(200).json({images: response});
}



//Follow user or cancel following
export const follow = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {id} = req.params;

    const userToFollow = await UserModel.findById(id).select("_id private").exec();

    if(!userToFollow) {
        return res.status(404).send();
    }

    //If user account is public
    if(!userToFollow.private) {
        const followedUser = await UserModel.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(id), followers: {$ne: new mongoose.Types.ObjectId(user._id)}},
            {$addToSet: {followers: new mongoose.Types.ObjectId(user._id)}}
        ).exec();

        if(!followedUser) {
            await UserModel.findOneAndUpdate(
                {_id: new mongoose.Types.ObjectId(id), followers: new mongoose.Types.ObjectId(user._id)},
                {$pull: {followers: new mongoose.Types.ObjectId(user._id)}}
            ).exec();
        }
    }
    //If user account is private
    else {
        const requestedUser = await UserModel.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(id), requests: {$ne: new mongoose.Types.ObjectId(user._id)}},
            {$addToSet: {requests: new mongoose.Types.ObjectId(user._id)}}
        ).exec();

        if(!requestedUser) {
            await UserModel.findOneAndUpdate(
                {_id: new mongoose.Types.ObjectId(id), requests: new mongoose.Types.ObjectId(user._id)},
                {$pull: {requests: new mongoose.Types.ObjectId(user._id)}}
            ).exec();
        }
    }

    return res.status(200).send();
}



//Accept follow request - if your account is private
export const accept = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {choice} = req.body;
    const {id} = req.params;

    let query;
    if(choice) {
        query = {$push: {followers: id}, $pull: {requests: id}};
    }
    else {
        query = {$pull: {requests: id}};
    }

    await UserModel.findByIdAndUpdate(user._id, query).exec();

    return res.status(200).send();
}



//Update your email
export const updateEmail = async (req: Request, res: Response) => {
    const {user, email, username} = req.body;
    const userId = new mongoose.Types.ObjectId(user._id);

    const emailTaken = (await UserModel.exists({_id: userId, email: user.email}).exec()) || user.email === "admin@admin.com";
    const usernameTaken = (await UserModel.exists({_id: userId, username: user.username}).exec()) || user.username === "admin";

    if(emailTaken || usernameTaken) {
        return res.status(409).json({
            emailTaken: !!emailTaken,
            usernameTaken: !!usernameTaken
        });
    }

    await UserModel.findByIdAndUpdate(user._id, {email: email, username: username}).exec();
    
    return res.status(200).send();
}



//Update your password
export const updatePassword = async (req: Request, res: Response) => {
    const {user, currentPassword, newPassword} = req.body;

    const hash = (await UserModel.findById(user._id).select("password").exec())?.password || null;

    if(!hash) {
        return res.status(404).send();
    }

    const isCorrect = bcrypt.compareSync(currentPassword, hash);

    if(isCorrect)
    {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const newHash = bcrypt.hashSync(newPassword, salt);
        await UserModel.findByIdAndUpdate(user._id, {password: newHash}).exec();

        return res.status(200);
    }
    else {
        return res.status(403).json({invalid: true});
    }
}



//Remove your account or any user as admin
export const remove = async (req: Request, res: Response) => {
    const {id} = req.params;

    const userId = new mongoose.Types.ObjectId(id);

    const userMe = await UserModel.findById(req.body.user._id).select("_id admin").exec();
    
    if(userMe?.admin || userMe?._id.equals(id)) {
        UserModel.findByIdAndDelete(userId).exec();

        PostModel.deleteMany({userId: userId}).exec();
        CommentModel.deleteMany({userId: userId}).exec();

        PostModel.updateMany(
            {userId: userId}, 
            {$pull: {"survey.choices.$[].votes": userId}},
            {multi: true}
        ).exec();
        PostModel.updateMany(
            {userId: userId},
            {$pull: {
                likes: userId,
                saves: userId
            }}
        ).exec();
        
        GroupModel.updateMany(
            {"members._id": userId}, 
            {$pull: {
                members: {_id: userId},
                requests: userId
            }}
        ).exec();

        await UserModel.findOneAndUpdate(
            {_id: userMe._id},
            {$pull: {
                followers: userId, 
                requests: userId
            }}
        ).exec();

        return res.status(200).send();
    }
    else return res.status(403).send();
}