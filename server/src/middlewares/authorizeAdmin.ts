import {Request, Response, NextFunction} from "express";
import UserModel from "../models/users";



const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.user._id;

    const user = await UserModel.findById(id).select("_id admin").exec();

    if(!user) {
        return res.status(404).send();
    }

    if(!user.admin) {
        return res.status(403).send();
    }

    next();
}

export default authorizeAdmin;