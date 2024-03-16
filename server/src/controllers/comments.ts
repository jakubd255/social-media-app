import {Request, Response} from "express";
import CommentModel from "../models/comments";
import getComments from "../queries/comments/getComments";
import getCommentsAdmin from "../queries/comments/getCommentsAdmin";
import PostModel from "../models/posts";
import UserModel from "../models/users";
import mongoose from "mongoose";
import getRole from "../queries/groups/getRole";

const pageSize = 10;



//Add new comment
export const add = async (req: Request, res: Response) => {
    const {user, comment} = req.body;

    comment.userId = user._id;

    const newComment = new CommentModel(comment);
    await newComment.save();

    return res.status(201).json({id: newComment._id});
}



//Get comments of the post
export const get = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {postId} = req.params;
    const page = parseInt(String(req.query.page)) || 1;

    const comments = await getComments(postId, user._id, page, pageSize);

    return res.status(200).json({comments: comments});
}



//Get all as admin
export const adminGet = async (req: Request, res: Response) => {
    const page = parseInt(String(req.query.page)) || 1;
    const {input} = req.params;

    const searchCriteria = {
        $or: [
            {"user.fullname": {$regex: new RegExp(input, "i")}},
            {"user.username": {$regex: new RegExp(input, "i")}},
            {text: {$regex: new RegExp(input, "i")}}
        ]
    };

    const comments = await getCommentsAdmin(page, pageSize, input);

    const pages = Math.ceil(await CommentModel.countDocuments(input ? searchCriteria: {})/pageSize);

    return res.status(200).json({comments, pages: pages});
}



//Remove comment
export const remove = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {id} = req.params;

    const comments = await CommentModel.aggregate([
        {$lookup: {
            from: "posts",
            localField: "postId",
            foreignField: "_id",
            as: "post"
        }},
        {$unwind: "$post"},
        {$match: {_id: new mongoose.Types.ObjectId(id)}},
        {$project: {
            _id: 1,
            userId: 1,
            post: {
                _id: "$post._id",
                userId: "$post.userId"
            }
        }}
    ]).exec();

    if(!comments.length) {
        return res.status(404).send();
    }

    const comment = comments[0];
    console.log(comment);
    let canDelete = false;

    //If you're comment's author
    if(comment.userId.equals(user._id)) {
        canDelete = true;
    }
    //If you're post's author
    else if(comment.post.userId.equals(user._id)) {
        canDelete = true;
    }
    //If you're admin
    else if((await UserModel.findById(user._id).exec())?.admin) {
        canDelete = true;
    }
    //If you're are admin or moderator in group which commented post belongs to
    else if(comment.post.groupId) {
        const role = await getRole(comment.post.groupId.toString(), user._id);

        if(role) {
            canDelete = true;
        }
    }

    if(canDelete) {
        await CommentModel.findByIdAndDelete(id).exec();
        return res.status(200).send();
    }
    else {
        return res.status(403).send();
    }
}