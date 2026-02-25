import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";



const auth = (...role: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if(!token){
                return res.status(500).json({message: "You are not allowed!!"});
            };

            const parsedToken = token.split(" ")[1];

            console.log(parsedToken)

            const decoded = jwt.verify(parsedToken as string, config.jwt_secret as string) as JwtPayload;
            req.user = decoded;


            if(role.length && !role.includes(decoded.role)){
                res.status(401).json({error: "Unauthorized!!!"});
            };

            next();
            
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }
}

export default auth;