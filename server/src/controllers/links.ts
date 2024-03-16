import {Request, Response} from "express";
import LinkModel from "../models/links"



export const add = async (req: Request, res: Response) => {
    const {days, groupId} = req.body;

    let link: any = {
        groupId: groupId
    };

    if(days) {
        link.expirationTime = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    const newLink = new LinkModel(link);
    await newLink.save();

    return res.status(201).json({link: newLink});
}



export const getAll = async (req: Request, res: Response) => {
    const {groupId} = req.params;
    const links = await LinkModel.find({groupId: groupId}).exec();

    return res.status(200).json({links: links});
}



export const remove = async (req: Request, res: Response) => {
    const {id} = req.params;

    const link = await LinkModel.findByIdAndDelete(id).exec();

    if(!link) {
        return res.status(404).send();
    }
    else {
        return res.status(200).send();
    }
}