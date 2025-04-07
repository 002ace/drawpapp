import {WebSocketServer}  from "ws"
import { jwt_secret } from "@repo/backend-common/config";
import jwt  from "jsonwebtoken";

const wss =  new WebSocketServer({port:8080});

wss.on("connection" , function connection(ws,request){
      const url =  request.url ;
      const queryParams =  new URLSearchParams(url?.split("?")[1])
      const   token  =  queryParams.get("token") || "";
      const decode =  jwt.verify(token, jwt_secret) ;

      if(typeof decode == "string")
      {
           ws.close();
           return ;
      }

      if(!decode || !decode.userId)
      {
          ws.close();
            return ;
      }


      ws.on("message" , function message(data){
          ws.send("pongcd ")
    }) 
})