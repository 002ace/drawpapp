import {WebSocketServer,WebSocket}  from "ws"
import { jwt_secret } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import {prismaClient}  from "@repo/db/client"
const wss =  new WebSocketServer({port:8080});


interface User {
    ws: WebSocket;
    rooms: string[];
    userId: string;
  }
  

const users:User[] = [];



const checkUser  =  (token:string):string | null=>{
    //@ts-ignore
    try{
    const decode =  jwt.verify(token, jwt_secret) ;

    if(typeof decode === "string")
    {
          return null
    }
    //@ts-ignore
    if(!decode || !decode.userId)
    {
         return null
    }
     //@ts-ignore
    return decode.userId;
   }
   catch(e)
   {
        return null
   }
  
   

}

wss.on("connection" , async function connection(ws,request){
      const url =  request.url ;
      const queryParams =  new URLSearchParams(url?.split("?")[1])
      const   token  =  queryParams.get("token") || "";
    //   const decode =  jwt.verify(token, jwt_secret) ;
      console.log(token);
      const userId  = checkUser(token);

      if(!userId || userId == null )
      {
           ws.close();
           return ;
      }


      users.push({
         userId,
         rooms:[],
         ws
       })

      ws.on("message" , async function message(data){
         
        const parsedData  =  JSON.parse(data as unknown as string);
        if(parsedData.type === "join_room")
        {
             const user =  users.find(x=>x.ws === ws)
             user?.rooms.push(parsedData.roomId)
        }

        if(parsedData.type === "leave_room")
        {
               const  user =  users.find(x=>x.ws ===ws);
               if(!user)
               {
                  return 
               }
               user.rooms =  user?.rooms.filter(x=>x===parsedData.room)
        }

        if(parsedData.type  === "chat")
        {
              const roomId = parsedData.roomId;
              const message  =  parsedData.message;

              await prismaClient.chat.create({
                    data:{
                         roomId,
                         message,
                         userId
                    }
              })

              users.forEach(user=>{
                  if(user.rooms.includes(roomId)){
                    user?.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId

                    }))
                  }
              })
        }

          ws.send("pongcd ")
    }) 
})