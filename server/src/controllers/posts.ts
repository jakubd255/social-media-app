import {Request, Response} from "express";
import PostModel from "../models/posts";
import getPostsHome from "../queries/posts/getPostsHome";
import getPostsSaved from "../queries/posts/getPostsSaved";
import getPostsProfile from "../queries/posts/getPostsProfile";
import getPostsGroup from "../queries/posts/getPostsGroup";
import getPostsExplore from "../queries/posts/getPostsExplore";
import getPostsAdmin from "../queries/posts/getPostsAdmin";
import getUsersVoters from "../queries/users/getUsersVoters";
import mongoose from "mongoose";
import GroupModel from "../models/groups";
import UserModel from "../models/users";
import getRole from "../queries/groups/getRole";
import CommentModel from "../models/comments";

const pageSize = 10;



//Create new post
export const add = async (req: Request, res: Response) => {
    const {user} = req.body;
    const files: Express.Multer.File[] = (req.files as Express.Multer.File[]) || [];
    const filesPaths = files.map((file) => file.path.split("/")[1]);

    const post = JSON.parse(req.body.postData);

    if(filesPaths.length) {
        post.files = filesPaths;
    }

    let canAdd = false;

    //Check if can you add post if it is for group
    if(post.groupId) {
        const group = await GroupModel.findOne(
            {
                _id: new mongoose.Types.ObjectId(post.groupId), 
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
        const {posting} = group.privilages;

        if(posting === "all" || (posting === "mod" && role) || role === "admin" || role === "author") {
            canAdd = true;
        }
    }
    else {
        canAdd = true;
    }

    if(canAdd) {
        const newPost = new PostModel(post);
        await newPost.save();

        return res.status(201).json({postId: newPost._id, files: filesPaths});
    }
    else {
        return res.status(403).send();
    }
}



//Get posts
export const get = async (req: Request, res: Response) => {
    const user = req.body.user;
    const {choice, id} = req.params;
    const page = parseInt(String(req.query.page)) || 1;

    let posts;

    //Posts form home page
    if(!choice) {
        posts = await getPostsHome(user._id, page, pageSize);
    }
    //Saved posts
    else if(choice === "saved") {
        posts = await getPostsSaved(user._id, page, pageSize);
    }
    //Chosen user's posts
    else if(choice === "user") {
        posts = await getPostsProfile(user._id, id, page, pageSize);
    }
    //Chosen group's posts
    else if(choice === "group") {
        posts = await getPostsGroup(user._id, id, page, pageSize);
    }
    else {
        return res.status(404).send();
    }

    return res.status(200).json({posts: posts});
};



//Explore posts
export const explore = async (req: Request, res: Response) => {
    const {input} = req.params;
    const page = parseInt(String(req.query.page)) || 1;

    const posts = await getPostsExplore(req.body.user._id, page, pageSize, input);
    
    return res.status(200).json({posts: posts});
}



//Get all posts as admin
export const adminGet = async (req: Request, res: Response) => {
    const {input} = req.params;
    const page = parseInt(String(req.query.page)) || 1;

    const posts = await getPostsAdmin(page, pageSize, input);

    const searchCriteria = {
        $or: [
            {text: {$regex: new RegExp(input, "i")}},
            {"user.username": {$regex: new RegExp(input, "i")}},
            {"user.fullname": {$regex: new RegExp(input, "i")}}
        ]
    };
    
    const pages = Math.ceil(await PostModel.countDocuments(input ? searchCriteria : {})/pageSize);

    return res.status(200).json({posts: posts, pages: pages});
}



//Get users which voted for chosen option
export const getVoters = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {id, index} = req.params;

    const page = parseInt(String(req.query.page)) || 1;

    const users = await getUsersVoters(id, user._id, parseInt(index), page, pageSize);

    return res.status(200).json({users: users});
}



//Like or unlike the post
export const like = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {user} = req.body;

    const userId = new mongoose.Types.ObjectId(user._id);

    //If chosen post is not liked
    const post = await PostModel.findOneAndUpdate(
        {_id: new mongoose.Types.ObjectId(id), likes: {$ne: userId}},
        {$addToSet: {likes: userId}}
    ).select("_id").exec();

    //If chosen post is already liked - remove like
    if(!post) {
        const post2 = await PostModel.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(id), likes: userId},
            {$pull: {likes: userId}}
        ).select("_id").exec();

        if(!post2) {
            return res.status(404).json({message: "Post not found"});
        }
    }

    return res.status(200).send();
}



//Save or unsave the post
export const save = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {user} = req.body;

    const userId = new mongoose.Types.ObjectId(user._id);

    //If chosen post is not saved
    const post = await PostModel.findOneAndUpdate(
        {_id: new mongoose.Types.ObjectId(id), saves: {$ne: userId}},
        {$addToSet: {saves: userId}}
    ).select("_id").exec();

    //If chosen post is already saved
    if(!post) {
        const post2 = await PostModel.findOneAndUpdate(
            {_id: new mongoose.Types.ObjectId(id), saves: userId},
            {$pull: {saves: userId}}
        ).select("_id").exec();

        if(!post2) {
            return res.status(404).json({message: "Post not found"});
        }
    }

    return res.status(200).send();
}



//Vote in the survey
export const vote = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {user, index} = req.body;

    const userId = new mongoose.Types.ObjectId(user._id);

    //Remove your earlier vote if it exists
    await PostModel.findByIdAndUpdate(id,
        {$pull: {"survey.choices.$[].votes": userId}},
        {multi: true}
    )
    .select("_id").exec();

    //Add new vote
    const post = await PostModel.findByIdAndUpdate(id,
        {$addToSet: {[`survey.choices.${index}.votes`]: userId}},
        {new: true}
    )
    .select("_id").exec();

    if(!post) {
        return res.status(404).send();
    }

    return res.status(200).send();
}



//Add new vote option
export const addVoteOption = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {option} = req.body;

    const post = await PostModel.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(id),
            "survey.open": true
        },
        {$push: {
            "survey.choices": {
                text: option,
                votes: []
            }
        }},
        {new: true}
    ).exec();

    if(!post) {
        return res.status(404).send();
    }

    return res.status(200).send();
}



//Remove post
export const remove = async (req: Request, res: Response) => {
    const {user} = req.body;
    const {id} = req.params;
    const post = await PostModel.findByIdAndDelete(id).select("_id userId groupId").exec();

    if(!post) {
        return res.status(404).send();
    }

    let canDelete = false;

    //If you're post's author
    if(post.userId.equals(user._id)) {
        canDelete = true;
    }
    //If you're admin
    else if((await UserModel.findById(user._id).exec())?.admin) {
        canDelete = true;
    }
    //If you're are admin or moderator in group which post belongs to
    else if(post.groupId) {
        const role = await getRole(post.groupId.toString(), user._id);

        if(role) {
            canDelete = true;
        }
    }

    if(canDelete) {
        await PostModel.findByIdAndDelete(id).exec();
        await CommentModel.deleteMany({postId: post._id}).exec();
        return res.status(200).send();
    }
    else {
        return res.status(403).send();
    }
}