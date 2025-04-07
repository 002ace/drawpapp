import jwt from "jsonwebtoken";
import { Request, Response ,NextFunction } from "express";



export const middleware =  async(req:Request , res:Response  , next:NextFunction)=>
{
      try
      {   
            const {token} =  req.cookies;
            console.log(token);

            if(!token)
            {
                return res.status(401).json({ message: "token required" }); 
            }
            const jwt_secret = "!1234";
            const decode =  await jwt.verify(token , jwt_secret);

            if(decode)
            {    
                  //@ts-ignore
                  req.userId  =  decode.userId
                  //@ts-ignore
                  req.name =  decode.name

                  next();

            }
            else
            { 
                return res.status(401).json({ message: "token not verify" });

            }


      }
      catch(error)
      {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
}

