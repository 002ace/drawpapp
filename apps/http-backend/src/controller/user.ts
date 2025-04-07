import  {User} from "../model/userSchema";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import {jwt_secret}  from "@repo/backend-common/config"


interface SignupBody {
    name: string;
    email: string;
    password: string;
  }

interface LoginBody{
    
     email:string,
     password:string,
    
}

exports.signup   = async(req: Request<SignupBody> , res:Response) =>{
     try
     {     // @ts-ignore
           const{name , email , password} = req.body ;
           
           if (!name || !email || !password) {
            return res.status(403).json({
              success: false,
              message: "All fields are required",
            });
           }
          
          const findDetails = User.findOne({email});
          // @ts-ignore
          if(findDetails)
          {
                  return res.status(403).json({
                     success:false,
                     message:"User is already exist"

                  })
          }

          const hashpassword  =  await bcrypt.hash(password , 10);

          const user  =  await User.create({
                                name,
                                email,
                                password:hashpassword
             
                             })

           return res.status(200).json({
                success:true,
                message:"Signup successfully",
                data:user

           })


     }
     catch(error)
     {     
        return res.status(500).json({
            success:false,
            message:"failed to signup",
            //@ts-ignore
            error:error.message

         })     

     }
}


exports.login  =  async(req:Request<LoginBody> , res:Response) =>{
      try
      {   
            const{email,password} =  req.body  ;

            if(!email || !password)
            {
                   return res.status(403).json({
                       success:false,
                       messsage:"All fields required",

                   })
            }

            const user  =  await User.findOne({email});

            if(user === null)
            {    
                  return  res.status(403).json({
                       success:false,
                       message:"you need to first signup"
                  })
                 

            }
            // @ts-ignore
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
              return res.status(401).json({ message: "Invalid email or password" });
            }

            const payload  =  {
                  userId  : user._id,
                  name:user.name
            }
            
            let token =  jwt.sign(payload , jwt_secret ,{expiresIn:"1h"});

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000,
             });
              
            res.status(200).json({
                success: true,
                message: "Logged in successfully",
            });
              
      }
      catch(error)
      {     
        return res.status(500).json({
            success:false,
            message:"failed to login",
            //@ts-ignore
            error:error.message

         })     

      }
}




