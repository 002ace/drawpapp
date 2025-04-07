
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import {jwt_secret}  from "@repo/backend-common/config"
import {prismaClient}  from "@repo/db/client"


interface SignupBody {
    name: string;
    email: string;
    password: string;
  }

interface LoginBody{
    
     email:string,
     password:string,
    
}

export const signup   = async(req: Request<SignupBody> , res:Response) =>{
     try
     {     // @ts-ignore
           const{name , email , password} = req.body ;
           if (!name || !email || !password) {
            return res.status(403).json({
              success: false,
              message: "All fields are required",
            });
           }
          //@ts-ignore
          const findDetails =  await prismaClient.user.findUnique({
                                 //@ts-ignore
                                  where:{email}
                               })
          // @ts-ignore
          if(findDetails)
          {
                  return res.status(403).json({
                     success:false,
                     message:"User is already exist"

                  })
          }

          const hashpassword  =  await bcrypt.hash(password , 10);

          const user  =  await  prismaClient.user.create({
                            //@ts-ignore
                            data:{
                                 name:name,
                                 email:email,
                                 password:hashpassword
                            }

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


export const login  =  async(req:Request<LoginBody> , res:Response) =>{
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

            const user  =  await prismaClient.user.findUnique({
                                      //@ts-ignore
                                      where:{email}
                                  });

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
                  userId  : user.id,
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

interface Room{
      name:String
}

export const createRoom   =  async(req:Request<Room> , res:Response)=>{
      try
      {  
             const {name} =  req.body ;

             if(!name)
             {
                   return res.status(411).json({
                           success:false,
                           message:"All fields required"
                   })
             }
            
             //@ts-ignore
             const userId  =  req.userId;
             try
             { 

                  const room =  await prismaClient.room.create({
                                     data:{
                                            adminId:userId,
                                            slug:name
                                     }
                                 })
                  return res.status(200).json({success:true,message:"room created successfullt",room:room})

             }
             catch(error)
             {   
                  return res.status(500).json({success:false, message:"unique room code require",
                         //@ts-ignore
                        error:error.message})

             }






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


export const getRoomDetails =  async(req:Request ,  res:Response)=>{

      try
      {  
          const details =  await prismaClient.room.findMany({});

          if(!details || details.length === 0)
          { 
             return res.status(200).json({
                  success:false,
                  message:"cannot find any details"
             })

          }

          return res.status(200).json({
                  success:false,
                  details:details
          })

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


export  const  getChatDetails =  async(req:Request , res:Response)=>{
     try 
     {    
           console.log("hii what are you doing here")
          // @ts-ignore
          const {roomId} =  req.params;
          console.log(roomId)
          const id  =  Number(roomId)
          const  message  =  await prismaClient.chat.findMany({
                                // @ts-ignore
                                where:{roomId:id},
                                orderBy:{
                                    id:"desc"
                                },
                                take:50
                       })
           if(!message)
           {
               res.status(403).json({success:false, message:message});
           }
           return res.status(200).json({success:true, message:message});

     }
     catch(error)
     {   
         return res.status(500).json({
            success:false,
            message:"failed to fetch details",
            //@ts-ignore
            error:error.message

         })  

     }
}    





