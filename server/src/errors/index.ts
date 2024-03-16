import {Request, Response} from "express";



export const catchAsync = (fn: (req: Request, res: Response) => Promise<Response>) => {
    return (req: Request, res: Response) => {
        try
        {
            fn(req, res);
        }
        catch(error)
        {
            return res.status(500).send("Something went wrong");
        }
    }
}