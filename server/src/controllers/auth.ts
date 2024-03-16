import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/users";
import bcrypt from "bcrypt";



export const register = async (req: Request, res: Response) => {
    const user = req.body;
    const emailTaken = (await UserModel.exists({email: user.email}).exec()) || user.email === "admin@admin.com";
    const usernameTaken = (await UserModel.exists({username: user.username}).exec()) || user.username === "admin";

    if(emailTaken || usernameTaken) {
        return res.status(409).json({
            emailTaken: !!emailTaken,
            usernameTaken: !!usernameTaken
        });
    }

    else if(!process.env.ACCESS_TOKEN) {
        return res.status(500).send();
    }

    else {
        const {password} = user;

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        user.password = bcrypt.hashSync(password, salt);

        const newUser = new UserModel(user);
        await newUser.save();

        const payload = {_id: newUser._id};

        const token = jwt.sign({payload}, process.env.ACCESS_TOKEN);

        res.cookie("access-token", token, {httpOnly: true});
        res.cookie("is-logged", "true");

        return res.status(201).send("Registered successfully");
    }
}



export const logIn = async (req: Request, res: Response) => {
    const {emailOrUsername, password} = req.body;

    const user = await UserModel.findOne({$or: [{email: emailOrUsername}, {username: emailOrUsername}]}).exec();
    if(!user) {
        return res.status(403).json({notExist: true});
    }

    const hash = user.password;
    const isCorrect = bcrypt.compareSync(password, hash);

    if(!isCorrect) {
        return res.status(403).json({invalid: true});
    }

    else if(!process.env.ACCESS_TOKEN) {
        return res.status(500).send();
    }

    else {
        const payload = {_id: user._id};
        const token = jwt.sign({payload}, process.env.ACCESS_TOKEN);

        res.cookie("access-token", token, {httpOnly: true});
        res.cookie("is-logged", "true");

        return res.status(200).send("Logged in successfully");
    }
}



export const logOut = async (req: Request, res: Response) => {
    res.clearCookie("access-token");
    res.clearCookie("is-logged");

    return res.status(200).send("Logged out successfully");
}