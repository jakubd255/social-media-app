import jwt, {JwtPayload} from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";



const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const tokenCookie = req.cookies["access-token"];

    if(!tokenCookie) {
        return res.status(401).send();
    }

    const token: string = tokenCookie;

    if(!token)
        return res.status(401).send();

    if(!process.env.ACCESS_TOKEN) {
        return res.status(500).send();
    }

    jwt.verify(token, (process.env.ACCESS_TOKEN), (err, data) => {
        if(err) {
            return res.status(401).send();
        }
        
        const jwtData = data as JwtPayload;
        req.body.user = jwtData.payload;
        
        next();
    });
}

export default authenticate;