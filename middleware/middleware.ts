import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export const apiAuthMiddleware = (req: Request, res: Response,  next: NextFunction) => {
    console.log('Request Url:',req.url,  )
    if(req.method?.toLowerCase() === "post"){
        console.log('Request payload', req.body)
    }

    if(req.get("token") !== process.env.TOKEN){
        res.status(403).json({
            message: "Unauthorized"
        }).end()
    }else{
        next()
    }
  }

export const apiUserAuthMiddleware = async (req: Request, res: Response,  next: NextFunction) => {
    if(!req.get("user-token")){
        res.status(403).json({
            message: "token unauthorized"
        }).end()
    }else{
        try {
            await jwt.verify(req.get("user-token")!, process.env.KEY_JWT_USER!)
                        next()
        } catch (error) {
            res.status(403).json({
                message: "token invalid"
            }).end()
        } 
    }
}